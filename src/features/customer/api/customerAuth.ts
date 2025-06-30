import api from '@/services/axios';
import type { CustomerSignupReq } from '../types/CustomerSignupType';

// 수요자 회원가입
export const signupCustomer = async (signupData: CustomerSignupReq) => {
  const res = await api.post('/customers/auth/signup', signupData);

  if (!res.data.success) {
    alert(res.data.message);
    throw new Error(res.data.message || '회원가입에 실패했습니다.');
  }

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


