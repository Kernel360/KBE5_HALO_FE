import api from '@/services/axios';

// 관리자 로그인
export const loginAdmin = async (phone: string, password: string) => {
  const res = await api.post('/admin/auth/login', { phone, password });

  if (!res.data.success) {
    // 성공 여부 수동 체크 후 에러 던지기
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || '로그인에 실패했습니다.');
  }

  // 헤더에 있는 정보를 꺼내야해서 res 반환
  return res;
};

// 관리자 로그아웃
export const logoutAdmin = async () => {
  // const res = await api.post("/admin/auth/logout");
  const res = await api.post("/logout");

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "로그아웃에 실패했습니다.");
  }

  return res; // or 그냥 true 반환해도 OK
};