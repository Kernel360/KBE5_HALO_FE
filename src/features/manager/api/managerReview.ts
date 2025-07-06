import api from '@/services/axios'

// 매니저 리뷰 목록 조회
export const searchManagerReviews = async (params: {
  fromCreatedAt?: string
  toCreatedAt?: string
  ratingOption?: number
  customerNameKeyword?: string
  contentKeyword?: string
  page: number
  size: number
}) => {
  // 불필요한 빈 문자열 제거
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== ''
    )
  )

  const res = await api.get('/managers/reviews', { params: cleanedParams })

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '문의사항 목록 조회에 실패했습니다.')
  }

  return res.data.body
}

// 매니저 리뷰 등록
export const createManagerReview = async (
  reservationId: number,
  rating: number,
  content: string
) => {
  const res = await api.post(`/managers/reviews/${reservationId}`, {
    rating: rating,
    content: content
  })

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '매니저 리뷰 등록에 실패했습니다.')
  }

  return res.data.body
}
