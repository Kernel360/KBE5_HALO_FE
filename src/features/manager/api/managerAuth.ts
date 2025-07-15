import api from '@/services/axios';
import type { createManagerSignup } from '../types/ManagerAuthType';


// 매니저 로그인
export const loginManager = async (phone: string, password: string) => {
  const res = await api.post('/managers/auth/login', { phone, password });
  // 권한별 header 설정 필요
  if (!res.data.success) {
    // 성공 여부 수동 체크 후 에러 던지기
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || '로그인에 실패했습니다.');
  }

  // 헤더에 있는 정보를 꺼내야해서 res 반환
  return res;
};


// 매니저 로그아웃
export const logoutManager = async () => {
  // const res = await api.post("/managers/auth/logout");
  const res = await api.post("/logout");

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "로그아웃에 실패했습니다.");
  }

  return res;
};


// 매니저 회원가입
export const signupManager = async (requestBody: createManagerSignup) => {
  const res = await api.post("/managers/auth/signup", requestBody );

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "회원가입에 실패했습니다.");
  }

  return res.data.message;
};