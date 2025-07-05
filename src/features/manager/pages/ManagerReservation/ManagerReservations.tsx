import { Fragment, useEffect, useRef, useState } from 'react'
import type { ManagerReservationSummary as ManagerReservationType } from '@/features/manager/types/ManagerReservationType'
import { isValidDateRange } from '@/shared/utils/validation'
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/constants'
import { searchManagerReservations } from '@/features/manager/api/managerReservation'
import { getDateRangePreset } from '@/shared/utils/dateUtils'
import { PageHeader } from '@/shared/components'
import { ManagerReservationSearchForm } from '@/features/manager/components/ManagerReservationSearchForm'
import { ManagerReservationTable } from '@/features/manager/components/ManagerReservationTable'

export const ManagerReservations = () => {
  const statuses = [
    { value: 'PRE_CANCELED', label: '예약 확정 전 취소' },
    { value: 'REQUESTED', label: '예약 요청' },
    { value: 'IN_PROGRESS', label: '서비스 진행 중' },
    { value: 'CONFIRMED', label: '예약 완료' },
    { value: 'COMPLETED', label: '방문 완료' },
    { value: 'CANCELED', label: '예약 취소' },
    { value: 'REJECTED', label: '예약 거절' }
  ]

  const [fadeKey, setFadeKey] = useState(0)
  const [reservations, setReservations] = useState<ManagerReservationType[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [fromRequestDate, setFromRequestDate] = useState<string>('')
  const [toRequestDate, setToRequestDate] = useState<string>('')
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    statuses.map(s => s.value)
  )
  const [selectedCheckedIn, setSelectedCheckedIn] = useState<string[]>([
    'true',
    'false'
  ])
  const [selectedCheckedOut, setSelectedCheckedOut] = useState<string[]>([
    'true',
    'false'
  ])
  const [selectedReviewed, setSelectedReviewed] = useState<string[]>([
    'true',
    'false'
  ])
  const [customerNameKeyword, setCustomerNameKeyword] = useState('')
  const fromDateRef = useRef<HTMLInputElement>(null)

  const formData = {
    customerNameKeyword
  }

  const handleFormDataChange = (
    _key: 'customerNameKeyword',
    value: string | string[]
  ) => {
    setCustomerNameKeyword(value as string)
  }

  const handleDateRangeChange = (preset: string) => {
    setSelectedDateRange(preset)
    const { start, end } = getDateRangePreset(preset)
    setFromRequestDate(start)
    setToRequestDate(end)
    setPage(0)
    // 날짜 변경 시 즉시 검색
    fetchReservations({ page: 0, fromRequestDate: start, toRequestDate: end })
  }

  const fetchReservations = (
    paramsOverride?: Partial<ReturnType<typeof getCurrentParams>>
  ) => {
    const params = getCurrentParams()
    const finalParams = { ...params, ...paramsOverride }

    // 파라미터에서 실제 필터 값들 추출
    const statusValues = finalParams.reservationStatus ? finalParams.reservationStatus.split(',') : statuses.map(s => s.value)
    const checkedInValues = finalParams.isCheckedIn ? finalParams.isCheckedIn.split(',') : ['true', 'false']
    const checkedOutValues = finalParams.isCheckedOut ? finalParams.isCheckedOut.split(',') : ['true', 'false']
    const reviewedValues = finalParams.isReviewed ? finalParams.isReviewed.split(',') : ['true', 'false']

    // 아무것도 선택되지 않은 경우 빈 결과 표시
    if (
      statusValues.length === 0 ||
      checkedInValues.length === 0 ||
      checkedOutValues.length === 0 ||
      reviewedValues.length === 0
    ) {
      setReservations([])
      setTotal(0)
      setFadeKey(prev => prev + 1)
      return
    }

    if (
      finalParams.fromRequestDate &&
      finalParams.toRequestDate &&
      !isValidDateRange(finalParams.fromRequestDate, finalParams.toRequestDate)
    ) {
      alert('시작일은 종료일보다 늦을 수 없습니다.')
      fromDateRef.current?.focus()
      return
    }

    searchManagerReservations(finalParams).then(res => {
      // API에서 이미 매핑된 데이터를 사용
      setReservations(res.content || [])
      setTotal(res.page.totalElements)
      setFadeKey(prev => prev + 1)
    })
  }

  const getCurrentParams = () => ({
    fromRequestDate,
    toRequestDate,
    reservationStatus:
      selectedStatuses.length === statuses.length
        ? ''
        : selectedStatuses.join(','),
    isCheckedIn:
      selectedCheckedIn.length === 2 ? '' : selectedCheckedIn.join(','),
    isCheckedOut:
      selectedCheckedOut.length === 2 ? '' : selectedCheckedOut.join(','),
    isReviewed: selectedReviewed.length === 2 ? '' : selectedReviewed.join(','),
    customerNameKeyword,
    page,
    size: DEFAULT_PAGE_SIZE
  })

  useEffect(() => {
    fetchReservations()
  }, [page])

  const handleSearch = (keyword?: string) => {
    // keyword가 전달되면 해당 값으로 상태 업데이트
    if (keyword !== undefined) {
      setCustomerNameKeyword(keyword)
    }

    setPage(0)
    // 검색 시 최신 keyword 값 사용
    const searchKeyword = keyword !== undefined ? keyword : customerNameKeyword
    fetchReservations({
      page: 0,
      customerNameKeyword: searchKeyword
    })
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const totalPages = Math.max(Math.ceil(total / DEFAULT_PAGE_SIZE), 1)

  return (
    <Fragment>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start justify-start">
        <PageHeader title="예약 관리" />

        <div className="flex flex-col items-start justify-start gap-6 self-stretch p-6">
          {/* 고객명/주소 검색 */}
          <div className="flex w-full flex-row items-center justify-end">
            <ManagerReservationSearchForm
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onSearch={handleSearch}
            />
          </div>

          <ManagerReservationTable
            reservations={reservations}
            total={total}
            fadeKey={fadeKey}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            statuses={statuses}
            selectedStatuses={selectedStatuses}
            onStatusFilterChange={newStatuses => {
              setSelectedStatuses(newStatuses)
              setPage(0)
              // 새로운 상태 값으로 즉시 검색
              const newParams = getCurrentParams()
              newParams.reservationStatus = newStatuses.length === statuses.length ? '' : newStatuses.join(',')
              newParams.page = 0
              fetchReservations(newParams)
            }}
            selectedCheckedIn={selectedCheckedIn}
            onCheckedInFilterChange={newValues => {
              setSelectedCheckedIn(newValues)
              setPage(0)
              // 새로운 상태 값으로 즉시 검색
              const newParams = getCurrentParams()
              newParams.isCheckedIn = newValues.length === 2 ? '' : newValues.join(',')
              newParams.page = 0
              fetchReservations(newParams)
            }}
            selectedCheckedOut={selectedCheckedOut}
            onCheckedOutFilterChange={newValues => {
              setSelectedCheckedOut(newValues)
              setPage(0)
              // 새로운 상태 값으로 즉시 검색
              const newParams = getCurrentParams()
              newParams.isCheckedOut = newValues.length === 2 ? '' : newValues.join(',')
              newParams.page = 0
              fetchReservations(newParams)
            }}
            selectedReviewed={selectedReviewed}
            onReviewedFilterChange={newValues => {
              setSelectedReviewed(newValues)
              setPage(0)
              // 새로운 상태 값으로 즉시 검색
              const newParams = getCurrentParams()
              newParams.isReviewed = newValues.length === 2 ? '' : newValues.join(',')
              newParams.page = 0
              fetchReservations(newParams)
            }}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
      </div>
    </Fragment>
  )
}
