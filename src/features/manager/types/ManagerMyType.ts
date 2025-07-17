// 매니저 나의 정보 조회
export interface ManagerInfo {
  userName: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  genderName: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  bio: string;
  profileImageId: number | null;
  profileImagePath?: string;
  fileId?: number;
  fileName?: string;
  fileUrl?: string;
  status: string;
  statusName: string;
  availableTimes: Array<{ dayOfWeek: string; time: string }>;
  contractAt: string;
  terminationReason?: string;
  terminatedAt?: string;
  specialty?: string;
}

// 업무가능시간
export interface AvailableTime {
  dayOfWeek: string // ex: "MONDAY"
  time: string // ex: "09:00"
}
