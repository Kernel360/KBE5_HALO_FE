export interface UserSignupReqDTO {
  phone: string;
  userName: string;
  email: string;
  password: string;
}

export interface UserInfoSignupReqDTO {
  birthDate: string; 
  gender: 'MALE' | 'FEMALE';
  latitude: number;
  longitude: number;
  roadAddress: string;
  detailAddress: string;
}

// 백엔드 CustomerSignupReqDTO 구조에 맞는 타입
export interface CustomerSignupReqDTO {
  userSignupReqDTO: UserSignupReqDTO;
  userInfoSignupReqDTO: UserInfoSignupReqDTO;
}

// 프론트엔드에서 사용하는 플랫 구조 (기존 유지)
export interface CustomerSignupReq {
  phone: string;
  userName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
}