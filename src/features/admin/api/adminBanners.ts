import api from "@/services/axios";
import type {
  AdminBannerDetail,
  CreateAdminBannerRequest,
  UpdateAdminBannerRequest,
} from "@/features/admin/types/AdminBannerType";

// 배너 목록 조회
export const searchAdminBanners = async (params: {
  fromCreatedAt?: string;
  toCreatedAt?: string;
  titleKeyword?: string;
  page: number;
  size: number;
}) => {
  // 불필요한 빈 문자열 제거
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );

  const res = await api.get("/admin/banner", { params: cleanedParams });

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "배너 목록 조회에 실패했습니다.");
  }

  return res.data.body;
};

// 배너 등록
export const creatAdminBanner = async (data: CreateAdminBannerRequest) => {
  const res = await api.post("/admin/banner", data);

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "배너 등록에 실패했습니다.");
  }

  return res.data.body;
};

// 배너 수정
export const updateAdminBanner = async (
  bannerId: number,
  data: UpdateAdminBannerRequest,
) => {
  const res = await api.patch(`/admin/banner/${bannerId}`, data);

  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "배너 수정에 실패했습니다.");
  }

  return res.data.body;
};

// 배너 상세 조회
export const getAdminBanner = async (
  bannerId: number,
): Promise<AdminBannerDetail> => {
  const res = await api.get(`/admin/banner/${bannerId}`);

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "배너 상세 조회에 실패했습니다.");
  }

  return res.data.body;
};

// 배너 삭제
export const deleteAdminBanner = async (bannerId: number) => {
  const res = await api.delete(`/admin/banner/${bannerId}`);

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "배너 삭제에 실패했습니다.");
  }

  return res.data.body;
};
