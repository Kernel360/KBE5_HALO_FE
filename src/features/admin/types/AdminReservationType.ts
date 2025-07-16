// 예약 목록 조회 요청 파라미터 타입
export interface AdminReservationSearchParams {
  customerNameKeyword?: string
  managerNameKeyword?: string
  address?: string
  startDate?: string
  endDate?: string
  fromRequestDate?: string
  toRequestDate?: string
  status?: string[]
  page?: number
  size?: number
  sort?: string
}

// 백엔드 API 응답의 예약 데이터 타입
export interface AdminReservationResponse {
  reservationId: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  managerId: string
  managerName: string
  managerPhone: string
  serviceDate: string
  serviceTime: string
  serviceDuration: number
  serviceCategory: string
  serviceSubCategory: string
  roadAddress: string
  detailAddress: string
  latitude: number
  longitude: number
  totalAmount: number
  discountAmount: number
  finalAmount: number
  reservationStatus:
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'IN_PROGRESS'
    | 'PENDING'
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  specialRequests?: string
  notes?: string
  createdAt: string
  updatedAt: string
  requestDate?: string
}

// 예약 목록 조회 응답 타입
export interface AdminReservationListResponse {
  content: AdminReservationResponse[]
  totalPages: number
  totalElements: number
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

// 예약 정보 수정 요청 타입
export interface AdminReservationUpdateRequest {
  serviceDate: string
  serviceTime: string
  serviceDuration: number
  serviceCategory: string
  serviceSubCategory: string
  roadAddress: string
  detailAddress: string
  latitude: number
  longitude: number
  totalAmount: number
  discountAmount: number
  finalAmount: number
  reservationStatus: string
  paymentStatus: string
  specialRequests?: string
  notes?: string
}

// 프론트엔드에서 사용하는 예약 타입 (UI용)
export interface AdminReservation {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  managerId: string
  managerName: string
  managerPhone: string
  serviceDate: string
  serviceTime: string
  serviceDuration: number
  serviceCategory: string
  serviceSubCategory: string
  roadAddress: string
  detailAddress: string
  latitude: number
  longitude: number
  totalAmount: number
  discountAmount: number
  finalAmount: number
  reservationStatus: string
  paymentStatus: string
  specialRequests?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// 예약 상태 옵션
export const RESERVATION_STATUS_OPTIONS = [
  { value: 'PENDING', label: '대기중' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'CANCELLED', label: '취소' }
] as const

// 결제 상태 옵션
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'SUCCESS', label: '결제 성공' },
  { value: 'FAILED', label: '결제 실패' },
  { value: 'CANCELED', label: '결제 취소' },
  { value: 'REFUNDED', label: '환불' }
] as const