import api from '@/services/axios'
import type {
  ManagerSettlementRspType,
  ManagerPaymentSearchParams,
  ManagerThisWeekSettlementType,
  ManagerSettlementSumType
} from '@/features/manager/types/ManagerPaymentType'

// 매니저 정산 조회 (페이지네이션)
export const getSettlementWithPaging = async (
  cond: ManagerPaymentSearchParams,
  page: number = 0,
  size: number = 10,
  sort: string = 'settledAt',
  direction: 'ASC' | 'DESC' = 'DESC'
): Promise<{
  content: ManagerSettlementRspType[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}> => {
  const res = await api.get('/managers/settlements', {
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

// 매니저 이번주 예상 정산 금액 조회
export const getExpectedSettlementThisWeek = async (
  startDate: string,
  endDate: string
): Promise<ManagerThisWeekSettlementType> => {
  const res = await api.get('/managers/settlements/week', {
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

// 매니저 정산 요약 조회
export const getSettlementSummary =
  async (): Promise<ManagerSettlementSumType> => {
    const res = await api.get('/managers/settlements/summary')

    if (!res.data.success) {
      if (res.data.message?.trim()) alert(res.data.message)
      throw new Error(
        res.data.message || '이번주 예상 정산 금액 조회에 실패했습니다.'
      )
    }

    return res.data.body
  }
