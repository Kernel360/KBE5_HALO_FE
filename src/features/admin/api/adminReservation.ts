import api from '@/services/axios'
import qs from 'qs'
import type {
  AdminReservationSearchParams,
  AdminReservationListResponse,
  AdminReservationResponse,
  AdminReservationUpdateRequest
} from '../types/AdminReservationType'

// 예약 목록 조회
export const fetchAdminReservations = async (
  params?: AdminReservationSearchParams
): Promise<AdminReservationListResponse> => {
  // 상태 필터 변환
  const convertedStatusFilter = params?.status?.map(status => {
    switch (status) {
      case '대기중':
        return 'PENDING'
      case '확정':
        return 'CONFIRMED'
      case '진행중':
        return 'IN_PROGRESS'
      case '완료':
        return 'COMPLETED'
      case '취소':
        return 'CANCELLED'
      default:
        return status
    }
  })

  // 빈 값인 파라미터 제거
  const cleanedParams = Object.fromEntries(
    Object.entries({
      customerName: params?.customerName,
      managerName: params?.managerName,
      address: params?.address,
      fromRequestDate: params?.fromRequestDate,
      toRequestDate: params?.toRequestDate,
      reservationStatus:
        convertedStatusFilter && convertedStatusFilter.length > 0
          ? convertedStatusFilter
          : undefined,
      page: params?.page,
      size: params?.size,
      sort: params?.sort
    }).filter(([, value]) => value !== undefined && value !== ''))

  const res = await api.get('/admin/reservations', {
    params: cleanedParams,
    paramsSerializer: params =>
      qs.stringify(params, { arrayFormat: 'repeat' })
  })

  if (!res.data.success) {
    throw new Error(res.data.message || '예약 목록 조회에 실패했습니다.')
  }

  return res.data.body || res.data
}

// 예약 상세 조회
export const fetchAdminReservationById = async (
  reservationId: string
): Promise<AdminReservationResponse> => {
  const res = await api.get(`/admin/reservations/${reservationId}`)

  if (!res.data.success) {
    throw new Error(res.data.message || '예약 상세 조회에 실패했습니다.')
  }

  return res.data.body || res.data
}

// 예약 정보 수정
export const updateAdminReservation = async (
  reservationId: string,
  data: AdminReservationUpdateRequest
): Promise<AdminReservationResponse> => {
  const res = await api.put(`/admin/reservations/${reservationId}`, data)

  if (!res.data.success) {
    throw new Error(res.data.message || '예약 정보 수정에 실패했습니다.')
  }

  return res.data.body || res.data
}

// 예약 삭제 (취소)
export const deleteAdminReservation = async (
  reservationId: string
): Promise<void> => {
  const res = await api.delete(`/admin/reservations/${reservationId}`)

  if (!res.data.success) {
    throw new Error(res.data.message || '예약 삭제에 실패했습니다.')
  }

  return res.data.body || res.data
}

// 예약 상태 변경
export const updateReservationStatus = async (
  reservationId: string,
  status: string
): Promise<AdminReservationResponse> => {
  const res = await api.patch(`/admin/reservations/${reservationId}/status`, {
    status
  })

  if (!res.data.success) {
    throw new Error(res.data.message || '예약 상태 변경에 실패했습니다.')
  }

  return res.data.body || res.data
}

// 결제 상태 변경
export const updatePaymentStatus = async (
  reservationId: string,
  paymentStatus: string
): Promise<AdminReservationResponse> => {
  const res = await api.patch(`/admin/reservations/${reservationId}/payment`, {
    paymentStatus
  })

  if (!res.data.success) {
    throw new Error(res.data.message || '결제 상태 변경에 실패했습니다.')
  }

  return res.data.body || res.data
} 