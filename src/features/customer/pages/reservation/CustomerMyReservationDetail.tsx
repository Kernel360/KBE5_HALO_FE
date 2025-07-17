import { useEffect, useState } from 'react'
import HalfStar from '@/shared/components/HalfStar'
import { Star, Pencil } from 'lucide-react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import {
  getCustomerReservationDetail,
  cancelReservationByCustomer
} from '@/features/customer/api/CustomerReservation'
import type {
  CustomerReservationDetailRspType,
  CustomerReservationCancelReqType,
  ReservationStatus
} from '@/features/customer/types/CustomerReservationType'
import { serviceCategoryIcons } from '@/shared/constants/ServiceIcons'
import { DefaultServiceIcon } from '@/shared/constants/ServiceIcons'
import ProfileImagePreview from '@/shared/components/ui/ProfileImagePreview'
import { ReservationCancelModal } from '@/features/customer/modal/ReservationCancelModal'
import { CustomerReviewFormModal } from '@/features/customer/modal/CustomerReviewModal'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'

const getKoreanStatus = (status: ReservationStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return '예약 완료'
    case 'COMPLETED':
      return '방문 완료'
    case 'REQUESTED':
      return '예약 요청'
    case 'CANCELED':
      return '예약 취소'
    case 'IN_PROGRESS':
      return '서비스 진행 중'
    default:
      return status
  }
}

const getStatusBadgeClasses = (status: ReservationStatus) => {
  let classes = 'px-3 py-1 rounded-md text-base font-bold '
  switch (status) {
    case 'CONFIRMED':
      classes += ' text-blue-600'
      break
    case 'CANCELED':
      classes += ' text-red-400'
      break
    case 'IN_PROGRESS':
      classes += ' text-green-600'
      break
    case 'COMPLETED':
    case 'REQUESTED':
    default:
      classes += ' text-gray-600'
      break
  }
  return classes
}

