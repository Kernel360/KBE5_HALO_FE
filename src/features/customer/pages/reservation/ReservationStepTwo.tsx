import React, { useEffect, useState, useRef } from 'react'
import { formatDateWithDay } from '@/shared/utils/dateUtils'
import { useLocation, useNavigate, useBlocker } from 'react-router-dom'
import type {
  ReservationMatchedRspType,
  ManagerMatchingRspType,
  ReservationConfirmReqType,
  PageInfo,
  ManagerMatchingReqType
} from '@/features/customer/types/CustomerReservationType'
import { AlertCircle } from 'lucide-react'
import { ReservationStepIndicator } from '@/features/customer/components/ReservationStepIndicator'
import { ManagerSelector } from '@/features/customer/components/ManagerSelector'
import Loading from '@/shared/components/ui/Loading'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import {
  confirmReservation,
  cancelBeforeConfirmReservation,
  getMatchingManagers
} from '@/features/customer/api/CustomerReservation'

interface Props {
  reservationData: ReservationMatchedRspType
  onNext: (data: unknown) => void
}

const ReservationStepTwo: React.FC<Props> = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const reservationData = location.state as ReservationMatchedRspType
  const [selectedManager, setSelectedManager] =
    useState<ManagerMatchingRspType | null>(null)
  const [managers, setManagers] = useState<ManagerMatchingRspType[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | undefined>(undefined)
  const [, setCurrentPage] = useState(0)
  const [currentSort, setCurrentSort] = useState('averageRating')
  const [isLoadingManagers, setIsLoadingManagers] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'POINT' | 'CARD'>('POINT')
  const isNavigatingRef = useRef(false)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue =
        '예약 진행 중입니다. 페이지를 떠나면 예약이 취소됩니다. 정말 나가시겠습니까?'
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (isNavigatingRef.current) return false
    return currentLocation.pathname !== nextLocation.pathname
  })

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const shouldContinue = window.confirm(
        '예약 진행 중입니다. 페이지를 떠나면 예약이 취소됩니다. 정말 나가시겠습니까?'
      )
      if (shouldContinue) {
        ;(async () => {
          if (reservationData?.reservation?.reservationId) {
            try {
              await cancelBeforeConfirmReservation(
                reservationData.reservation.reservationId,
                { matchedManagers: managers.map(manager => manager.managerId) }
              )
            } catch {
              // 예약 취소 실패 시 무시
            }
          }
          blocker.proceed()
          navigate('/')
        })()
      } else {
        blocker.reset()
      }
    }
  }, [blocker])

  // 매니저 데이터 로드
  useEffect(() => {
    if (reservationData?.matchedManagers?.content) {
      setManagers(reservationData.matchedManagers.content)
      setPageInfo(reservationData.matchedManagers.page)
    }
  }, [reservationData])

  // 에러 토스트 표시 함수
  const showError = (message: string) => {
    setErrorMessage(message)
    setShowErrorToast(true)
  }

  // 정렬 파라미터 매핑
  const mapSortParam = (sortBy: string) => {
    const sortMapping: Record<string, string> = {
      averageRating: 'averageRating',
      reviewCount: 'reviewCount',
      reservationCount: 'reservationCount'
    }
    return sortMapping[sortBy] || 'averageRating'
  }

  // 매니저 리스트 새로고침
  const fetchManagers = async (page = 0, sortBy = 'averageRating') => {
    if (!reservationData?.reservation) return

    setIsLoadingManagers(true)
    try {
      const mappedSortBy = mapSortParam(sortBy)
      const payload: ManagerMatchingReqType & {
        page?: number
        size?: number
        sortBy?: string
        isAsc?: boolean
      } = {
        roadAddress: reservationData.reservation.roadAddress,
        detailAddress: reservationData.reservation.detailAddress,
        latitude: reservationData.reservation.latitude,
        longitude: reservationData.reservation.longitude,
        requestDate: reservationData.reservation.requestDate,
        startTime: reservationData.reservation.startTime,
        turnaround: reservationData.reservation.turnaround,
        page,
        size: 5,
        sortBy: mappedSortBy,
        isAsc: false
      }

      const response = await getMatchingManagers(payload)
      if (response?.body) {
        setManagers(response.body.content)
        const newPageInfo = response.body.page || {
          size: response.body.size,
          number: response.body.number,
          totalElements: response.body.totalElements,
          totalPages: response.body.totalPages
        }
        setPageInfo(newPageInfo)
        setCurrentPage(page)
        setCurrentSort(sortBy)
      }
    } catch {
      showError('매니저 목록을 불러오는데 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoadingManagers(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedManager) {
      showError('매니저를 선택해주세요.')
      return
    }

    if (!reservationData.reservation?.reservationId) {
      showError('예약 ID를 찾을 수 없습니다. 다시 시도해주세요.')
      return
    }

    if (paymentMethod === 'CARD') {
      showError(
        '카드 결제는 현재 서비스 준비중입니다. 포인트 결제를 이용해주세요.'
      )
      return
    }

    setIsNavigating(true)
    isNavigatingRef.current = true

    try {
      // 예약 확정 요청 데이터 구성
      const confirmRequest: ReservationConfirmReqType = {
        selectedManagerId: selectedManager.managerId,
        payReqDTO: {
          paymentMethod,
          amount: reservationData.reservation?.price ?? 0
        }
      }

      // API 호출
      const finalReservationResponse = await confirmReservation(
        reservationData.reservation.reservationId,
        confirmRequest
      )

      // 성공 시 최종 페이지로 이동
      if (finalReservationResponse?.body?.reservationId) {
        const reservationId = finalReservationResponse.body.reservationId

        // 경로 수정: 절대 경로로 변경
        navigate(`/reservations/${reservationId}/final`, {
          state: finalReservationResponse.body,
          replace: true // 뒤로가기 방지
        })
      } else {
        showError('예약 생성은 완료되었지만 예약 ID를 찾을 수 없습니다.')
      }
    } catch (error: unknown) {
      const errorMsg =
        (error as { message?: string })?.message ||
        '예약 확정에 실패했습니다. 다시 시도해주세요.'
      showError(errorMsg)
      setIsNavigating(false)
      isNavigatingRef.current = false
    }
  }

  // '08:00:00' -> '08:00' 형태로 변환
  const formatTimeToHHMM = (time: string | undefined): string => {
    if (!time) return ''
    return time.slice(0, 5)
  }

  const formatEndTime = () => {
    const { startTime, turnaround } = reservationData.reservation
    if (!startTime || !turnaround) return ''
    const [hour, minute] = formatTimeToHHMM(startTime).split(':').map(Number)
    const end = new Date()
    end.setHours(hour)
    end.setMinutes(minute)
    end.setHours(end.getHours() + turnaround)
    return `${formatTimeToHHMM(startTime)} ~ ${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')} (${turnaround}시간)`
  }

  return (
    <div className="flex w-full flex-col items-center px-4 py-6 sm:px-8 md:px-16 md:py-10">
      <ReservationStepIndicator step={2} />

      {/* 예약 진행 중 경고 메시지 - 전체 너비 */}
      <div className="mb-6 w-full max-w-[1200px] rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="flex items-center gap-1 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4" />
          예약 진행 중입니다. 다른 페이지로 이동하시면 예약이 취소됩니다.
        </p>
      </div>

      <div className="flex w-full max-w-[1200px] flex-col gap-6 lg:flex-row lg:gap-8">
        {/* 왼쪽: 매니저 선택 */}
        <div className="flex-1">
          {isLoadingManagers ? (
            <Loading
              message="매니저 목록을 불러오는 중..."
              size="lg"
            />
          ) : (
            <ManagerSelector
              managers={managers}
              selectedManager={selectedManager}
              onManagerSelect={setSelectedManager}
              pageInfo={pageInfo}
              currentSort={currentSort}
              onPageChange={page => {
                fetchManagers(page, currentSort)
              }}
              onSortChange={(sortBy: string) => {
                fetchManagers(0, sortBy) // 정렬 변경 시 첫 페이지로
              }}
            />
          )}
        </div>

        {/* 오른쪽: 예약 정보 요약 */}
        <div className="flex w-full flex-col gap-6 lg:sticky lg:top-6 lg:w-96 lg:self-start">
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              예약 정보
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-sm text-gray-500">서비스 종류</span>
                <span className="text-sm font-medium text-gray-900">
                  {reservationData.requestCategory?.serviceName || '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-sm text-gray-500">서비스 날짜</span>
                <span className="text-sm font-medium text-gray-900">
                  {reservationData.reservation?.requestDate
                    ? formatDateWithDay(reservationData.reservation.requestDate)
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-sm text-gray-500">서비스 시간</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatEndTime()}
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-sm text-gray-500">서비스 주소</span>
                <div className="text-sm font-medium text-gray-900">
                  <div>{reservationData.reservation?.roadAddress}</div>
                  <div>{reservationData.reservation?.detailAddress}</div>
                </div>
              </div>
              {reservationData.reservation?.memo && (
                <div className="text-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <span className="text-gray-500">요청 사항</span>
                  </div>
                  <div className="mt-1 font-medium text-gray-900">
                    {reservationData.reservation.memo}
                  </div>
                </div>
              )}
            </div>
            {/* 서비스 내역 섹션 추가 */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h4 className="mb-3 text-base font-semibold text-gray-900">
                서비스 내역
              </h4>
              <div className="flex flex-col gap-3">
                {/* 메인 서비스 */}
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="text-sm text-gray-500">메인 서비스</span>
                  <div className="text-sm font-medium text-gray-900">
                    <span>
                      {reservationData.requestCategory?.serviceName || '-'}
                    </span>
                    <span className="text-gray-500">
                      {' '}
                      {reservationData.requestCategory.serviceTime}시간
                    </span>
                    <span className="block sm:inline">
                      {' '}
                      {reservationData.requestCategory?.price?.toLocaleString() ||
                        0}
                      원
                    </span>
                  </div>
                </div>
                {/* 추가 서비스 (데이터가 있을 경우에만 렌더링) */}
                {reservationData.requestCategory?.children &&
                  reservationData.requestCategory.children.length > 0 && (
                    <>
                      {/* "추가 서비스" 라벨은 한 번만 표시 */}
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-500">
                          추가 서비스
                        </span>
                        <span></span>
                      </div>
                      {/* 각 추가 서비스 내역은 새로운 줄에 표시, 왼쪽 라벨 없음 */}
                      {reservationData.requestCategory.children.map(
                        (childService, index) => (
                          <div
                            key={`additional-service-${index}`}
                            className="flex flex-col gap-1 pl-4 text-sm sm:flex-row sm:justify-between">
                            <span></span>
                            <div className="text-sm font-medium text-gray-900">
                              <span>{childService.serviceName || '-'}</span>
                              {childService.serviceTime != 0 && (
                                <span className="text-gray-500">
                                  {' '}
                                  {childService.serviceTime}시간
                                </span>
                              )}
                              <span className="block sm:inline">
                                {' '}
                                {childService.price?.toLocaleString() || 0}원
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </>
                  )}
              </div>
            </div>
            <div className="my-4 border-t border-gray-200" />
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-base font-semibold text-gray-900">
                총 결제 금액
              </span>
              <span className="text-lg font-bold text-indigo-600">
                {reservationData.reservation?.price?.toLocaleString() || 0}원
              </span>
            </div>
          </div>

          {/* 결제 수단 선택 */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h4 className="mb-4 text-base font-semibold text-gray-900">
              결제 수단 선택
            </h4>
            <div className="space-y-3">
              {/* 포인트 결제 */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="POINT"
                  checked={paymentMethod === 'POINT'}
                  onChange={e =>
                    setPaymentMethod(e.target.value as 'POINT' | 'CARD')
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      포인트 결제
                    </span>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      사용 가능
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    보유 포인트로 간편하게 결제하세요
                  </p>
                </div>
              </label>

              {/* 카드 결제 */}
              <label className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 opacity-60">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={e =>
                    setPaymentMethod(e.target.value as 'POINT' | 'CARD')
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  disabled
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">카드 결제</span>
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                      서비스 준비중
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    신용카드/체크카드로 결제
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className={`flex h-12 flex-1 items-center justify-center rounded-lg text-base font-semibold transition-colors ${
                isNavigating
                  ? 'cursor-not-allowed bg-gray-400 text-gray-200'
                  : 'cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              onClick={handleSubmit}
              disabled={isNavigating}>
              {isNavigating ? '처리 중...' : '결제하기'}
            </button>
          </div>
        </div>
      </div>

      <ErrorToast
        open={showErrorToast}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  )
}

export default ReservationStepTwo
