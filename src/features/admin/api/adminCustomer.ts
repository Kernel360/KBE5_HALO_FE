import api from "@/services/axios";
import qs from "qs";
import type {
  AdminCustomerSearchParams,
  AdminCustomerListResponse,
  AdminCustomerResponse,
  AdminCustomerUpdateRequest,
} from "../types/AdminCustomerType";

// 고객 목록 조회
export const fetchAdminCustomers = async (
  params?: AdminCustomerSearchParams,
): Promise<AdminCustomerListResponse> => {
  // 상태 필터 변환 (활성 -> ACTIVE, 비활성 -> DELETED)
  const convertedStatusFilter = params?.status?.map((status) =>
    status === "활성" ? "ACTIVE" : status === "비활성" ? "DELETED" : status,
  );

  // 빈 값인 파라미터 제거
  const cleanedParams = Object.fromEntries(
    Object.entries({
      userName: params?.userName,
      phone: params?.phone,
      email: params?.email,
      status:
        convertedStatusFilter && convertedStatusFilter.length > 0
          ? convertedStatusFilter
          : undefined,
      page: params?.page,
      size: params?.size,
      sort: params?.sort,
    }).filter(([, value]) => value !== undefined && value !== ""),
  );

  const res = await api.get("/admin/customers", {
    params: cleanedParams,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });

  if (!res.data.success) {
    throw new Error(res.data.message || "고객 목록 조회에 실패했습니다.");
  }

  return res.data.body || res.data;
};

// 고객 상세 조회
export const fetchAdminCustomerById = async (
  customerId: string,
): Promise<AdminCustomerResponse> => {
  const res = await api.get(`/admin/customers/${customerId}`);

  if (!res.data.success) {
    throw new Error(res.data.message || "고객 상세 조회에 실패했습니다.");
  }

  return res.data.body || res.data;
};

// 고객 정보 수정
export const updateAdminCustomer = async (
  customerId: string,
  data: AdminCustomerUpdateRequest,
): Promise<AdminCustomerResponse> => {
  const res = await api.put(`/admin/customers/${customerId}`, data);

  if (!res.data.success) {
    throw new Error(res.data.message || "고객 정보 수정에 실패했습니다.");
  }

  return res.data.body || res.data;
};

// 고객 삭제
export const deleteAdminCustomer = async (
  customerId: string,
): Promise<void> => {
  const res = await api.delete(`/admin/customers/${customerId}`);

  if (!res.data.success) {
    throw new Error(res.data.message || "고객 삭제에 실패했습니다.");
  }

  return res.data.body || res.data;
};
