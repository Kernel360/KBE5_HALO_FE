import api from "@/services/axios";

// 문의사항 목록 조회
export const searchAdminInquiries = async (
  type: "customer" | "manager",
  params: {
    fromCreatedAt?: string;
    toCreatedAt?: string;
    replyStatus?: string;
    titleKeyword?: string;
    contentKeyword?: string;
    page: number;
    size: number;
  },
) => {
  // authorRole만 분기, endpoint는 고정
  const authorRole = type === "customer" ? "CUSTOMER" : "MANAGER";
  const endpoint = "/admin/inquiry/search";

  // replyStatus: string ("PENDING" | "ANSWERED" | "") => boolean | undefined
  let replyStatusBool: boolean | undefined = undefined;
  if (params.replyStatus === "PENDING") replyStatusBool = false;
  else if (params.replyStatus === "ANSWERED") replyStatusBool = true;

  const body = {
    fromCreatedAt: params.fromCreatedAt || undefined,
    toCreatedAt: params.toCreatedAt || undefined,
    replyStatus: replyStatusBool,
    titleKeyword: params.titleKeyword || undefined,
    contentKeyword: params.contentKeyword || undefined,
    authorRole,
    page: params.page,
    size: params.size,
  };

  const res = await api.post(endpoint, body);
  if (!res.data.success)
    throw new Error(res.data.message || "문의사항 목록 조회에 실패했습니다.");
  return res.data.body;
};

// 문의사항 상세 조회
export const getAdminInquiry = async (
  type: "customer" | "manager",
  inquiryId: number,
  authorId: number | string,
) => {
  const res = await api.get(`/admin/inquiries/${type}/${inquiryId}`, {
    params: { authorId },
  });
  console.log(res.data.body);
  if (!res.data.success)
    throw new Error(res.data.message || "문의사항 상세 조회에 실패했습니다.");
  return res.data.body;
};

// 문의사항 삭제
export const deleteAdminInquiry = async (
  type: "customer" | "manager",
  inquiryId: number,
) => {
  const res = await api.delete(`/admin/inquiries/${type}/${inquiryId}`);
  if (!res.data.success)
    throw new Error(res.data.message || "문의사항 삭제에 실패했습니다.");
  return res.data.body;
};

// 문의사항 답변 등록
export const answerAdminInquiry = async (
  type: "customer" | "manager",
  inquiryId: number,
  data: { replyContent: string },
) => {
  const res = await api.post(`/admin/inquiries/${type}`, {
    inquiryId,
    content: data.replyContent,
    fileId: null,
  });
  if (!res.data.success)
    throw new Error(res.data.message || "문의사항 답변 등록에 실패했습니다.");
  return res.data.body;
};

// 문의사항 답변 수정
export const updateAdminInquiryAnswer = async (
  type: "customer" | "manager",
  answerId: number,
  inquiryId: number,
  data: { replyContent: string },
) => {
  const res = await api.patch(`/admin/inquiries/${type}/${answerId}`, {
    inquiryId,
    content: data.replyContent,
    fileId: null,
  });
  if (!res.data.success)
    throw new Error(res.data.message || "문의사항 답변 수정에 실패했습니다.");
  return res.data.body;
};
