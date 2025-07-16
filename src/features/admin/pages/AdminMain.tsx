import { Fragment, useEffect, useState } from 'react'
import { fetchAdminManagers } from '../api/adminManager'
import { useNavigate } from 'react-router-dom'
import { searchAdminInquiries } from '../api/adminInquiry'
import { getExpectedSettlementThisWeek } from '../api/adminSettlement'
import { ChevronRight, ArrowUp, ArrowDown } from 'lucide-react'
import { BanknotesIcon } from '@heroicons/react/24/solid'

const EXCLUDE_STATUSES = ['ACTIVE', 'REJECTED', 'TERMINATED'] // "승인대기"(예: WAITING)는 제외

export const AdminMain = () => {
  const [newManagers, setNewManagers] = useState<any[]>([])
  const [newManagersTotal, setNewManagersTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pendingInquiries, setPendingInquiries] = useState<any[]>([])
  const [pendingInquiriesLoading, setPendingInquiriesLoading] = useState(false)
  const [totalPendingInquiries, setTotalPendingInquiries] = useState(0)

  // 이번주 예상 정산 금액 상태
  const [thisWeekSettlement, setThisWeekSettlement] = useState<{
    thisWeekEstimated: number
    thisWeekEstimatedPlatformFee: number
  } | null>(null)
  const [settlementLoading, setSettlementLoading] = useState(false)
  const [settlementError, setSettlementError] = useState<string | null>(null)

  const navigate = useNavigate()

  // 하드코딩된 추이 데이터 (실제 API 연동 전용)
  const stats = {
    totalReservation: { value: 248, trend: '12% 증가' },
    completedReservation: { value: 186, trend: '8% 증가' },
    todayReservation: { value: 24, trend: '+12%' }
  }

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

  // 하드코딩된 오늘의 스케줄 데이터
  const todaySchedules = [
    {
      time: '09:00 - 12:00',
      title: '홍길동 고객 방문 청소',
      address: '서울시 강남구 테헤란로 123'
    },
    {
      time: '14:00 - 17:00',
      title: '김철수 고객 방문 청소',
      address: '서울시 서초구 서초대로 456'
    },
    {
      time: '18:00 - 20:00',
      title: '이영희 고객 방문 청소',
      address: '서울시 송파구 올림픽로 789'
    }
  ]

  useEffect(() => {
    const fetchManagers = async () => {
      setLoading(true)
      try {
        const data = await fetchAdminManagers({
          excludeStatus: EXCLUDE_STATUSES,
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
        const combined = [
          ...(customer.content || []).map((item: any) => ({
            ...item,
            type: 'customer'
          })),
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
    }
    fetchThisWeekSettlement()
  }, [])

  // 오늘 날짜와 요일을 포맷하는 함수
  function getTodayString() {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const date = today.getDate()
    const days = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일'
    ]
    const day = days[today.getDay()]
    return `${year}년 ${month}월 ${date}일 ${day}`
  }

  // trend 텍스트에 증가/감소 문구를 자동으로 붙여주는 함수
  function getTrendText(trend: string) {
    if (trend.includes('증가') || trend.includes('감소')) return trend
    if (trend.startsWith('-') || trend.includes('▼')) return trend + ' 감소'
    return trend + ' 증가'
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
              <div className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-gray-500">
                  이번주 총 예약 건수
                </div>
                <div className="justify-start font-['Inter'] text-2xl leading-7 font-bold text-gray-900">
                  {stats.totalReservation.value}
                </div>
                <div className="inline-flex items-center justify-start gap-1">
                  {stats.totalReservation.trend.includes('감소') ? (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-emerald-500" />
                  )}
                  <div
                    className={`justify-start font-['Inter'] text-xs leading-none font-medium ${stats.totalReservation.trend.includes('감소') ? 'text-red-500' : 'text-emerald-500'}`}>
                    {stats.totalReservation.trend}
                  </div>
                </div>
              </div>
              <div className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-gray-500">
                  완료된 예약 건수
                </div>
                <div className="justify-start font-['Inter'] text-2xl leading-7 font-bold text-gray-900">
                  {stats.completedReservation.value}
                </div>
                <div className="inline-flex items-center justify-start gap-1">
                  {stats.completedReservation.trend.includes('감소') ? (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-emerald-500" />
                  )}
                  <div
                    className={`justify-start font-['Inter'] text-xs leading-none font-medium ${stats.completedReservation.trend.includes('감소') ? 'text-red-500' : 'text-emerald-500'}`}>
                    {stats.completedReservation.trend}
                  </div>
                </div>
              </div>
              <div className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-gray-500">
                  오늘의 예약 건수
                </div>
                <div className="justify-start font-['Inter'] text-2xl leading-7 font-bold text-gray-900">
                  {stats.todayReservation.value}
                </div>
                <div className="inline-flex items-center justify-start gap-1">
                  {stats.todayReservation.trend.includes('감소') ? (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-emerald-500" />
                  )}
                  <div
                    className={`justify-start font-['Inter'] text-xs leading-none font-medium ${stats.todayReservation.trend.includes('감소') ? 'text-red-500' : 'text-emerald-500'}`}>
                    {getTrendText(stats.todayReservation.trend)}
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex items-start justify-start gap-4 self-stretch">
              <div className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-1 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
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
              <div className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-gray-500">
                  신규 매니저 신청 수
                </div>
                <div
                  className="cursor-pointer justify-start font-['Inter'] text-2xl leading-7 font-bold text-amber-500 hover:underline"
                  onClick={() =>
                    navigate('/admin/managers', { state: { tab: 'applied' } })
                  }>
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
              <div className="inline-flex h-24 flex-1 flex-col items-start justify-start gap-2 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-gray-500">
                  새로 등록된 문의글 수
                </div>
                <div
                  className="cursor-pointer justify-start font-['Inter'] text-2xl leading-7 font-bold text-amber-500 hover:underline"
                  onClick={() => navigate('/admin/inquiries')}>
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
          <div className="flex flex-col items-start justify-start gap-4 self-stretch rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
            <div className="inline-flex items-center justify-between self-stretch">
              <div className="justify-start font-['Inter'] text-base leading-tight font-semibold text-gray-900">
                오늘의 스케줄
              </div>
              <div className="justify-start font-['Inter'] text-sm leading-none font-normal text-gray-500">
                {getTodayString()}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-3 self-stretch">
              {todaySchedules.map((schedule, idx) => (
                <div
                  key={idx}
                  className="inline-flex cursor-pointer items-center justify-between self-stretch rounded-lg bg-gray-50 p-3 transition-colors hover:bg-indigo-50">
                  <div className="flex items-center justify-start gap-3">
                    <div className="flex items-center justify-center rounded bg-indigo-100 px-2 py-1">
                      <div className="justify-start font-['Inter'] text-xs leading-none font-medium text-indigo-600">
                        {schedule.time}
                      </div>
                    </div>
                    <div className="inline-flex flex-col items-start justify-start gap-0.5">
                      <div className="justify-start font-['Inter'] text-sm leading-none font-semibold text-gray-900">
                        {schedule.title}
                      </div>
                      <div className="justify-start font-['Inter'] text-xs leading-none font-normal text-gray-500">
                        {schedule.address}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="inline-flex items-start justify-start gap-6 self-stretch">
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-4 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="justify-start font-['Inter'] text-base leading-tight font-semibold text-gray-900">
                  신규 매니저 신청
                </div>
                <div
                  className="flex cursor-pointer items-center justify-start gap-1"
                  onClick={() =>
                    navigate('/admin/managers', { state: { tab: 'applied' } })
                  }>
                  <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-indigo-600">
                    전체보기
                  </div>
                  <ChevronRight className="ml-0.5 h-4 w-4 text-indigo-600" />
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-3 self-stretch">
                {loading ? (
                  <div>로딩중...</div>
                ) : newManagers.length === 0 ? (
                  <div>신규 매니저 신청이 없습니다.</div>
                ) : (
                  newManagers.map(manager => (
                    <div
                      key={manager.id}
                      className="inline-flex cursor-pointer items-center justify-between self-stretch rounded-lg bg-gray-50 p-3 transition-colors hover:bg-indigo-50"
                      onClick={() =>
                        navigate(`/admin/managers/${manager.managerId}`)
                      }>
                      <div className="flex items-center justify-start gap-3">
                        <div className="inline-flex h-10 w-10 flex-col items-center justify-center rounded-[20px] bg-indigo-100">
                          <div className="justify-start font-['Inter'] text-sm leading-none font-semibold text-indigo-600">
                            {manager.userName
                              ? manager.userName
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')
                              : '?'}
                          </div>
                        </div>
                        <div className="inline-flex flex-col items-start justify-start gap-0.5">
                          <div className="justify-start font-['Inter'] text-sm leading-none font-semibold text-gray-900">
                            {manager.userName}
                          </div>
                          <div className="justify-start font-['Inter'] text-xs leading-none font-normal text-gray-500">
                            {manager.createdAt?.slice(0, 10)} 신청
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-4 rounded-lg bg-white p-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="justify-start font-['Inter'] text-base leading-tight font-semibold text-gray-900">
                  답변이 필요한 문의사항
                </div>
                <div
                  className="flex cursor-pointer items-center justify-start gap-1"
                  onClick={() => navigate('/admin/inquiries')}>
                  <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-indigo-600">
                    전체보기
                  </div>
                  <ChevronRight className="ml-0.5 h-4 w-4 text-indigo-600" />
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-3 self-stretch">
                {pendingInquiriesLoading ? (
                  <div>로딩중...</div>
                ) : pendingInquiries.length === 0 ? (
                  <div>답변이 필요한 문의사항이 없습니다.</div>
                ) : (
                  pendingInquiries.map(inquiry => (
                    <div
                      key={inquiry.inquiryId}
                      className="inline-flex cursor-pointer items-center justify-between self-stretch rounded-lg bg-gray-50 p-3 transition-colors hover:bg-indigo-50"
                      onClick={() =>
                        navigate(`/admin/inquiries/${inquiry.inquiryId}`, {
                          state: { authorId: inquiry.authorId }
                        })
                      }>
                      <div className="flex items-center justify-start gap-3">
                        <div
                          className={`flex items-center justify-center rounded-xl px-2 py-0.5 ${inquiry.type === 'customer' ? 'bg-amber-100' : 'bg-indigo-100'}`}>
                          <div
                            className={`justify-start font-['Inter'] text-xs leading-none font-medium ${inquiry.type === 'customer' ? 'text-amber-600' : 'text-indigo-600'}`}>
                            {inquiry.type === 'customer' ? '고객' : '매니저'}
                          </div>
                        </div>
                        <div className="inline-flex flex-col items-start justify-start gap-0.5">
                          <div className="justify-start font-['Inter'] text-sm leading-none font-semibold text-gray-900">
                            {inquiry.title}
                          </div>
                          <div className="justify-start font-['Inter'] text-xs leading-none font-normal text-gray-500">
                            {inquiry.createdAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
