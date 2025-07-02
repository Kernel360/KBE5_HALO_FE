// 매니저 목록 조회
export interface AdminManager {
  managerId: number;
  userName: string;
  email: string;
  phone: string;
  userstatus: string;
  contractStatus: string;
  averageRating: number | null;
  reservationCount: number;
  reviewCount: number;
}

// 매니저 상세 조회
export interface AdminManagerDetail {
  managerId: number;
  userName: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  roadAddress: string;
  detailAddress: string;
  status: string;
  availableTimes: AvailableTime[];
  averageRating: number | null;
  reservationCount: number;
  reviewCount: number;
  bio: string;
  profileImageId: number | null;
  fileId: number | null;
  createdAt: string;
  updatedAt: string;
  contractAt: string | null;
  terminatedAt: string | null;
  terminationReason: string | null;
}

export interface AvailableTime {
  timeId: number | null;
  dayOfWeek: string;
  time: string;
}