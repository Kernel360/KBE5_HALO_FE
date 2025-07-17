// 수요자 리뷰 조회
export interface SearchCustomerReviews {
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

// 수요자 리뷰 요청 타입
export interface CustomerReviewReqType {
  content: string
  rating: number
}

// 수요자 리뷰 응답 타입
export interface CustomerReviewRspType {
  reviewId: number
  reservationId: number
  managerId: number
  managerName: string
  requestDate: string
  startTime: string
  turnaround: number
  serviceCategoryName: string
  rating: number
  content: string
  createdAt: string
  path: string
}

// 수요자 리뷰 조회 조건
export interface CustomerReviewSearchParams {
  page?: number
  size?: number
  rating?: number
}
