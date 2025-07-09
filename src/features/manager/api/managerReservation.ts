import api from '@/services/axios'
import type { ManagerReservationDetail } from '@/features/manager/types/ManagerReservationType'
import { ReservationStatusMap } from '@/features/manager/utils/ManagerReservationStauts'

// 문의사항 목록 조회
export const searchManagerReservations = async (params: {
  fromRequestDate?: string
  toRequestDate?: string
  reservationStatus?: string
  isCheckedIn?: string
  isCheckedOut?: string
  isReviewed?: string
  customerNameKeyword?: string
  page: number
  size: number
}) => {
  // 문자열 "true"/"false"를 실제 boolean으로 변환
  const convertStringToBool = (value?: string): boolean | undefined => {
    if (value === 'true') return true
    if (value === 'false') return false
    return undefined // "" 또는 undefined는 필터 제외
  }

  // 불필요한 빈 문자열 제거
  const cleanedParams = Object.fromEntries(
    Object.entries({
      ...params,
      isCheckedIn: convertStringToBool(params.isCheckedIn),
      isCheckedOut: convertStringToBool(params.isCheckedOut),
      isReviewed: convertStringToBool(params.isReviewed)
    }).filter(([, value]) => value !== undefined && value !== '')
  )

  const res = await api.get('/managers/reservations', { params: cleanedParams })
  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '예약 목록 조회에 실패했습니다.')
  }

  // API 응답 데이터 매핑 (고객명, 주소 필드, 상태명 표준화)
  const mappedBody = {
    ...res.data.body,
    content:
      res.data.body.content?.map((reservation: any) => ({
        ...reservation,
        customerName:
          reservation.customerName ||
          reservation.userName ||
          reservation.name ||
          reservation.customer_name ||
          '-',
        customerAddress:
          reservation.customerRoadAddress && reservation.customerDetailAddress
            ? `${reservation.customerRoadAddress.replace(/^대한민국\s+/, '')}, ${reservation.customerDetailAddress}`.trim()
            : (reservation.customerRoadAddress || '').replace(
                /^대한민국\s+/,
                ''
              ) ||
              reservation.customerDetailAddress ||
              (reservation.customerAddress || '').replace(/^대한민국\s+/, '') ||
              '-',
        statusName:
          reservation.statusName ||
          ReservationStatusMap[
            reservation.status as keyof typeof ReservationStatusMap
          ]?.label ||
          reservation.status ||
          '-'
      })) || []
  }

  return mappedBody
}

// 예약 상세 조회
export const getManagerReservation = async (
  reservationId: number
): Promise<ManagerReservationDetail> => {
  const res = await api.get(`/managers/reservations/${reservationId}`)
  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '문의사항 상세 조회에 실패했습니다.')
  }

  return res.data.body
}

// 체크인
export const checkIn = async (reservationId: number, inFileId?: number) => {
  const body: Record<string, unknown> = {}
  if (inFileId !== undefined) body.inFileId = inFileId
  const res = await api.post(
    `/managers/reservations/${reservationId}/check-in`,
    body
  )

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '체크인에 실패했습니다.')
  }

  return res.data.body
}

// 체크아웃
export const checkOut = async (reservationId: number, outFileId?: number) => {
  const body: Record<string, unknown> = {}
  if (outFileId !== undefined) body.outFileId = outFileId
  const res = await api.patch(
    `/managers/reservations/${reservationId}/check-out`,
    body
  )

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '체크아웃에 실패했습니다.')
  }

  return res.data.body
}

// 예약 수락
export const acceptReservation = async (reservationId: number) => {
  const res = await api.post(`/managers/reservations/${reservationId}/accept`)

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '예약 수락에 실패했습니다.')
  }

  return res.data.body
}

// 예약 거절
export const rejectReservation = async (
  reservationId: number,
  cancelReason: string
) => {
  const res = await api.post(`/managers/reservations/${reservationId}/reject`, {
    cancelReason: cancelReason
  })

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '예약 거절에 실패했습니다.')
  }

  return res.data.body
}
