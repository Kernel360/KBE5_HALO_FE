// CustomerReservation.ts (API 호출)
import api from '@/services/axios'
import type {
  ReservationConfirmReqType,
  ReservationReqType,
  PreCancelReqType,
  CustomerReservationCancelReqType,
  ReservationSearchConditionType,
  ManagerMatchingReqType
} from '@/features/customer/types/CustomerReservationType'

// 서비스 카테고리 조회
export const getServiceCategories = async () => {
  const res = await api.get('/common/serviceCategory')
  return res.data
}

// 유저 정보 조회
export const getCustomerInfo = async () => {
  const res = await api.get('/customers/auth/my')
  return res.data
}

// 예약 요청
export const createReservation = async (payload: ReservationReqType & {}) => {
  const res = await api.post('/customers/reservations', payload)
  return res.data
}

// 예약 확정
export const confirmReservation = async (
  reservationId: number,
  payload: ReservationConfirmReqType
) => {
  const res = await api.patch(
    `/customers/reservations/${reservationId}/confirm`,
    payload
  )
  return res.data
}
// 예약 확정 전 취소
export const cancelBeforeConfirmReservation = async (
  reservationId: number,
  payload: PreCancelReqType
) => {
  const res = await api.patch(
    `/customers/reservations/${reservationId}/pre-cancel`,
    payload
  )

  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '예약 취소에 실패했습니다.')
  }

  return res.data
}

// 나의 예약 조회
export const getCustomerReservations = async (
  searchCond: Omit<ReservationSearchConditionType, 'page' | 'size'> & {},
  pageable: { page: number; size: number }
) => {
  // 쿼리 파라미터 수동 구성
  const queryParams = new URLSearchParams()

  // SearchCondDTO 파라미터들
  if (searchCond.fromRequestDate) {
    queryParams.append('fromRequestDate', searchCond.fromRequestDate)
  }
  if (searchCond.toRequestDate) {
    queryParams.append('toRequestDate', searchCond.toRequestDate)
  }
  if (searchCond.reservationStatus && searchCond.reservationStatus.length > 0) {
    searchCond.reservationStatus.forEach(status => {
      queryParams.append('reservationStatus', status)
    })
  }
  if (searchCond.managerNameKeyword) {
    queryParams.append('managerNameKeyword', searchCond.managerNameKeyword)
  }

  // Pageable 파라미터들
  queryParams.append('page', pageable.page.toString())
  queryParams.append('size', pageable.size.toString())

  const res = await api.get(`/customers/reservations?${queryParams.toString()}`)
  return res.data
}

// 예약 확정 후 취소
export const cancelReservationByCustomer = async (
  reservationId: number,
  payload: CustomerReservationCancelReqType
) => {
  const res = await api.patch(
    `/customers/reservations/${reservationId}/cancel`,
    payload
  )
  return res.data
}

// 예약 상세 조회
export const getCustomerReservationDetail = async (reservationId: number) => {
  const res = await api.get(`/customers/reservations/${reservationId}`)
  return res.data
}

// 매니저 매칭 조회(페이지네이션 및 정렬)
export const getMatchingManagers = async (
  payload: ManagerMatchingReqType & {
    page?: number
    size?: number
    sortBy?: string
    isAsc?: boolean
  }
) => {
  const { page, size, sortBy, isAsc, ...bodyData } = payload
  
  // URL 파라미터로 페이지네이션과 정렬 정보 전달
  const params = new URLSearchParams()
  if (page !== undefined) params.append('page', page.toString())
  if (size !== undefined) params.append('size', size.toString())
  if (sortBy) {
    params.append('sort', `${sortBy},${isAsc ? 'asc' : 'desc'}`)
  }
  
  const url = `/customers/reservations/managers${params.toString() ? '?' + params.toString() : ''}`
  const res = await api.post(url, bodyData)
  return res.data
}
