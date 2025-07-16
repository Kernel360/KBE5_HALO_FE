import { useEffect, useState } from 'react'
import {
  CalendarDaysIcon,
  BellAlertIcon,
  StarIcon,
  BanknotesIcon
} from '@heroicons/react/24/solid'
import { searchManagerReservations } from '@/features/manager/api/managerReservation'
import { getExpectedSettlementThisWeek } from '@/features/manager/api/managerPayment'
import { useNavigate } from 'react-router-dom'
import WarningToast from '@/shared/components/ui/toast/WarningToast'

function getThisWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function getLastWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7) - 7) // 지난주 월요일
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export const KPISection = () => {
  const navigate = useNavigate()
  const [weekCount, setWeekCount] = useState<number | null>(null)
  const [, setLastWeekCount] = useState<number | null>(null)
  const [weekLoading, setWeekLoading] = useState(false)
  const [weekError, setWeekError] = useState<string | null>(null)

  const [requestedCount, setRequestedCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [expectedSettlement, setExpectedSettlement] = useState<number | null>(
    null
  )
  const [settlementLoading, setSettlementLoading] = useState(false)
  const [settlementError, setSettlementError] = useState<string | null>(null)

  const [warningOpen, setWarningOpen] = useState(false)

  useEffect(() => {
    // 이번 주 예약 수
    setWeekLoading(true)
    setWeekError(null)
    const weekDates = getThisWeekDates().map(d => d.toISOString().slice(0, 10))
    const lastWeekDates = getLastWeekDates().map(d =>
      d.toISOString().slice(0, 10)
    )
    // 이번 주
    searchManagerReservations({
      fromRequestDate: weekDates[0],
      toRequestDate: weekDates[6],
      reservationStatus: 'IN_PROGRESS,CONFIRMED,COMPLETED',
      page: 0,
      size: 1
    })
      .then(data => {
        setWeekCount(data.page?.totalElements ?? 0)
      })
      .catch(() => {
        setWeekError('-')
      })
      .finally(() => setWeekLoading(false))
    // 지난 주
    searchManagerReservations({
      fromRequestDate: lastWeekDates[0],
      toRequestDate: lastWeekDates[6],
      reservationStatus: 'IN_PROGRESS,CONFIRMED,COMPLETED',
      page: 0,
      size: 1
    })
      .then(data => {
        setLastWeekCount(data.page?.totalElements ?? 0)
      })
      .catch(() => {
        setLastWeekCount(null)
      })
    // 예약 요청 수
    setLoading(true)
    setError(null)
    searchManagerReservations({
      reservationStatus: 'REQUESTED',
      page: 0,
      size: 1
    })
      .then(data => {
        setRequestedCount(data.page?.totalElements ?? 0)
      })
      .catch(() => {
        setError('-')
      })
      .finally(() => setLoading(false))

    // 이번주 예상 정산 금액
    setSettlementLoading(true)
    setSettlementError(null)
    const thisWeekDates = getThisWeekDates().map(d =>
      d.toISOString().slice(0, 10)
    )
    getExpectedSettlementThisWeek(thisWeekDates[0], thisWeekDates[6])
      .then(data => {
        setExpectedSettlement(data.thisWeekEstimated)
      })
      .catch(() => {
        setSettlementError('-')
      })
      .finally(() => setSettlementLoading(false))
  }, [])

  // 클릭 시 이동 함수
  const handleWeekCardClick = () => {
    const weekDates = getThisWeekDates().map(d => d.toISOString().slice(0, 10))
    navigate(
      `/managers/reservations?fromRequestDate=${weekDates[0]}&toRequestDate=${weekDates[6]}&status=IN_PROGRESS,CONFIRMED,COMPLETED`
    )
  }
  const handleRequestedCardClick = () => {
    navigate(`/managers/reservations?status=REQUESTED`)
  }
  const handleRatingCardClick = () => {
    navigate(`/managers/reviews`)
  }

  const handleSettleCardClick = () => {
    navigate(`/managers/payments`)
  }

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {/* 이번 주 예약 */}
      <button
        type="button"
        className="flex flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:shadow-md focus:outline-none"
        onClick={handleWeekCardClick}>
        <div className="mb-1 flex items-center gap-2">
          <CalendarDaysIcon className="h-6 w-6 text-indigo-500" />
          <span className="text-base font-semibold text-slate-700">
            이번 주 예약
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-indigo-700">
            {weekLoading ? '...' : weekError ? weekError : `${weekCount ?? 0}`}
          </span>
        </div>
        <span className="mt-1 text-xs text-slate-400">전체 예약 수</span>
      </button>
      {/* 예약 요청 */}
      <button
        type="button"
        className="flex flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:shadow-md focus:outline-none"
        onClick={handleRequestedCardClick}>
        <div className="mb-1 flex items-center gap-2">
          <BellAlertIcon className="h-6 w-6 text-rose-500" />
          <span className="text-base font-semibold text-slate-700">
            예약 요청
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-rose-600">
            {loading ? '...' : error ? error : `${requestedCount ?? 0}`}
          </span>
        </div>
        <span className="mt-1 text-xs text-slate-400">확정 대기</span>
      </button>
      {/* 평균 평점 */}
      <button
        type="button"
        className="flex flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:shadow-md focus:outline-none"
        onClick={handleRatingCardClick}>
        <div className="mb-1 flex items-center gap-2">
          <StarIcon className="h-6 w-6 text-yellow-400" />
          <span className="text-base font-semibold text-slate-700">
            평균 평점
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-yellow-500">4.8</span>
        </div>
        <span className="mt-1 text-xs text-slate-400">최근 30일</span>
      </button>
      {/* 매출 */}
      <button
        type="button"
        className="flex flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:shadow-md focus:outline-none"
        onClick={handleSettleCardClick}>
        <div className="mb-1 flex items-center gap-2">
          <BanknotesIcon className="h-6 w-6 text-emerald-500" />
          <span className="text-base font-semibold text-slate-700">
            이번주 예상 정산
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-emerald-600">
            {settlementLoading
              ? '...'
              : settlementError
                ? settlementError
                : `${expectedSettlement?.toLocaleString() ?? 0}원`}
          </span>
        </div>
        <span className="mt-1 text-xs text-slate-400">
          예약 확정, 방문 완료 포함
        </span>
      </button>
      <WarningToast
        open={warningOpen}
        message="서비스 준비 중입니다."
        onClose={() => setWarningOpen(false)}
      />
    </div>
  )
}
