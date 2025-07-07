// 고객 목록 조회 요청 파라미터 타입
export interface AdminCustomerSearchParams {
  userName?: string;
  phone?: string;
  email?: string;
  status?: string[];
  page?: number;
  size?: number;
  sort?: string;
}

// 백엔드 API 응답의 고객 데이터 타입
export interface AdminCustomerResponse {
  customerId: string;
  userName: string;
  phone: string;
  email: string;
  accountStatus: "ACTIVE" | "DELETED" | "REPORTED";
  count: number;
  gender: string;
  birthDate: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  point: number;
  createdAt: string;
  updatedAt: string;
}

// 고객 목록 조회 응답 타입
export interface AdminCustomerListResponse {
  content: AdminCustomerResponse[];
  totalPages: number;
  totalElements: number;
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// 고객 정보 수정 요청 타입
export interface AdminCustomerUpdateRequest {
  userName: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  point: number;
  accountStatus: string;
}

// 프론트엔드에서 사용하는 고객 타입 (UI용)
export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  count: number;
  gender: string;
  birthDate: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  point: number;
  createdAt: string;
  updatedAt: string;
}
