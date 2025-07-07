import api from "@/services/axios";
import type { SearchInquiriesRequest } from "@/shared/types/InquiryType";
import type { InquiryDetail, CreateInquiryRequest, UpdateInquiryRequest } from "@/shared/types/InquiryType";

// 문의사항 카테고리 조회
export const getCustomerInquiryCategories = async () => {
  const res = await api.get("/managers/inquiries/categories");
  
  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "카테고리 조회에 실패했습니다.");
  }
  
  return res.data;
};

// 문의사항 목록 조회
export const searchManagerInquiries = async (params: SearchInquiriesRequest) => {
  // 불필요한 빈 문자열과 undefined 제거
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "" && value !== null
    )
  );

  const res = await api.get("/managers/inquiries", { params: cleanedParams });

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "문의사항 목록 조회에 실패했습니다.");
  }

  return res.data;
};

// 문의사항 상세 조회
export const getManagerInquiry = async (inquiryId: number): Promise<InquiryDetail> => {
  const res = await api.get(`/managers/inquiries/${inquiryId}`);

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "문의사항 상세 조회에 실패했습니다.");
  }

  return res.data.body;
};


// 문의사항 등록
export const createManagerInquiry = async (data: CreateInquiryRequest) => {
  const res = await api.post("/managers/inquiries", data);

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "문의사항 등록에 실패했습니다.");
  }

  return res.data.body;
};

// 문의사항 수정
export const updateManagerInquiry = async (
  inquiryId: number,
  data: UpdateInquiryRequest
) => {
  const res = await api.patch(`/managers/inquiries/${inquiryId}`, data);

  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "문의사항 수정에 실패했습니다.");
  }

  return res.data.body;
};

// 문의사항 삭제
export const deleteManagerInquiry = async(inquiryId: number) => {
  const res = await api.delete(`/managers/inquiries/${inquiryId}`);

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "문의사항 삭제에 실패했습니다.");
  }

  return res.data.body;
};