export const CustomerMyReservationDetail = () => {
  const { reservationId } = useParams()
  const { headerRef } = useOutletContext<{
    headerRef: React.RefObject<{ refreshPoint: () => void }>
  }>()
  const [reservation, setReservation] =
    useState<CustomerReservationDetailRspType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)

  // 리뷰 모달 상태
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // profileImageUrl 배열 문자열을 파싱하여 첫 번째 URL 반환
  const getProfileImageUrl = (
    profileImageUrl: string | null
  ): string | null => {
    if (!profileImageUrl) return null

    try {
      // JSON 배열 형태의 문자열을 파싱
      const parsed = JSON.parse(profileImageUrl)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]
      }
    } catch {
      // 파싱 실패 시 원본 문자열이 URL인지 확인
      if (
        typeof profileImageUrl === 'string' &&
        profileImageUrl.startsWith('http')
      ) {
        return profileImageUrl
      }
    }

    return null
  }

  const fetchReservationDetail = async () => {
    if (!reservationId) return

    try {
      const response = await getCustomerReservationDetail(Number(reservationId))

      if (response?.body) {
        setReservation(response.body)
      } else {
        setError('예약 정보를 불러올 수 없습니다.')
      }
    } catch {
      setError('예약 정보를 불러오는 중 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    fetchReservationDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId])

  const handleCancelReservation = async (reason: string) => {
    if (!reservationId || !reservation) return

    setIsCanceling(true)
    try {
      const payload: CustomerReservationCancelReqType = {
        cancelReason: reason
      }
      await cancelReservationByCustomer(Number(reservationId), payload)
      alert('예약이 취소되었습니다.')
      // 예약 정보 새로고침
      fetchReservationDetail()
      // 헤더의 포인트 새로고침
      headerRef?.current?.refreshPoint()
    } catch {
      alert('예약 취소에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsCanceling(false)
    }
  }

  // 리뷰 모달 핸들러
  const handleOpenReviewModal = () => {
    setIsReviewModalOpen(true)
  }

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false)
  }

  const handleReviewSuccess = async (message: string) => {
    setToastMessage(message)
    setShowSuccessToast(true)
    // 리뷰 작성/수정 후 페이지 새로고침
    window.location.reload()
  }

  const handleWriteReview = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!reservationId || !reservation) return
    handleOpenReviewModal()
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  const IconComponent = reservation?.serviceCategoryId
    ? serviceCategoryIcons[reservation.serviceCategoryId] || DefaultServiceIcon
    : DefaultServiceIcon

  {
    /* 아이콘 영역 */
  }
  if (!reservation) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between text-xl font-bold text-gray-900">
        <span>예약 상세 정보</span>
        <div className="flex items-center gap-4">
          {reservation.reservationStatus === 'COMPLETED' &&
            (reservation.review ? (
              <button
                onClick={handleWriteReview}
                className="flex cursor-pointer items-center gap-1 rounded-md border border-indigo-500 bg-white px-4 py-2 text-sm text-indigo-600 transition-colors duration-200 hover:bg-indigo-50">
                <Pencil className="h-4 w-4" />
                리뷰 수정
              </button>
            ) : (
              <button
                onClick={handleWriteReview}
                className="flex cursor-pointer items-center gap-1 rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-indigo-700">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                리뷰 작성
              </button>
            ))}
          <span
            className={getStatusBadgeClasses(reservation.reservationStatus)}>
            {getKoreanStatus(reservation.reservationStatus)}
          </span>
        </div>
      </div>

      {/* 예약 정보 */}
      <div className="mt-3 mb-4 text-base font-semibold text-gray-900">
        예약 정보
      </div>
      <div className="rounded-xl bg-white px-6 py-4 text-sm text-slate-800 shadow">
        <div className="flex flex-col gap-6">
          <div className="flex gap-40">
            {/* 왼쪽 정보 블럭 */}
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-2xl text-indigo-500">
                  event
                </span>
                <div>
                  <div className="mb-1 text-xs font-semibold text-gray-500">
                    이용 날짜
                  </div>
                  <div className="text-gray-800">
                    {(() => {
                      const date = new Date(reservation.requestDate)
                      const dayOfWeek = date.toLocaleDateString('ko-KR', {
                        weekday: 'short'
                      })
                      return `${reservation.requestDate} (${dayOfWeek})`
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-2xl text-indigo-500">
                  schedule
                </span>
                <div>
                  <div className="mb-1 text-xs font-semibold text-gray-500">
                    예약 시간
                  </div>
                  <div className="text-gray-800">
                    {(() => {
                      const [hourStr, minuteStr] =
                        reservation.startTime.split(':')
                      const hour = Number(hourStr)
                      const minute = Number(minuteStr)
                      const endHour = hour + reservation.turnaround
                      const formattedStart = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
                      const formattedEnd = `${String(endHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
                      return `${formattedStart} ~ ${formattedEnd} (${reservation.turnaround}시간)`
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-2xl text-indigo-500">
                  location_on
                </span>
                <div>
                  <div className="mb-1 text-xs font-semibold text-gray-500">
                    서비스 주소
                  </div>
                  <div className="text-gray-800">
                    {reservation.roadAddress} {reservation.detailAddress}
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 정보 블럭 */}
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-2xl text-indigo-500">
                  call
                </span>
                <div>
                  <div className="mb-1 text-xs font-semibold text-gray-500">
                    예약 핸드폰 번호
                  </div>
                  <div className="text-gray-800">{reservation.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-2xl text-indigo-500">
                  {IconComponent && <IconComponent />}
                </span>
                <div>
                  <div className="mb-1 text-xs font-semibold text-gray-500">
                    서비스 종류
                  </div>
                  <div className="text-gray-800">{reservation.serviceName}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined mt-1 text-3xl text-indigo-500">
                  edit_note
                </span>
                <div>
                  <div className="mb-1 text-xs font-semibold text-gray-500">
                    메모
                  </div>
                  <div className="text-gray-800">
                    {reservation.memo || '작성하신 메모가 없습니다.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 매니저 정보 카드 */}
          {reservation.managerName && (
            <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 p-4">
              {/* 왼쪽: 프로필 이미지 */}
              <div className="flex-shrink-0">
                <ProfileImagePreview
                  src={getProfileImageUrl(
                    (
                      reservation as CustomerReservationDetailRspType & {
                        profileImageUrl?: string
                      }
                    ).profileImageUrl || null
                  )}
                  alt={`${reservation.managerName} 매니저 프로필`}
                  size="sm"
                  className="shadow-sm ring-2 ring-white"
                />
              </div>

              {/* 가운데: 이름 + 소개 */}
              <div className="ml-4 flex-1">
                <div className="text-base font-semibold text-gray-900">
                  {reservation.managerName}
                </div>
                <div className="text-sm text-gray-500">{reservation.bio}</div>
              </div>

              {/* 오른쪽: 평점 */}
              <div className="flex items-center gap-1">
                {[
                  ...Array(
                    Math.floor(reservation.mangerStatistic.averageRating)
                  )
                ].map((_, idx) => (
                  <Star
                    key={`full-${idx}`}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                {reservation.mangerStatistic.averageRating % 1 >= 0.25 &&
                  reservation.mangerStatistic.averageRating % 1 < 0.75 && (
                    <HalfStar
                      key="half"
                      className="h-4 w-4"
                      fillColor="text-yellow-400"
                      emptyColor="text-gray-200"
                    />
                  )}
                {[
                  ...Array(
                    5 - Math.ceil(reservation.mangerStatistic.averageRating)
                  )
                ].map((_, idx) => (
                  <Star
                    key={`empty-${idx}`}
                    className="h-4 w-4 text-gray-200"
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-700">
                  {reservation.mangerStatistic.averageRating.toFixed(1)} (
                  {reservation.mangerStatistic.reviewCount}
                  {reservation.mangerStatistic.reviewCount >= 50 ? '+' : ''})
                </span>
              </div>
            </div>
          )}

          {/* 리뷰 섹션 */}
          {reservation.reservationStatus === 'COMPLETED' &&
            reservation.review && (
              <div>
                <div className="mb-3 text-base font-semibold text-gray-900">
                  나의 리뷰
                </div>
                <div className="rounded-xl bg-white px-6 py-4 text-sm text-slate-800 shadow">
                  <div className="flex items-start justify-between">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {reservation.review.content}
                    </div>
                    <div className="ml-4 flex items-center gap-1">
                      {[
                        ...Array(Math.floor(reservation.review.rating ?? 0))
                      ].map((_, idx) => (
                        <Star
                          key={`review-full-${idx}`}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      {reservation.review.rating &&
                        reservation.review.rating % 1 >= 0.25 &&
                        reservation.review.rating % 1 < 0.75 && (
                          <HalfStar
                            key="review-half"
                            className="h-4 w-4"
                            fillColor="text-yellow-400"
                            emptyColor="text-gray-200"
                          />
                        )}
                      {[
                        ...Array(5 - Math.ceil(reservation.review.rating ?? 0))
                      ].map((_, idx) => (
                        <Star
                          key={`review-empty-${idx}`}
                          className="h-4 w-4 text-gray-200"
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {reservation.review.rating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="mt-5 mb-2 flex items-center justify-between">
        <span className="text-base font-semibold text-gray-900">결제 정보</span>
        {reservation.paidAt && (
          <span className="text-sm text-gray-600">
            결제 날짜:{' '}
            {new Date(reservation.paidAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </span>
        )}
      </div>
      <div className="rounded-xl bg-white px-6 py-4 text-sm text-slate-800 shadow">
        {/* 기본 서비스 */}
        <div className="mb-4">
          <div className="mb-1 text-sm text-gray-800">기본 서비스</div>
          <div
            key={reservation.serviceCategoryId}
            className="flex justify-between py-1 pl-16 text-sm">
            <span className="text-gray-800">
              {reservation.serviceName}
              {reservation.serviceTime !== 0 && (
                <span className="ml-1 text-gray-500">
                  ({reservation.serviceTime}시간)
                </span>
              )}
            </span>
            <span className="text-gray-900">
              {reservation.price.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 추가 서비스 */}
        {reservation.extraServices?.length > 0 && (
          <div>
            <div className="mb-1 text-sm text-gray-800">추가 서비스</div>
            <div className="flex flex-col gap-1 pl-16">
              {reservation.extraServices.map(item => (
                <div
                  key={item.extraServiceId}
                  className="flex justify-between py-1 text-sm">
                  <span className="text-gray-800">
                    {item.extraServiceName}
                    {item.extraServiceTime > 0 && (
                      <span className="ml-1 text-gray-500">
                        (+{item.extraServiceTime}시간)
                      </span>
                    )}
                  </span>
                  <span className="text-gray-900">
                    {item.extraServicePrice?.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 결제 수단 */}
        {reservation.paymentMethod && (
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>결제 수단</span>
            <span>
              {reservation.paymentMethod === 'POINT'
                ? '포인트'
                : reservation.paymentMethod || '-'}
            </span>
          </div>
        )}

        {/* 총 결제 금액 */}
        <div className="mt-4 flex justify-between border-t pt-2 font-bold text-indigo-600">
          <span>총 결제 금액</span>
          <span>
            {(
              reservation.price +
              (reservation.extraServices?.reduce(
                (acc, item) => acc + (item.extraServicePrice ?? 0),
                0
              ) ?? 0)
            ).toLocaleString()}
            원
          </span>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2">
        {['REQUESTED', 'CONFIRMED'].includes(reservation.reservationStatus) && (
          <button
            onClick={() => setIsCancelModalOpen(true)}
            disabled={isCanceling}
            className="font-base rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50">
            {isCanceling ? '취소 처리 중...' : '예약 취소'}
          </button>
        )}
        {/* {reservation.reservationStatus === 'COMPLETED' &&
          new Date(reservation.requestDate) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <button
              onClick={handleRefundRequest}
              className="px-3 py-2 rounded-2xl bg-blue-50 text-blue-600 text-sm font-base hover:bg-blue-100 transition"
            >
              환불 신청
            </button>
        )}*/}
      </div>

      {/* 예약 취소 모달 */}
      <ReservationCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={reason => {
          handleCancelReservation(reason)
          setIsCancelModalOpen(false)
        }}
        loading={isCanceling}
      />

      {/* 리뷰 모달 */}
      <CustomerReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        reservationId={reservationId ? Number(reservationId) : 0}
        onSuccess={handleReviewSuccess}
      />

      {/* 성공 토스트 */}
      <SuccessToast
        open={showSuccessToast}
        message={toastMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  )
}
