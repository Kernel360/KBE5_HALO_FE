import api from '@/services/axios'
import type {
  AdminSettlementRspType,
  AdminPaymentSearchParams,
  AdminThisWeekSettlementType,
  AdminSettlementSumType,
  AdminSettlementReqParams,
  AdminSettlementRsp
} from '@/features/admin/types/AdminPaymentType'

// 관리자 정산 조회 (페이지네이션)
export const getSettlementWithPaging = async (
  cond: AdminPaymentSearchParams,
  page: number = 0,
  size: number = 10,
  sort: string = 'settledAt',
  direction: 'ASC' | 'DESC' = 'DESC'
): Promise<{
  content: AdminSettlementRspType[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}> => {
  const res = await api.get('/admin/settlements', {
    params: {
      ...cond,
      page,
      size,
      sort: `${sort},${direction}`
    }
  })

  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '매니저 정산 목록 조회에 실패했습니다.')
  }

  return res.data.body
}

// 관리자 이번주 예상 정산 금액 조회
export const getExpectedSettlementThisWeek = async (
  startDate: string,
  endDate: string
): Promise<AdminThisWeekSettlementType> => {
  const res = await api.get('/admin/settlements/week', {
    params: {
      startDate,
      endDate
    }
  })

  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(
      res.data.message || '이번주 예상 정산 금액 조회에 실패했습니다.'
    )
  }

  return res.data.body
}

// 관리자 정산 요약 조회
export const getSettlementSummary =
  async (): Promise<AdminSettlementSumType> => {
    const res = await api.get('/admin/settlements/summary')

    if (!res.data.success) {
      if (res.data.message?.trim()) alert(res.data.message)
      throw new Error(
        res.data.message || '이번주 예상 정산 금액 조회에 실패했습니다.'
      )
    }

    return res.data.body
  }

// 관리자 수동 정산
export const manualSettlement = async (
  params: AdminSettlementReqParams
): Promise<AdminSettlementRsp> => {
  const res = await api.post('/admin/settlements', params)

  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '수동 정산에 실패했습니다.')
  }

  const result = res.data.body as AdminSettlementRsp

  // 응답값에 따른 메시지 처리
  if (result.createdCount === 0) {
    alert('정산 가능한 예약이 없습니다.')
  } else {
    alert(`${result.createdCount}건 정산이 완료되었습니다.`)
  }

  return result
}
