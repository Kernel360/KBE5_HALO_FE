import api from "@/services/axios";
import type { createAdminSignup } from "../types/AdminAuthType";
import qs from "qs";

// 관리자 로그인
export const loginAdmin = async (phone: string, password: string) => {
  const res = await api.post("/admin/auth/login", { phone, password });

  if (!res.data.success) {
    // 성공 여부 수동 체크 후 에러 던지기
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "로그인에 실패했습니다.");
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

  return res.data.message; // or 그냥 true 반환해도 OK
};

// 관리자 회원가입
export const signupAdmin = async (signupData: createAdminSignup) => {
  const { userName, ...rest } = signupData;
  const res = await api.post("/admin/auth/signup", { ...rest, userName });

  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "관리자 등록에 실패했습니다.");
  }

  return res;
};

// 관리자 계정 목록 조회
export const fetchAdminAccounts = async (params?: {
  name?: string;
  phone?: string;
  email?: string;
  status?: string | string[];
  page?: number;
  size?: number;
}) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
  const res = await api.get("/admin/auth", {
    params: cleanedParams,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
  console.log(res.data.body);
  if (!res.data.success)
    throw new Error(
      res.data.message || "관리자 계정 목록 조회에 실패했습니다.",
    );
  return res.data.body;
};

// 관리자 정보 수정
export const updateAdminAccount = async (
  adminId: string | number,
  data: createAdminSignup,
) => {
  const res = await api.patch(`/admin/auth/${adminId}`, data);
  if (!res.data.success)
    throw new Error(res.data.message || "관리자 정보 수정 실패");
  return res.data.body;
};

// 관리자 계정 삭제
export const deleteAdminAccount = async (adminId: string | number) => {
  const res = await api.delete(`/admin/auth/${adminId}`);
  if (!res.data.success)
    throw new Error(res.data.message || "관리자 삭제 실패");
  return res.data.body;
};
