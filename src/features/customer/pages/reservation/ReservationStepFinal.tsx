import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import type { ReservationConfirmRspType } from '@/features/customer/types/CustomerReservationType'
import ProfileImagePreview from '@/shared/components/ui/ProfileImagePreview'
import Loading from '@/shared/components/ui/Loading'

// 체크 이모지
const CheckCircleIcon: React.FC<{ colorClass?: string }> = ({
  colorClass = 'text-green-100'
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`h-16 w-16 ${colorClass}`}>
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.532-1.755-1.755a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
)

const ReservationStepFinal: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { headerRef } = useOutletContext<{
    headerRef: React.RefObject<{ refreshPoint: () => void }>
  }>()
  // location.state에서 결제 완료 데이터를 가져옵니다.
  const finalReservationData = location.state as ReservationConfirmRspType

  // 상태 관리 (필요에 따라 추가)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // Guard에서 이미 검증했으므로 데이터가 있다고 가정
    if (finalReservationData) {
      setDataLoaded(true)
      if (
        (
          finalReservationData as ReservationConfirmRspType & {
            paymentMethod?: string
          }
        ).paymentMethod === 'POINT'
      ) {
        headerRef?.current?.refreshPoint()
      }
    }
  }, [finalReservationData, headerRef])

  // profileImagePath 배열 문자열을 파싱하여 첫 번째 URL 반환
  const getProfileImageUrl = (
    profileImagePath: string | null
  ): string | null => {
    if (!profileImagePath) return null

    try {
      // JSON 배열 형태의 문자열을 파싱
      const parsed = JSON.parse(profileImagePath)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]
      }
    } catch {
      // 파싱 실패 시 원본 문자열이 URL인지 확인
      if (
        typeof profileImagePath === 'string' &&
        profileImagePath.startsWith('http')
      ) {
        return profileImagePath
      }
    }

    return null
  }

  // 시간 함수
  const formatReservationTime = (
    startTime?: string,
    turnaround?: number
  ): string => {
    if (!startTime || !turnaround) return '-'

    // HH:MM:SS 형식에서 HH:MM만 추출
    const timeParts = startTime.split(':')
    const startHour = parseInt(timeParts[0], 10)
    const startMinute = parseInt(timeParts[1], 10)

    const endDate = new Date()
    endDate.setHours(startHour)
    endDate.setMinutes(startMinute + turnaround * 60)

    const endHour = String(endDate.getHours()).padStart(2, '0')
    const endMinute = String(endDate.getMinutes()).padStart(2, '0')

    const formattedStartTime = `${startHour.toString().padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`
    return `${formattedStartTime} ~ ${endHour}:${endMinute} (${turnaround}시간)`
  }

  if (!dataLoaded) {
    return (
      <Loading
        message="예약 정보를 불러오는 중입니다..."
        size="lg"
        fullScreen={true}
      />
    )
  }

  return (
    <div className="flex w-full flex-col items-center px-4 py-6 sm:px-8 md:px-16">
      <div className="flex w-full max-w-[800px] flex-col items-center gap-3 rounded-xl bg-white p-4 sm:p-6 md:p-8">
        <CheckCircleIcon colorClass="text-indigo-600" />
        <h2 className="mb-2 text-center text-xl font-bold text-gray-900 sm:text-2xl">
          예약이 완료되었습니다
        </h2>
        <p className="mb-4 text-center text-sm text-gray-600 sm:mb-6 sm:text-base">
          예약 내역은 마이페이지에서 확인하실 수 있습니다
        </p>

        {/* 예약 정보 요약 카드 */}
        <div className="flex w-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:gap-6 sm:p-6">
          {/* 예약 번호 및 예약 상태 */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              예약 확정
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-4">
            {/* 서비스 정보 섹션 */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                서비스 정보
              </h3>
              <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
                <span className="text-gray-500">서비스 종류</span>
                <span className="font-medium text-gray-900">
                  {finalReservationData.serviceName || '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
                <span className="text-gray-500">서비스 날짜</span>
                <span className="font-medium text-gray-900">
                  {finalReservationData.requestDate || '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
                <span className="text-gray-500">서비스 시간</span>
                <span className="font-medium text-gray-900">
                  {formatReservationTime(
                    finalReservationData.startTime,
                    finalReservationData.turnaround
                  )}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
                <span className="text-gray-500">서비스 주소</span>
                <div className="text-right font-medium text-gray-900 sm:text-left lg:text-right">
                  <div>{finalReservationData.roadAddress}</div>
                  <div>{finalReservationData.detailAddress}</div>
                </div>
              </div>
            </div>

            {/* 담당 매니저 섹션 */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 shadow-sm lg:order-last">
              <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
                담당 매니저
              </h3>
              <div className="mb-2">
                <ProfileImagePreview
                  src={getProfileImageUrl(
                    (
                      finalReservationData as ReservationConfirmRspType & {
                        profileImagePath?: string
                      }
                    ).profileImagePath || null
                  )}
                  alt={`${finalReservationData.managerName} 매니저 프로필`}
                  size="md"
                  className="shadow-sm ring-2 ring-white"
                />
              </div>
              <div className="text-sm font-semibold text-gray-900 sm:text-base">
                {finalReservationData.managerName} 매니저
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4" />

          {/* 결제 정보 섹션 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
              결제 정보
            </h3>

            {/* 메인 서비스 */}
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-600">메인 서비스</span>
              <span />
            </div>
            <div className="flex flex-col gap-1 pl-4 text-sm sm:flex-row sm:justify-between">
              <span className="text-gray-500">
                {finalReservationData.serviceName}
                <span className="text-gray-500">
                  {' '}
                  {finalReservationData.turnaround}시간
                </span>
              </span>
              <span className="font-medium text-gray-900">
                {finalReservationData.price.toLocaleString()}원
              </span>
            </div>

            {/* 추가 서비스 */}
            {(
              finalReservationData as ReservationConfirmRspType & {
                extraServiceList?: Array<{
                  extraServiceName: string
                  extraServiceTime: number
                  extraServicePrice: number
                }>
              }
            ).extraServiceList &&
              (
                finalReservationData as ReservationConfirmRspType & {
                  extraServiceList?: Array<{
                    extraServiceName: string
                    extraServiceTime: number
                    extraServicePrice: number
                  }>
                }
              ).extraServiceList!.length > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-600">
                      추가 서비스
                    </span>
                    <span />
                  </div>
                  {(
                    finalReservationData as ReservationConfirmRspType & {
                      extraServiceList?: Array<{
                        extraServiceName: string
                        extraServiceTime: number
                        extraServicePrice: number
                      }>
                    }
                  ).extraServiceList?.map(
                    (
                      service: {
                        extraServiceName: string
                        extraServiceTime: number
                        extraServicePrice: number
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="flex flex-col gap-1 pl-4 text-sm sm:flex-row sm:justify-between">
                        <span className="text-gray-500">
                          {service.extraServiceName}
                          {service.extraServiceTime > 0 && (
                            <span className="text-gray-500">
                              {' '}
                              {service.extraServiceTime}시간
                            </span>
                          )}
                        </span>
                        <span className="font-medium text-gray-900">
                          {service.extraServicePrice?.toLocaleString()}원
                        </span>
                      </div>
                    )
                  )}
                </>
              )}

            {/* 총 결제 금액 */}
            <div className="my-3 border-t border-gray-200" />
            <div className="flex flex-col gap-1 text-base font-semibold sm:flex-row sm:justify-between">
              <span className="text-gray-900">총 결제 금액</span>
              <span className="text-lg font-bold text-indigo-600">
                {finalReservationData.price?.toLocaleString() || 0}원
              </span>
            </div>
            {/* 결제 방법 */}
            <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
              <span className="text-gray-500">결제 수단</span>
              <span className="font-medium text-gray-900">
                {(
                  finalReservationData as ReservationConfirmRspType & {
                    paymentMethod?: string
                  }
                ).paymentMethod === 'POINT'
                  ? '포인트'
                  : (
                      finalReservationData as ReservationConfirmRspType & {
                        paymentMethod?: string
                      }
                    ).paymentMethod || '-'}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4" />

          {/* 취소 및 환불 정책 섹션 
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-900">취소 및 환불 정책</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {finalReservationData.cancellationPolicy?.map((policy, index) => (
                <li key={index}>{policy}</li>
              ))}
            </ul>
          </div>*/}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-4 flex w-full flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() =>
              navigate(`/my/reservations/${finalReservationData.reservationId}`)
            } // 마이페이지 예약 내역으로 이동
            className="flex h-12 w-full items-center justify-center rounded-lg bg-gray-200 text-base font-semibold text-gray-700 hover:bg-gray-300 sm:w-48">
            예약 내역 확인
          </button>
          <button
            onClick={() => navigate('/')} // 홈으로 이동
            className="flex h-12 w-full items-center justify-center rounded-lg bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-700 sm:w-48">
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReservationStepFinal
