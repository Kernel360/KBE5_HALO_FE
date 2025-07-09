import api from "@/services/axios";
import type { SearchInquiriesRequest } from "@/features/admin/types/AdminInquiryType";

// EnumValueDTO 타입 정의
export interface EnumValue {
  code: string;
  label: string;
}

// 문의사항 카테고리 전체 조회
export const getAllInquiryCategories = async (): Promise<{[key: string]: EnumValue[]}> => {
  const res = await api.get("/admin/inquiries/categories");
  if (!res.data.success) {
    throw new Error(res.data.message || "카테고리 조회에 실패했습니다.");
  }
  return res.data.body;
};

// 문의사항 작성자 타입 조회
export const getAllInquiryAuthorTypes = async (): Promise<EnumValue[]> => {
  const res = await api.get("/admin/inquiries/authorTypes");
  if (!res.data.success) {
    throw new Error(res.data.message || "작성자 타입 조회에 실패했습니다.");
  }
  return res.data.body;
};

// 문의사항 목록 조회
export const searchAdminInquiries = async (
  params: SearchInquiriesRequest,
) => {
  // GET 방식으로 변경, query parameter 사용
  const queryParams = new URLSearchParams();
  
  if (params.fromCreatedAt) queryParams.append("fromCreatedAt", params.fromCreatedAt);
  if (params.toCreatedAt) queryParams.append("toCreatedAt", params.toCreatedAt);
  if (params.replyStatus !== undefined) queryParams.append("replyStatus", params.replyStatus.toString());
  if (params.titleKeyword) queryParams.append("titleKeyword", params.titleKeyword);
  if (params.contentKeyword) queryParams.append("contentKeyword", params.contentKeyword);
  if (params.authorType) queryParams.append("authorType", typeof params.authorType === 'string' ? params.authorType.toUpperCase() : params.authorType.code.toUpperCase());
  if (params.userName) queryParams.append("userName", params.userName);
  if (params.categories && params.categories.length > 0) {
    params.categories.forEach((category: string) => queryParams.append("categories", category));
  }
  
  queryParams.append("page", (params.page ?? 0).toString());
  queryParams.append("size", (params.size ?? 10).toString());

  const res = await api.get(`/admin/inquiries?${queryParams.toString()}`);
  if (!res.data.success)
    throw new Error(res.data.message || "문의사항 목록 조회에 실패했습니다.");
  return res.data.body;
};

// 문의사항 상세 조회
export const getAdminInquiry = async (
  inquiryId: number,
) => {
  const res = await api.get(`/admin/inquiries/${inquiryId}`);
  if (!res.data.success)
    throw new Error(res.data.message || "문의사항 상세 조회에 실패했습니다.");
  return res.data.body;
};


// 문의사항 답변 등록
export const answerAdminInquiry = async (
  inquiryId: number,
  data: { replyContent: string },
) => {
  const res = await api.post(`/admin/reply`, {
    inquiryId,
    content: data.replyContent,
    fileId: null,
  });
  if (!res.data.success)
    throw new Error(res.data.message || "문의사항 답변 등록에 실패했습니다.");
  return res.data.body;
};