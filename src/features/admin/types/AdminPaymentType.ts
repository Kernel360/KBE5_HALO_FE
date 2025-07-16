// 관리자 정산 조회
export interface AdminSettlementRspType {
  settlementId: number
  reservationId: number
  requestDate: string
  startTime: string
  turnaround: number
  serviceName: string
  managerId: number
  managerName: string
  totalAmount: number
  platformFee: number
  status: string
  settledAt: string
  settledBy: string
}

// 관리자 검색 조건
export interface AdminPaymentSearchParams {
  startDate: string
  endDate: string
}

// 관리자 이번주 예상 정산 금액
export interface AdminThisWeekSettlementType {
  thisWeekEstimated: number
  thisWeekEstimatedPlatformFee: number
}

// 관리자 정산 요약
export interface AdminSettlementSumType {
  thisWeekEstimated: number
  thisWeekEstimatedPlatformFee: number
  lastWeekSettled: number
  lastWeekSettledPlatformFee: number
  thisMonthSettled: number
  thisMonthSettledPlatformFee: number
}

// 관리자 수동 정산 조건
export interface AdminSettlementReqParams {
  startDate: string
  endDate: string
}

// 관리자 수동 정산 응답
export interface AdminSettlementRsp {
  createdCount: number
}
