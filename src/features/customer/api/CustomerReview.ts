import api from '@/services/axios'
import type {
  CustomerReviewReqType,
  CustomerReviewSearchParams
} from '@/features/customer/types/CustomerReviewType'

// 수요자 리뷰 목록 조회
export const searchCustomerReviews = async (
  params: CustomerReviewSearchParams
) => {
  const res = await api.get('/customers/reviews', {
    params
  })

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '문의사항 목록 조회에 실패했습니다.')
  }

  return res.data.body
}

// 매니저 리뷰 등록
export const createCustomerReview = async (
  reservationId: number,
  payload: CustomerReviewReqType
) => {
  const res = await api.post(`/customers/reviews/${reservationId}`, payload)

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '리뷰 등록에 실패했습니다.')
  }

  return res.data
}

// 수요자 리뷰 조회 by 예약ID
export const getCustomerReviewByReservationId = async (
  reservationId: number
) => {
  const res = await api.get(`/customers/reviews/${reservationId}`)

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '리뷰 조회에 실패했습니다.')
  }

  return res.data
}

// 수요자 리뷰 수정
export const updateCustomerReview = async (
  reviewId: number,
  payload: CustomerReviewReqType
) => {
  const res = await api.patch(`/customers/reviews/${reviewId}`, payload)

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '리뷰 수정에 실패했습니다.')
  }

  return res.data
}

// 수요자 리뷰 목록 조회
export const getCustomerReviews = async (params?: { page?: number }) => {
  const res = await api.get('/customers/reviews', { params })

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '리뷰 목록 조회에 실패했습니다.')
  }

  return res.data
}
