// 매니저 정산 조회
export interface ManagerSettlementRspType {
  settlementId: number
  reservationId: number
  requestDate: string
  startTime: string
  turnaround: number
  serviceName: string
  totalAmount: number
  status: string
  settledAt: string
}

// 매니저 검색 조건
export interface ManagerPaymentSearchParams {
  startDate: string
  endDate: string
}

// 매니저 이번주 예상 정산 금액
export interface ManagerThisWeekSettlementType {
  thisWeekEstimated: number
}

// 매니저 정산 요약
export interface ManagerSettlementSumType {
  thisWeekEstimated: number
  lastWeekSettled: number
  thisMonthSettled: number
}
