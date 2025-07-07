import api from "@/services/axios";
import type { CustomerSignupReq, CustomerSignupReqDTO, } from '../types/CustomerSignupType';
import type { ChargePointsType, UserInfoUpdateInfoType } from '../types/CustomerInfoType';

// CustomerSignupReq를 CustomerSignupReqDTO로 변환하는 함수
const transformToCustomerSignupReqDTO = (signupData: CustomerSignupReq): CustomerSignupReqDTO => {
  return {
    userSignupReqDTO: {
      phone: signupData.phone,
      userName: signupData.userName,
      email: signupData.email,
      password: signupData.password,
    },
    userInfoSignupReqDTO: {
      birthDate: signupData.birthDate,
      gender: signupData.gender,
      latitude: signupData.latitude,
      longitude: signupData.longitude,
      roadAddress: signupData.roadAddress,
      detailAddress: signupData.detailAddress
    }
  };
};

// 수요자 회원가입
export const signupCustomer = async (signupData: CustomerSignupReq) => {
  
  const customerSignupReqDTO = transformToCustomerSignupReqDTO(signupData);

  const res = await api.post('/customers/auth/signup', customerSignupReqDTO);

  return res;
};

// 수요자 로그인
export const loginCustomer = async (phone: string, password: string) => {
  const res = await api.post('/customers/auth/login', { phone, password });

  if (!res.data.success) {
    // 성공 여부 수동 체크 후 에러 던지기
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || '로그인에 실패했습니다.');
  }

  return res;
};

// 수요자 로그아웃
export const logoutCustomer = async () => {
  const res = await api.post('/logout');

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "로그아웃에 실패했습니다.");
  }

  return res;
};

// 수요자 정보 조회
export const getCustomerInfo = async () => {
  const res = await api.get("/customers/auth/my");
  return res.data;
};

// 수요자 포인트 충전
export const chargePoints = async (
  data: ChargePointsType
) => {
  const res = await api.patch("/customers/auth/my/point", data);

  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "포인트 충전에 실패했습니다.");
  }

  return res.data.body;
};

// 회원정보 수정
export const updateCustomerInfo = async (data: UserInfoUpdateInfoType) => {
  const res = await api.patch("/customers/auth/my", data);
  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "회원정보 수정에 실패했습니다.");
  }
  return res.data.body;
};
