// 회원정보 
export interface CustomerInfoType {
  phone: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
}

// 회원정보 상세 
export interface CustomerDetailInfoType {
  phone: string;
  email: string;
  userName: string;
  birthDate: string; // ISO string (e.g., '1990-01-15')
  gender: '남' | '여';
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  point : number;
}

// 포인트 충전
export interface ChargePointsType {
  point : number;
}

// 회원정보 수정 
export interface UserInfoUpdateInfoType {
  userUpdateReqDTO : userUpdateReqType;
  userInfoUpdateReqDTO : userInfoUpdateReqType
}


export interface userUpdateReqType {
  email: string;
}

export interface userInfoUpdateReqType {
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
}