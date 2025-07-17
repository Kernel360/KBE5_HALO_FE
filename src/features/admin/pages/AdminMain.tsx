import { Fragment, useEffect, useState } from 'react'
import { fetchAdminManagers } from '../api/adminManager'
import { useNavigate } from 'react-router-dom'
import { searchAdminInquiries } from '../api/adminInquiry'
import { fetchAdminReservations } from '../api/adminReservation'
import {
  startOfWeek,
  endOfWeek,
  formatDate,
  parseDate
} from '@/shared/utils/dateUtils'
import { ChevronRight } from 'lucide-react'
import type { AdminManager } from '../types/AdminManagerType'
import ProfileImagePreview from '@/shared/components/ui/ProfileImagePreview'
import { getExpectedSettlementThisWeek } from '../api/adminSettlement'
import { BanknotesIcon } from '@heroicons/react/24/solid'

type PendingInquiry = {
  inquiryId: number
  authorId: number
  title: string
  createdAt: string
  type: 'customer' | 'manager'
}

// 신규 매니저 신청 목록 컴포넌트
function NewManagerList({
  managers,
  loading,
  onClickItem
}: {
  managers: AdminManager[]
  loading: boolean
  onClickItem: (managerId: number) => void
}) {
  return (
    <div className="flex flex-col items-start justify-start gap-3 self-stretch">
      {loading ? (
        <div>로딩중...</div>
      ) : managers.length === 0 ? (
        <div>신규 매니저 신청이 없습니다.</div>
      ) : (
        managers.map(manager => {
          let profileImageUrl: string | null = null
          if (manager.profileImagePath) {
            try {
              const arr = JSON.parse(manager.profileImagePath)
              if (Array.isArray(arr) && arr.length > 0) {
                profileImageUrl = arr[0]
              }
            } catch {
              /* ignore */
            }
          }
          return (
            <div
              key={manager.managerId}
              className="inline-flex cursor-pointer items-center justify-between self-stretch rounded-lg bg-gray-50 p-3 transition-colors hover:bg-indigo-50"
              onClick={() => onClickItem(manager.managerId)}
            >
              <div className="flex items-center justify-start gap-3">
                {profileImageUrl ? (
                  <ProfileImagePreview
                    src={profileImageUrl}
                    size="sm"
                  />
                ) : (
                  <div className="inline-flex h-10 w-10 flex-col items-center justify-center rounded-[20px] bg-indigo-100">
                    <div className="font-['Inter'] text-sm leading-none font-semibold text-indigo-600">
                      {manager.userName
                        ? manager.userName
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                        : '?'}
                    </div>
                  </div>
                )}
                <div className="inline-flex w-full flex-col items-start justify-start gap-0.5">
                  <div className="flex w-full items-center">
                    <div className="flex-1 justify-start font-['Inter'] text-sm leading-none font-semibold text-gray-900">
                      {manager.userName}
                    </div>
                    {manager.bio && (
                      <div className="ml-2 max-w-xs truncate text-right font-['Inter'] text-xs leading-none font-normal text-gray-500">
                        {manager.bio}
                      </div>
                    )}
                  </div>
                  <div className="font-['Inter'] text-xs leading-none font-normal text-gray-500">
                    {manager.createdAt?.slice(0, 10)} 신청
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// 답변이 필요한 문의사항 목록 컴포넌트
function PendingInquiryList({
  inquiries,
  loading,
  onClickItem
}: {
  inquiries: PendingInquiry[]
  loading: boolean
  onClickItem: (inquiryId: number, authorId: number) => void
}) {
  return (
    <div className="flex flex-col items-start justify-start gap-3 self-stretch">
      {loading ? (
        <div>로딩중...</div>
      ) : inquiries.length === 0 ? (
        <div>답변이 필요한 문의사항이 없습니다.</div>
      ) : (
        inquiries.map(inquiry => (
          <div
            key={inquiry.inquiryId}
            className="inline-flex cursor-pointer items-center justify-between self-stretch rounded-lg bg-gray-50 p-3 transition-colors hover:bg-indigo-50"
            onClick={() => onClickItem(inquiry.inquiryId, inquiry.authorId)}
          >
            <div className="flex items-center justify-start gap-3">
              <div className={`flex items-center justify-center rounded-xl px-2 py-0.5 ${inquiry.type === 'customer' ? 'bg-amber-100' : 'bg-indigo-100'}`}>
                <div className={`font-['Inter'] text-xs leading-none font-medium ${inquiry.type === 'customer' ? 'text-amber-600' : 'text-indigo-600'}`}>
                  {inquiry.type === 'customer' ? '고객' : '매니저'}
                </div>
              </div>
              <div className="inline-flex flex-col items-start justify-start gap-0.5">
                <div className="font-['Inter'] text-sm leading-none font-semibold text-gray-900">
                  {inquiry.title}
                </div>
                <div className="font-['Inter'] text-xs leading-none font-normal text-gray-500">
                  {inquiry.createdAt}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export const AdminMain = () => {
  const [newManagers, setNewManagers] = useState<AdminManager[]>([])
  const [newManagersTotal, setNewManagersTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pendingInquiries, setPendingInquiries] = useState<PendingInquiry[]>([])
  const [pendingInquiriesLoading, setPendingInquiriesLoading] = useState(false)
  const [totalPendingInquiries, setTotalPendingInquiries] = useState(0)
  const navigate = useNavigate()
  const [weeklyReservationData, setWeeklyReservationData] = useState<
    { day: string; count: number }[]
  >([])
  const [weeklyReservationCount, setWeeklyReservationCount] = useState(0)
  const [weeklyCompletedCount, setWeeklyCompletedCount] = useState(0)
  const [lastWeekReservationCount, setLastWeekReservationCount] = useState<
    number | null
  >(null)
  const [todayReservationCount, setTodayReservationCount] = useState(0)
  const [yesterdayReservationCount, setYesterdayReservationCount] = useState<
    number | null
  >(null)

  // fallback week data for empty or error case
  const fallbackWeek = ['월', '화', '수', '목', '금', '토', '일'].map(day => ({
    day,
    count: 0
  }))

  // 이번주 예상 정산 금액 상태
  const [thisWeekSettlement, setThisWeekSettlement] = useState<{
    thisWeekEstimated: number
    thisWeekEstimatedPlatformFee: number
  } | null>(null)
  const [settlementLoading, setSettlementLoading] = useState(false)
  const [settlementError, setSettlementError] = useState<string | null>(null)

  // 이번주 날짜 범위 계산
  const getThisWeekRange = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0: 일요일, 1: 월요일, ...
    const monday = new Date(today)
    monday.setDate(today.getDate() - dayOfWeek + 1) // 월요일
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6) // 일요일

    return {
      startDate: monday.toISOString().split('T')[0],
      endDate: sunday.toISOString().split('T')[0]
    }
  }

  useEffect(() => {
    const fetchManagers = async () => {
      setLoading(true)
      try {
        const data = await fetchAdminManagers({
          contractStatus: 'PENDING',
          size: 3,
          page: 0
        })
        setNewManagers(data.content || [])
        setNewManagersTotal(data.page.totalElements || 0)
      } catch (error) {
        console.error('매니저 목록 조회 실패:', error)
        setNewManagers([])
        setNewManagersTotal(0)
      } finally {
        setLoading(false)
      }
    }
    fetchManagers()
  }, [])

  useEffect(() => {
    const fetchPendingInquiries = async () => {
      setPendingInquiriesLoading(true)
      try {
        const [customer, manager] = await Promise.all([
          searchAdminInquiries({
            authorType: 'customer',
            replyStatus: false,
            page: 0,
            size: 3
          }),
          searchAdminInquiries({
            authorType: 'manager',
            replyStatus: false,
            page: 0,
            size: 3
          })
        ])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const combined = [
          ...(customer.content || []).map((item: any) => ({
            ...item,
            type: 'customer'
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(manager.content || []).map((item: any) => ({
            ...item,
            type: 'manager'
          }))
        ]
        combined.sort((a, b) => {
          if (a.createdAt === b.createdAt)
            return (b.inquiryId || 0) - (a.inquiryId || 0)
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        })
        setPendingInquiries(combined.slice(0, 3))
        setTotalPendingInquiries(
          (customer.page?.totalElements || 0) +
            (manager.page?.totalElements || 0)
        )
      } catch (error) {
        console.error('문의사항 목록 조회 실패:', error)
        setPendingInquiries([])
        setTotalPendingInquiries(0)
      } finally {
        setPendingInquiriesLoading(false)
      }
    }
    fetchPendingInquiries()
  }, [])

  // 이번주 예상 정산 금액 조회
  useEffect(() => {
    const fetchThisWeekSettlement = async () => {
      setSettlementLoading(true)
      setSettlementError(null)
      try {
        const weekRange = getThisWeekRange()
        const data = await getExpectedSettlementThisWeek(
          weekRange.startDate,
          weekRange.endDate
        )
        setThisWeekSettlement(data)
      } catch (error) {
        console.error('이번주 예상 정산 금액 조회 실패:', error)
        setSettlementError('이번주 예상 정산 금액을 불러오지 못했습니다.')
      } finally {
        setSettlementLoading(false)
      }
    };
    fetchThisWeekSettlement()
  }, [])

  useEffect(() => {
    const fetchWeeklyReservations = async () => {
      try {
        // 이번 주 월~일 날짜 구하기
        const today = new Date()
        const weekStart = startOfWeek(today)
        const weekEnd = endOfWeek(today)
        const fromRequestDate = formatDate(weekStart)
        const toRequestDate = formatDate(weekEnd)
        // 예약 데이터 가져오기 (상태 필터 추가)
        const data = await fetchAdminReservations({
          fromRequestDate,
          toRequestDate,
          status: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'],
          size: 1000
        })
        // 요일별 카운트 집계
        const weekDays = [
          { key: 1, label: '월' },
          { key: 2, label: '화' },
          { key: 3, label: '수' },
          { key: 4, label: '목' },
          { key: 5, label: '금' },
          { key: 6, label: '토' },
          { key: 0, label: '일' }
        ]
        const counts: Record<number, number> = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0
        }
        for (const r of data.content || []) {
          if (!r.requestDate) continue
          const d = parseDate(r.requestDate)
          const day = d.getDay()
          counts[day] = (counts[day] || 0) + 1
        }
        // 월~일 순서로 정렬
        const chartData = weekDays.map(({ key, label }) => ({
          day: label,
          count: counts[key] || 0
        }))
        setWeeklyReservationData(chartData)
        const thisWeekCount = data.page?.totalElements || data.totalElements || 0
        setWeeklyReservationCount(thisWeekCount)
        // 별도 API 호출로 이번주 COMPLETED 예약만 카운트
        const completedData = await fetchAdminReservations({
          fromRequestDate,
          toRequestDate,
          status: ['COMPLETED'],
          size: 1000
        })
        setWeeklyCompletedCount(
          completedData.page?.totalElements || completedData.totalElements || 0
        )
        // 지난주 데이터
        const lastWeekStart = new Date(weekStart)
        lastWeekStart.setDate(weekStart.getDate() - 7)
        const lastWeekEnd = new Date(weekEnd)
        lastWeekEnd.setDate(weekEnd.getDate() - 7)
        const lastWeekFrom = formatDate(lastWeekStart)
        const lastWeekTo = formatDate(lastWeekEnd)
        const lastWeekData = await fetchAdminReservations({
          fromRequestDate: lastWeekFrom,
          toRequestDate: lastWeekTo,
          status: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'],
          size: 1000
        })
        setLastWeekReservationCount(
          lastWeekData.page?.totalElements || lastWeekData.totalElements || 0
        )
        // 오늘 예약 건수 (상태: COMPLETED, IN_PROGRESS, CONFIRMED)
        const todayDate = new Date()
        const todayStr = formatDate(todayDate)
        const todayData = await fetchAdminReservations({
          fromRequestDate: todayStr,
          toRequestDate: todayStr,
          status: ['COMPLETED', 'IN_PROGRESS', 'CONFIRMED'],
          size: 1000
        })
        setTodayReservationCount(
          todayData.page?.totalElements || todayData.totalElements || 0
        )
        // 어제 예약 건수
        const yesterday = new Date(todayDate)
        yesterday.setDate(todayDate.getDate() - 1)
        const yesterdayStr = formatDate(yesterday)
        const yesterdayData = await fetchAdminReservations({
          fromRequestDate: yesterdayStr,
          toRequestDate: yesterdayStr,
          status: ['COMPLETED', 'IN_PROGRESS', 'CONFIRMED'],
          size: 1000
        })
        setYesterdayReservationCount(
          yesterdayData.page?.totalElements || yesterdayData.totalElements || 0
        )
      } catch {
        setWeeklyReservationData(fallbackWeek)
        setWeeklyReservationCount(0)
        setWeeklyCompletedCount(0)
        setLastWeekReservationCount(null)
        setTodayReservationCount(0)
        setYesterdayReservationCount(null)
      }
    }
    fetchWeeklyReservations()
  }, [])

  // trend 텍스트에 증가/감소 문구를 자동으로 붙여주는 함수
  function getTrendText(trend: string) {
    if (trend.includes('증가') || trend.includes('감소')) return trend
    if (trend.startsWith('-') || trend.includes('▼')) return trend + ' 감소'
    return trend + ' 증가'
  }

  // 이번주 총 예약 건수 변동률 계산
  function getWeeklyReservationTrend() {
    if (lastWeekReservationCount === null) return { text: '변동 없음', color: 'text-gray-500' }
    if (lastWeekReservationCount === 0 && weeklyReservationCount === 0) return { text: '변동 없음', color: 'text-gray-500' }
    if (lastWeekReservationCount === 0) return { text: '+100% 증가', color: 'text-green-600' }
    const diff = weeklyReservationCount - lastWeekReservationCount
    const percent = ((diff / lastWeekReservationCount) * 100).toFixed(1)
    if (diff === 0) return { text: '변동 없음', color: 'text-gray-500' }
    if (diff > 0) return { text: `+${percent}% 증가`, color: 'text-green-600' }
    return { text: `${percent}% 감소`, color: 'text-red-600' }
  }

  // 이번주 완료률 계산 및 색상 반환
  function getWeeklyCompletionRate() {
    if (weeklyReservationCount === 0) return { rate: 0, color: 'text-gray-500' }
    const rate = (weeklyCompletedCount / weeklyReservationCount) * 100
    if (rate < 33) return { rate: rate.toFixed(1), color: 'text-red-600' }
    if (rate < 66) return { rate: rate.toFixed(1), color: 'text-yellow-500' }
    return { rate: rate.toFixed(1), color: 'text-green-600' }
  }

  // 오늘 예약 변동률 계산
  function getTodayReservationTrend() {
    if (yesterdayReservationCount === null) return { text: '변동 없음', color: 'text-gray-500' }
    if (yesterdayReservationCount === 0 && todayReservationCount === 0) return { text: '변동 없음', color: 'text-gray-500' }
    if (yesterdayReservationCount === 0) return { text: '+100% 증가', color: 'text-green-600' }
    const diff = todayReservationCount - yesterdayReservationCount
    const percent = ((diff / yesterdayReservationCount) * 100).toFixed(1)
    if (diff === 0) return { text: '변동 없음', color: 'text-gray-500' }
    if (diff > 0) return { text: `+${percent}% 증가`, color: 'text-green-600' }
    return { text: `${percent}% 감소`, color: 'text-red-600' }
  }

  return (
    <Fragment>
      <div className="inline-flex flex-1 flex-col items-start justify-start self-stretch">
        <div className="inline-flex h-16 items-center justify-start self-stretch border-b border-gray-200 bg-white px-6">
          <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
            대시보드
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start justify-start gap-6 self-stretch p-6">
          <div className="flex flex-col items-start justify-start gap-4 self-stretch">
            <div className="inline-flex items-start justify-start gap-4 self-stretch">
              <div
                className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:bg-indigo-50 transition-colors"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const weekRange = getThisWeekRange();
                  navigate('/admin/reservations', {
                    state: {
                      statusFilter: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'],
                      dateRange: weekRange
                    }
                  });
                }}
              >
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-gray-500">
                  이번주 총 예약 건수
                </div>
                <div className="justify-start text-gray-900 text-2xl font-bold font-['Inter'] leading-7">
                  {weeklyReservationCount}
                </div>
                <div className="inline-flex justify-start items-center gap-1">
                  {/* No trend data available from API, so no arrow icons */}
                  {(() => {
                    const trend = getWeeklyReservationTrend()
                    return (
                      <div
                        className={`font-['Inter'] text-xs leading-none font-medium ${trend.color}`}
                      >
                        {trend.text}
                      </div>
                    )
                  })()}
                </div>
              </div>
              <div
                className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:bg-indigo-50 transition-colors"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const weekRange = getThisWeekRange();
                  navigate('/admin/reservations', {
                    state: {
                      statusFilter: ['COMPLETED'],
                      dateRange: weekRange
                    }
                  });
                }}
              >
                <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                  이번주 완료된 예약 건수
                </div>
                <div className="justify-start text-gray-900 text-2xl font-bold font-['Inter'] leading-7">
                  {weeklyCompletedCount}
                </div>
                <div className="inline-flex justify-start items-center gap-1">
                  {/* 진행률 표시 */}
                  {(() => {
                    const { rate, color } = getWeeklyCompletionRate()
                    return (
                      <div className={`font-['Inter'] text-xs leading-none font-medium ${color}`}>
                        진행률 {rate}%
                      </div>
                    )
                  })()}
                </div>
              </div>
              <div
                className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] transition-colors hover:bg-indigo-50"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const today = formatDate(new Date())
                  navigate('/admin/reservations', {
                    state: {
                      statusFilter: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'],
                      dateRange: { startDate: today, endDate: today }
                    }
                  })
                }}
              >
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-gray-500">
                  오늘의 예약 건수
                </div>
                <div className="font-['Inter'] text-2xl leading-7 font-bold text-gray-900 justify-start">
                  {todayReservationCount}
                </div>
                {/* 변동 통계(변동률) 제거: trend 텍스트 삭제 */}
              </div>
            </div>
            <div className="inline-flex items-start justify-start gap-4 self-stretch">
              <div
                className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-1 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:bg-indigo-50 transition-colors"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/admin/settlements')}
              >
                <div className="flex items-center gap-1">
                  <BanknotesIcon className="h-4 w-4 text-emerald-500" />
                  <span className="font-['Inter'] text-sm leading-none font-medium text-gray-500">
                    이번주 예상 정산
                  </span>
                </div>
                <div className="justify-start font-['Inter'] text-2xl leading-7 font-bold text-emerald-600">
                  {settlementLoading
                    ? '...'
                    : settlementError
                      ? '-'
                      : `${thisWeekSettlement?.thisWeekEstimated?.toLocaleString() ?? 0}원`}
                </div>
                <div className="flex w-fit items-center gap-1 rounded bg-indigo-50 px-2 py-0.5">
                  <BanknotesIcon className="h-3 w-3 text-indigo-500" />
                  <span className="text-xs font-medium text-indigo-700">
                    수수료:{' '}
                    {settlementLoading
                      ? '...'
                      : settlementError
                        ? '-'
                        : `${thisWeekSettlement?.thisWeekEstimatedPlatformFee?.toLocaleString() ?? 0}원`}
                  </span>
                </div>
              </div>
              <div
                className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:bg-indigo-50 transition-colors"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/admin/managers', { state: { tab: 'applied' } })}
              >
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-gray-500">
                  신규 매니저 신청 수
                </div>
                <div
                  className="justify-start font-['Inter'] text-2xl leading-7 font-bold text-amber-500"
                >
                  {newManagersTotal}
                </div>
                {newManagersTotal > 0 && (
                  <div className="inline-flex items-center justify-center rounded-xl bg-amber-50 px-2 py-0.5">
                    <div className="justify-start font-['Inter'] text-xs leading-none font-medium text-amber-600">
                      확인 필요
                    </div>
                  </div>
                )}
              </div>
              <div
                className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:bg-indigo-50 transition-colors"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/admin/inquiries')}
              >
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-gray-500">
                  새로 등록된 문의글 수
                </div>
                <div
                  className="justify-start font-['Inter'] text-2xl leading-7 font-bold text-amber-500"
                >
                  {totalPendingInquiries}
                </div>
                {totalPendingInquiries > 0 && (
                  <div className="inline-flex items-center justify-center rounded-xl bg-amber-50 px-2 py-0.5">
                    <div className="justify-start font-['Inter'] text-xs leading-none font-medium text-amber-600">
                      답변 필요
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 이번 주 예약 현황 (막대그래프) */}
          <div className="self-stretch p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-gray-900 text-base font-semibold font-['Inter'] leading-tight">
                이번 주 예약 현황
              </div>
              <div className="justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-none">
                {(() => {
                  const today = new Date()
                  const weekStart = startOfWeek(today)
                  const weekEnd = endOfWeek(today)
                  return `${weekStart.getFullYear()}년 ${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 ~ ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`
                })()}
              </div>
            </div>
            {/* 커스텀 바 차트 */}
            <div className="flex items-end min-h-[100px] w-full justify-center gap-0 px-0 py-4 md:min-h-[160px] md:px-0 md:py-6 lg:min-h-[200px]">
              {(weeklyReservationData.length === 7 ? weeklyReservationData : fallbackWeek).map((stat, i, arr) => {
                const maxCount = Math.max(...arr.map(d => d.count), 1)
                // Calculate the date for this bar (월~일 순서)
                const today = new Date()
                const weekStart = startOfWeek(today)
                const barDate = new Date(weekStart)
                barDate.setDate(weekStart.getDate() + i)
                const barDateStr = formatDate(barDate)
                return (
                  <div
                    key={stat.day}
                    className="group flex min-w-[40px] flex-1 flex-col items-center md:min-w-[56px] lg:min-w-[64px] cursor-pointer"
                    onClick={() => {
                      navigate('/admin/reservations', {
                        state: {
                          statusFilter: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'],
                          dateRange: { startDate: barDateStr, endDate: barDateStr }
                        }
                      })
                    }}
                  >
                    {/* 예약 건수 */}
                    <span
                      className={`text-xs font-semibold md:text-sm ${stat.count > 0 ? 'text-indigo-600' : 'text-slate-300'}`}
                    >
                      {stat.count}
                    </span>
                    {/* 막대그래프 */}
                    <div
                      className={
                        `mx-auto w-full max-w-[32px] rounded-t-lg transition-all duration-200 group-hover:scale-110 md:max-w-[40px] lg:max-w-[48px] ` +
                        (stat.count > 0
                          ? 'bg-gradient-to-t from-indigo-400 to-indigo-200 shadow-md group-hover:bg-indigo-300'
                          : 'bg-slate-100')
                      }
                      style={{ height: `${(stat.count / maxCount) * 80 + 12}px` }}
                      title={`${stat.day}요일 예약`}
                    ></div>
                    {/* 요일 */}
                    <span className="text-xs font-medium text-slate-500 md:text-sm">
                      {stat.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="inline-flex items-start justify-start gap-6 self-stretch">
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-4 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="justify-start font-['Inter'] text-base leading-tight font-semibold text-gray-900">
                  신규 매니저 신청
                </div>
                <div
                  className="flex justify-start items-center gap-1 cursor-pointer"
                  onClick={() => navigate('/admin/managers', { state: { tab: 'applied' } })}
                >
                  <div className="justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">
                    전체보기
                  </div>
                  <ChevronRight className="ml-0.5 h-4 w-4 text-indigo-600" />
                </div>
              </div>
              <NewManagerList
                managers={newManagers}
                loading={loading}
                onClickItem={id => navigate(`/admin/managers/${id}`)}
              />
            </div>
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-4 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="justify-start font-['Inter'] text-base leading-tight font-semibold text-gray-900">
                  답변이 필요한 문의사항
                </div>
                <div
                  className="flex justify-start items-center gap-1 cursor-pointer"
                  onClick={() => navigate('/admin/inquiries')}
                >
                  <div className="justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">
                    전체보기
                  </div>
                  <ChevronRight className="ml-0.5 h-4 w-4 text-indigo-600" />
                </div>
              </div>
              <PendingInquiryList
                inquiries={pendingInquiries}
                loading={pendingInquiriesLoading}
                onClickItem={(inquiryId, authorId) =>
                  navigate(`/admin/inquiries/${inquiryId}`, { state: { authorId } })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}