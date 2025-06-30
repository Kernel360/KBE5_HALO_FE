import api from "@/services/axios";
import type { ManagerPayments } from "@/features/manager/types/ManagerPaymentType";

// 매니저 주급 정산 조회
export const searchManagerPayments = async (params: {
  searchYear: number;
  searchMonth: number;
  searchWeekIndexInMonth: number;
}): Promise<ManagerPayments[]> => {

  const res = await api.get("/managers/payments", { params });

  if (!res.data.success) {
    // 명시적으로 실패 처리
    if (res.data.message?.trim()) alert(res.data.message);
    throw new Error(res.data.message || "매니저 주급 정산 목록 조회에 실패했습니다.");
  }

  return res.data.body;
};