// 고객 프로필 정보
export interface CustomerProfile {
  customerId: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerGrade: 'VIP' | 'GOLD' | 'SILVER' | 'BRONZE' | 'NORMAL'
  
  // 이용 통계
  totalReservations: number
  completedReservations: number
  canceledReservations: number
  
  // 만족도 지표
  averageRating: number
  totalReviews: number
  
  // 최근 활동
  lastReservationDate: string | null
  firstReservationDate: string | null
  
  // 선호도 정보
  preferredServices: string[]
  favoriteManager?: string
  
  // 신뢰도 지표
  noShowRate: number
  onTimeRate: number
  
  // 가입 정보
  joinDate: string
  isActive: boolean
}

// 고객 예약 히스토리
export interface CustomerReservationHistory {
  reservationId: number
  serviceName: string
  managerName: string
  reservationDate: string
  status: string
  rating?: number
  totalAmount: number
}

// 고객 통계 요약
export interface CustomerStatistics {
  totalSpent: number
  averageSpent: number
  monthlyReservations: number
  yearlyReservations: number
  loyaltyScore: number
} 