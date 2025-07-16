// 매니저 회원가입
export interface createManagerSignup {
  phone: string;
  email: string;
  password: string;
  userName: string;
  birthDate: string;
  gender: string;
  latitude: number;
  longitude: number;
  roadAddress: string;
  detailAddress: string;
  bio: string;
  profileImageId: number | null;
  fileId: number | null;
  availableTimes: {
    dayOfWeek: string;
    time: string;
  }[];
}