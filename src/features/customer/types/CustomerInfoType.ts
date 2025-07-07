export interface CustomerInfoType {
  phone: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
}

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

export interface ChargePointsType {
  point : number;
}