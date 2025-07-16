import { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getSettlementWithPaging,
  getSettlementSummary
} from '@/features/manager/api/managerPayment'
import type { ManagerSettlementRspType as Payments } from '@/features/manager/types/ManagerPaymentType'
import { AdminPagination } from '@/features/admin/components/AdminPagination'
import DateRangeCalendar from '@/shared/components/ui/DateRangeCalendar'
import { ResetButton } from '@/shared/components/ui/ResetButton'
import { SearchButton } from '@/shared/components/ui/SearchButton'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/solid'

export const ManagerPayments = () => {
  const navigate = useNavigate()
  const [fadeKey, setFadeKey] = useState(0)
  const [resetTrigger, setResetTrigger] = useState(false)

  const [payments, setPayments] = useState<Payments[]>([])
  const [, setTotalAmount] = useState(0)

  // KPI 금액 상태
  const [weekAmount, setWeekAmount] = useState<number | null>(null)
  const [lastWeekAmount, setLastWeekAmount] = useState<number | null>(null)
  const [monthAmount, setMonthAmount] = useState<number | null>(null)
  const [kpiLoading, setKpiLoading] = useState(false)
  const [kpiError, setKpiError] = useState<string | null>(null)

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10

  // 에러 토스트 상태
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 이번달 1일부터 오늘까지 계산
  const getThisMonthRange = () => {
    const today = new Date()
    // 이번달 1일
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    return {
      firstDay: firstDay.toISOString().split('T')[0],
      today: today.toISOString().split('T')[0]
    }
  }

  const thisMonth = getThisMonthRange()
  const [startDate, setStartDate] = useState<string>(thisMonth.firstDay)
  const [endDate, setEndDate] = useState<string>(thisMonth.today)

  // KPI 데이터 불러오기
  useEffect(() => {
    const fetchKPI = async () => {
      setKpiLoading(true)
      setKpiError(null)
      try {
        const summary = await getSettlementSummary()
        setWeekAmount(summary.thisWeekEstimated)
        setLastWeekAmount(summary.lastWeekSettled)
        setMonthAmount(summary.thisMonthSettled)
      } catch {
        setKpiError('정산 요약 정보를 불러오지 못했습니다.')
      } finally {
        setKpiLoading(false)
      }
    }
    fetchKPI()
  }, [])

  // 검색
  const handleSearch = async (page: number = 0) => {
    if (!startDate || !endDate) {
      setErrorMessage('시작일과 종료일을 입력해주세요.')
      return
    }

    try {
      const data = await getSettlementWithPaging(
        {
          startDate,
          endDate
        },
        page,
        pageSize
      )

      setPayments(data.content)
      setCurrentPage(data.page.number)
      setTotalPages(data.page.totalPages)
      setTotalElements(data.page.totalElements)

      // 총합 계산
      const total = data.content.reduce(
        (sum: number, item: Payments) => sum + item.totalAmount,
        0
      )

      setTotalAmount(total)
      setFadeKey(prev => prev + 1)
    } catch {
      setErrorMessage('정산 내역 조회 중 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    if (resetTrigger) {
      handleSearch()
      setResetTrigger(false)
    }
  }, [resetTrigger])

  // 페이지 로드 시 초기 조회
  useEffect(() => {
    handleSearch()
  }, [])

  // 초기화
  const handleReset = () => {
    const resetMonth = getThisMonthRange()
    setStartDate(resetMonth.firstDay)
    setEndDate(resetMonth.today)
    setCurrentPage(0)
    setResetTrigger(true)
  }

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    handleSearch(page)
  }

  // 예약 상세페이지로 이동
  const handleRowClick = (reservationId: number) => {
    navigate(`/managers/reservations/${reservationId}`)
  }

  // KPI 카드 UI (가독성+컴팩트+넓이 확장)
  const kpiCard = (
    <div className="mt-4 mb-2 ml-2 grid w-full max-w-6xl grid-cols-1 gap-3 md:grid-cols-3">
      {/* 이번주 예상 정산 */}
      <div className="flex w-full min-w-[220px] flex-col items-start gap-1 rounded-xl border border-slate-100 bg-white p-3 shadow-sm md:min-w-[260px]">
        <div className="mb-0.5 flex items-center gap-1">
          <BanknotesIcon className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-800">
            이번주 예상 정산
          </span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-extrabold text-emerald-600">
            {kpiLoading
              ? '...'
              : kpiError
                ? '-'
                : `${weekAmount?.toLocaleString() ?? 0}원`}
          </span>
          {weekAmount !== null && lastWeekAmount !== null && (
            <span
              className={`flex items-center text-xs font-semibold ${weekAmount >= lastWeekAmount ? 'text-green-600' : 'text-red-500'}`}>
              {weekAmount >= lastWeekAmount ? (
                <ArrowTrendingUpIcon className="mr-0.5 h-3 w-3" />
              ) : (
                <ArrowTrendingDownIcon className="mr-0.5 h-3 w-3" />
              )}
              {lastWeekAmount === 0
                ? '0%'
                : `${(((weekAmount - lastWeekAmount) / (lastWeekAmount || 1)) * 100).toFixed(1)}%`}
            </span>
          )}
        </div>
        <span className="mt-0.5 mb-0.5 text-xs text-slate-400">
          이번주 월~일
        </span>
        <span className="mt-0.5 mb-0.5 text-xs text-slate-400">
          예약 확정, 방문 완료 포함
        </span>
      </div>
      {/* 저번주 정산금액 */}
      <div className="flex w-full min-w-[220px] flex-col items-start gap-1 rounded-xl border border-slate-100 bg-white p-3 shadow-sm md:min-w-[260px]">
        <div className="mb-0.5 flex items-center gap-1">
          <BanknotesIcon className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-800">
            저번주 정산금액
          </span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-extrabold text-blue-600">
            {kpiLoading
              ? '...'
              : kpiError
                ? '-'
                : `${lastWeekAmount?.toLocaleString() ?? 0}원`}
          </span>
        </div>
        <span className="mt-0.5 mb-0.5 text-xs text-slate-400">
          지난주 월~일
        </span>
      </div>
      {/* 이번달 정산금액 */}
      <div className="flex w-full min-w-[220px] flex-col items-start gap-1 rounded-xl border border-slate-100 bg-white p-3 shadow-sm md:min-w-[260px]">
        <div className="mb-0.5 flex items-center gap-1">
          <BanknotesIcon className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-800">
            이번달 정산 금액
          </span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-extrabold text-indigo-600">
            {kpiLoading
              ? '...'
              : kpiError
                ? '-'
                : `${monthAmount?.toLocaleString() ?? 0}원`}
          </span>
        </div>
        <span className="mt-0.5 mb-0.5 text-xs text-slate-400">
          이번달 1일~전주 일요일
        </span>
      </div>
    </div>
  )

  return (
    <Fragment>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start justify-start">
        <div className="inline-flex h-16 items-center justify-between self-stretch border-b border-gray-200 bg-white px-6">
          <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
            정산 관리
          </div>
        </div>

        {/* KPI 카드 */}
        {kpiCard}
        <div className="mt-0 flex flex-col items-start justify-start gap-3 self-stretch p-6">
          <div className="hidden min-w-[320px] flex-row items-center justify-between gap-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 shadow-none transition-all md:flex">
            {/* 필터 그룹 (왼쪽) */}
            <div className="flex flex-1 flex-row items-center gap-6">
              {/* 기간 필터 */}
              <div className="flex min-w-[180px] flex-row items-center gap-3">
                <label className="min-w-[32px] text-sm font-semibold text-slate-600">
                  서비스 기간
                </label>
                <div className="w-[280px]">
                  <DateRangeCalendar
                    startDate={startDate}
                    endDate={endDate}
                    onDateRangeChange={handleDateRangeChange}
                  />
                </div>
              </div>
            </div>
            {/* 검색 영역 (오른쪽) */}
            <div className="ml-auto w-auto flex-shrink-0">
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleSearch()
                }}
                className="flex flex-row items-center gap-2 bg-transparent p-0">
                <ResetButton
                  onClick={handleReset}
                  className="h-8 px-4 text-xs"
                />
                <SearchButton
                  type="submit"
                  className="h-8 px-4 text-xs"
                />
              </form>
            </div>
          </div>

          <div className="flex flex-col items-start justify-start self-stretch rounded-xl bg-white p-6 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
            <div className="inline-flex items-center justify-between self-stretch pb-4">
              <div className="justify-start font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
                정산 내역
              </div>
              <div className="inline-flex items-center justify-end self-stretch">
                <div className="font-['Inter'] text-sm leading-none font-normal text-slate-500">
                  총 {totalElements}건
                </div>
              </div>
            </div>
            {/* 데스크탑 테이블 헤더 */}
            <div className="hidden h-12 items-center justify-start self-stretch border-b border-slate-200 bg-slate-50 px-4 md:inline-flex">
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex flex-1 items-center justify-center gap-4">
                    <div className="w-[13%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      서비스 날짜
                    </div>
                    <div className="w-[13%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      시작시간
                    </div>
                    <div className="w-[13%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      소요시간
                    </div>
                    <div className="w-[20%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      서비스명
                    </div>
                    <div className="w-[22%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      총 금액
                    </div>
                    <div className="w-[19%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      정산일
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              key={fadeKey}
              className="fade-in max-h-[480px] min-h-[480px] w-full overflow-y-auto">
              {payments.length === 0 ? (
                <div className="flex h-16 items-center self-stretch border-b border-slate-200 px-4 text-center">
                  <div className="w-full text-sm text-slate-500">
                    조회된 정산 내역이 없습니다.
                  </div>
                </div>
              ) : (
                payments.map(payment => (
                  <div key={payment.settlementId}>
                    {/* 데스크탑 테이블 행 */}
                    <div
                      onClick={() => handleRowClick(payment.reservationId)}
                      className="hidden h-12 cursor-pointer items-center gap-4 self-stretch border-b border-slate-200 px-4 text-center transition-colors hover:bg-slate-50 md:flex">
                      <div className="hidden">{payment.settlementId}</div>
                      <div className="hidden">{payment.reservationId}</div>
                      <div className="w-[13%] text-center font-['Inter'] text-sm leading-none font-medium text-slate-700">
                        {payment.requestDate}
                      </div>
                      <div className="w-[13%] text-center font-['Inter'] text-sm leading-none font-medium text-slate-700">
                        {payment.startTime.split(' ')[1]?.substring(0, 5)}
                      </div>
                      <div className="w-[13%] text-center font-['Inter'] text-sm leading-none font-medium text-slate-700">
                        {payment.turnaround}시간
                      </div>
                      <div className="w-[20%] text-center font-['Inter'] text-sm leading-none font-medium text-slate-700">
                        {payment.serviceName}
                      </div>
                      <div className="w-[22%] text-center font-['Inter'] text-sm leading-none font-medium text-slate-700">
                        {payment.totalAmount.toLocaleString()}원
                      </div>
                      <div className="w-[19%] text-center font-['Inter'] text-sm leading-none font-medium text-slate-700">
                        {payment.settledAt.split(' ')[0]}
                      </div>
                    </div>

                    {/* 모바일 카드 */}
                    <div
                      onClick={() => handleRowClick(payment.reservationId)}
                      className="mb-3 cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 md:hidden">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-slate-800">
                            {payment.serviceName}
                          </div>
                          <div className="text-sm font-bold text-green-600">
                            {payment.totalAmount.toLocaleString()}원
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div>서비스 날짜</div>
                          <div>{payment.requestDate}</div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div>시작시간 / 소요시간</div>
                          <div>
                            {payment.startTime.split(' ')[1]?.substring(0, 5)} /{' '}
                            {payment.turnaround}시간
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div>정산일</div>
                          <div>{payment.settledAt.split(' ')[0]}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 페이지네이션 */}
            <div className="flex w-full justify-center border-t border-slate-200 px-4 py-3">
              <AdminPagination
                page={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
                className="mx-auto pt-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 에러 토스트 */}
      <ErrorToast
        open={!!errorMessage}
        message={errorMessage || ''}
        onClose={() => setErrorMessage(null)}
      />
    </Fragment>
  )
}
