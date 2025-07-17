// 예약 목록 조회
export interface ManagerReservationSummary {
  reservationId: number
  requestDate: string
  startTime: string
  turnaround: number
  customerName: string
  customerAddress: string
  serviceName: string
  status: string
  statusName: string
  checkId: number | null
  isCheckedIn: boolean
  inTime: string | null
  isCheckedOut: boolean
  outTime: string | null
  managerReviewId: number | null
  isReviewed: boolean
}

// 예약 상세 조회
export interface ManagerReservationDetail {
  // 예약 정보
  reservationId: number
  requestDate: string
  startTime: string
  turnaround: number
  serviceName: string
  status: string
  statusName?: string

  // 고객 정보
  customerId: number | null
  userName: string
  roadAddress: string
  detailAddress: string
  averageRating: number
  reviewCount: number

  // 서비스 상세
  extraServiceName?: string | null
  memo?: string | null

  // 체크인/체크아웃
  checkId?: number | null
  inTime?: string | null
  inFileId?: number | null
  outTime?: string | null
  outFileId?: number | null

  // 수요자 리뷰
  customerReviewId?: number | null
  customerRating?: number | null
  customerContent?: string | null
  customerCreateAt?: string | null
  customerReviewContent?: string | null
  customerReviewRating?: number | null

  // 매니저 리뷰
  managerReviewId?: number | null
  managerRating?: number | null
  managerContent?: string | null
  managerCreateAt?: string | null
  managerReviewContent?: string | null
  managerReviewRating?: number | null

  // 예약 취소 정보
  cancelDate?: string | null
  cancelReason?: string | null
  canceledByName?: string | null
  canceledByRole?: string | null
}
