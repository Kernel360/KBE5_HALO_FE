// 매니저 리뷰 목록 조회
export interface SearchManagerReviews {
  reviewId: number
  reservationId: number
  authorId: number
  authorName: string
  rating: number
  content: string
  serviceId: number
  serviceName: string
  createdAt: string
}
