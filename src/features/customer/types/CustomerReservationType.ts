// 서비스 카테고리 트리 타입
export interface ServiceCategoryTreeType {
    serviceId: number;
    serviceName: string;
    serviceTime: number | null;
    depth: number;
    price: number;
    description: string;
    children: ServiceCategoryTreeType[];
  }
  
  // 예약 정보 타입
  export interface ReservationRspType {
    reservationId: number;
    serviceCategoryId: number;
    roadAddress: string;
    detailAddress: string;
    latitude: number;
    longitude: number;
    requestDate: string; // ISO 날짜 문자열 (예: "2025-06-09")
    startTime: string;   // "HH:mm" 또는 "HH:mm:ss" 형식 문자열
    turnaround: number;
    price: number;
    memo: string;
  }
  
  // 예약 요청 타입
  export interface ReservationReqType {
    mainServiceId: number;
    additionalServiceIds: number[];
    phone: string;
    roadAddress: string;
    detailAddress: string;
    latitude: number;
    longitude: number;
    requestDate: string;
    startTime: string;
    turnaround: number;
    price: number;
    memo: string;
  }
  
  // 예약 확정 응답 타입
  export interface ReservationConfirmRspType {
    reservationId: number;
    managerName: string;
    reservationStatus: string;
    serviceName: string;
    requestDate: string;
    startTime: string;
    turnaround: number;
    roadAddress: string;
    detailAddress: string;
    extraServices : ServiceCategoryTreeType
    price: number;
}
  
  // 예약 확정 요청 타입
export interface ReservationConfirmReqType {
    selectedManagerId: number;
    payReqDTO: {
      paymentMethod: "POINT",
      amount: number;
    }
  }

// 예약 매칭 응답 타입
export interface ReservationMatchedRspType {
reservation: ReservationRspType;
requestCategory: ServiceCategoryTreeType;
matchedManagers: ManagerMatchingRspType[];
}

// 매니저 매칭 응답 타입
export interface ManagerMatchingRspType {
    managerId: number;
    managerName: string;
    averageRating: number;
    reviewCount: number;
    reservationCount : number;
    profileImageId: number;
    bio: string;
    feedbackType: 'GOOD' | 'BAD' | null; // enum 값에 맞게 조정
    recentReservationDate: string; // ISO 날짜 문자열
  }

// 예약 확정 전 취소 요청 타입
export interface PreCancelReqType {
   matchedManagers: number[];
  }

// 예약 확정 후 취소 요청 타입
export interface CustomerReservationCancelReqType{
    reservationId: number;
    cancelReason: string;
}

// 예약 목록 조회
export interface CustomerReservationListRspType {
    reservationId: number;
    managerName?: string;
    reservationStatus: string;
    serviceCategoryId: number;
    serviceName: string;
    requestDate: string;
    startTime: string;
    roadAddress: string;
    detailAddress: string;
    turnaround: number;
    price: number;
    reviewId?: number;
}


// 추가서비스
export interface ExtraService {
  extraServiceId: number;
  extraServiceName: string;
  extraServicePrice: number;
  extraServiceTime: number;
}

// 매니저 통계
export interface ManagerStatistic {
  reviewCount: number;
  reservationCount: number;
  averageRating: number;
}

// 예약 상세 타입
export interface CustomerReservationDetailRspType {
  reservationId: number;
  serviceCategoryId: number;
  price: number;
  reservationStatus: ReservationStatus;
  memo: string;
  phone: string;
  serviceName: string;
  serviceTime: number;
  roadAddress: string;
  detailAddress: string;
  requestDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm:ss
  turnaround: number;
  extraServices: ExtraService[];
  managerName: string;
  bio: string;
  mangerStatistic: ManagerStatistic;
  reservationCancel: ReservationCancel | null;
  review: Review | null;
}

//예약 취소
export interface ReservationCancel {
  cancelReason: string;
  cancelDate: string; // 'YYYY-MM-DDTHH:mm:ss'
}

// 리뷰
export interface Review {
  reviewId: number;
  content: string;
  rating: number;
  reviewDate: string; // ISO 형식
}


// 예약 상태
export type ReservationStatus = 'PRE_CANCELED' | 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CONFIRMED' | 'CANCELED'| 'REJECTED';