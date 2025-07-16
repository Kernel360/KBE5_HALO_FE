import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchAdminReservations } from '@/features/admin/api/adminReservation'
import type {
  AdminReservation,
  AdminReservationSearchParams
} from '@/features/admin/types/AdminReservationType'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import { AdminTable } from '@/features/admin/components/AdminTable'
import type { AdminTableColumn } from '@/features/admin/components/AdminTable'
import { AdminSearchForm } from '@/features/admin/components/AdminSearchForm'
import type { AdminSearchField } from '@/features/admin/components/AdminSearchForm'
import { AdminPagination } from '@/features/admin/components/AdminPagination'
import TableSection from '@/features/admin/components/TableSection'
import Toast from '@/shared/components/ui/toast/Toast'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'
import { getReservationStatusStyle } from '@/features/manager/utils/ManagerReservationStauts'
import DateRangeCalendar from '@/shared/components/ui/DateRangeCalendar'
import { PAYMENT_STATUS_OPTIONS } from '@/features/admin/types/AdminReservationType'
import { MultiSelectDropdown } from '@/shared/components/ui/MultiSelectDropdown'

export const AdminReservations = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // 검색/필터/페이지네이션 상태
  const [searchParams, setSearchParams] = useState<AdminReservationSearchParams>({
    customerNameKeyword: '',
    managerNameKeyword: '',
    status: [],
    page: 0,
    size: 10
  })

  const [reservations, setReservations] = useState<AdminReservation[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null)
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null)

  // 예약 상태 옵션 (드롭다운용)
  const RESERVATION_STATUS_OPTIONS = [
    { value: 'PRE_CANCELED', label: '예약 확정 전 취소' },
    { value: 'REQUESTED', label: '예약 요청' },
    { value: 'IN_PROGRESS', label: '서비스 진행 중' },
    { value: 'CONFIRMED', label: '예약 완료' },
    { value: 'COMPLETED', label: '방문 완료' },
    { value: 'CANCELED', label: '예약 취소' },
    { value: 'REJECTED', label: '예약 거절' }
  ]
  // 결제 상태 옵션 (드롭다운용)
  // PAYMENT_STATUS_OPTIONS는 이미 import됨

  // 상태 필터 state (초기값: 전체 선택)
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string[]>(
    RESERVATION_STATUS_OPTIONS.map(opt => opt.value)
  )
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string[]>(
    (PAYMENT_STATUS_OPTIONS as unknown as { value: string; label: string }[]).map(opt => opt.value)
  )

  // 날짜 범위 상태
  const [dateRange, setDateRange] = useState<{
    startDate: string
    endDate: string
  }>({
    startDate: '',
    endDate: ''
  })

  const [initialized, setInitialized] = useState(false)

  // --- Add effect to apply initial filter from navigation state ---
  useEffect(() => {
    if (location.state && (location.state.statusFilter || location.state.dateRange)) {
      if (location.state.statusFilter) {
        setReservationStatusFilter(location.state.statusFilter)
      }
      if (location.state.dateRange) {
        setDateRange(location.state.dateRange)
      }
      setSearchParams(prev => ({
        ...prev,
        status: location.state.statusFilter || prev.status,
        fromRequestDate: location.state.dateRange?.startDate || prev.fromRequestDate,
        toRequestDate: location.state.dateRange?.endDate || prev.toRequestDate,
        page: 0
      }))
      setInitialized(true)
    } else {
      setInitialized(true)
    }
    // eslint-disable-next-line
  }, [])

  // 데이터 fetch
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminReservations({
        ...searchParams,
        customerNameKeyword: searchParams.customerNameKeyword,
        managerNameKeyword: searchParams.managerNameKeyword,
        status:
          reservationStatusFilter.length > 0
            ? reservationStatusFilter
            : searchParams.status
      })
      let mappedReservations: AdminReservation[] = (data.content || []).map(reservation => ({
        id: reservation.reservationId,
        customerId: reservation.customerId,
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        customerEmail: reservation.customerEmail,
        managerId: reservation.managerId,
        managerName: reservation.managerName,
        managerPhone: reservation.managerPhone,
        // 매핑 수정: 백엔드 응답 필드 우선 사용 (타입 단언)
        serviceDate: (reservation as any).requestDate || reservation.serviceDate,
        serviceTime: (reservation as any).startTime || reservation.serviceTime,
        serviceDuration: reservation.serviceDuration,
        serviceCategory: (reservation as any).serviceName || reservation.serviceCategory,
        serviceSubCategory: reservation.serviceSubCategory,
        roadAddress: reservation.roadAddress,
        detailAddress: reservation.detailAddress,
        latitude: reservation.latitude,
        longitude: reservation.longitude,
        totalAmount: reservation.totalAmount,
        discountAmount: reservation.discountAmount,
        finalAmount: (reservation as any).price ?? reservation.finalAmount,
        reservationStatus: (reservation as any).status || reservation.reservationStatus,
        paymentStatus: reservation.paymentStatus,
        specialRequests: reservation.specialRequests,
        notes: reservation.notes,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt
      }))
      // 결제 상태 필터는 프론트에서 적용
      if (paymentStatusFilter.length > 0) {
        mappedReservations = mappedReservations.filter(r => paymentStatusFilter.includes(r.paymentStatus))
      }
      setReservations(mappedReservations)
      setTotalPages(data.page?.totalPages || 1)
      setTotalElements(data.page?.totalElements || 0)
      // page 동기화
      if (typeof data.page?.number === 'number' && data.page.number !== (searchParams.page || 0)) {
        setSearchParams(prev => ({ ...prev, page: data.page.number }))
      }
    } catch (error: unknown) {
      const errorMsg = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : '예약 목록을 불러오지 못했습니다.'
      setErrorToastMsg(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [searchParams, reservationStatusFilter, paymentStatusFilter])

  useEffect(() => {
    if (initialized) {
      fetchData()
    }
  }, [fetchData, initialized])

  // 테이블 컬럼 정의
  const columns: AdminTableColumn<AdminReservation>[] = [
    { key: 'customerName', header: '고객명', className: 'text-center' },
    { key: 'managerName', header: '매니저명', className: 'text-center' },
    { key: 'serviceDate', header: '예약 날짜', className: 'text-center' },
    { key: 'serviceTime', header: '예약 시간', className: 'text-center' },
    { key: 'serviceCategory', header: '서비스 항목', className: 'text-center' },
    {
      key: 'reservationStatus',
      header: (
        <span className="flex items-center justify-center gap-2">
          예약 상태
          <MultiSelectDropdown
            options={RESERVATION_STATUS_OPTIONS}
            selectedValues={reservationStatusFilter}
            onSelectionChange={setReservationStatusFilter}
            placeholder="전체"
            buttonClassName="text-xs font-normal text-gray-500 border-none bg-transparent shadow-none px-0 py-0 h-auto min-w-0"
            dropdownClassName="min-w-[180px]"
            // 선택된 항목 이름은 버튼에 표시하지 않음 (기본 구현이 placeholder만 표시)
          />
        </span>
      ),
      className: 'text-center',
      render: row => {
        const { label, bgColor, textColor } = getReservationStatusStyle(row.reservationStatus)
        return (
          <span className={`rounded px-2 py-1 text-xs ${bgColor} ${textColor}`}>{label}</span>
        )
      }
    },
    {
      key: 'paymentStatus',
      header: (
        <span className="flex items-center justify-center gap-2">
          결제 상태
          <MultiSelectDropdown
            options={PAYMENT_STATUS_OPTIONS as unknown as { value: string; label: string }[]}
            selectedValues={paymentStatusFilter}
            onSelectionChange={setPaymentStatusFilter}
            placeholder="전체"
            buttonClassName="text-xs font-normal text-gray-500 border-none bg-transparent shadow-none px-0 py-0 h-auto min-w-0"
            dropdownClassName="min-w-[140px]"
          />
        </span>
      ),
      className: 'text-center',
      render: row => {
        const statusObj = PAYMENT_STATUS_OPTIONS.find(opt => opt.value === row.paymentStatus)
        const label = statusObj ? statusObj.label : row.paymentStatus
        const isSuccess = row.paymentStatus === 'SUCCESS'
        const color = isSuccess
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
        return (
          <span className={`rounded px-2 py-1 text-xs ${color}`}>{label}</span>
        )
      }
    },
    {
      key: 'finalAmount',
      header: '최종 금액',
      className: 'text-center',
      render: row =>
        typeof row.finalAmount === 'number'
          ? row.finalAmount.toLocaleString() + '원'
          : '-'
    }
  ]

  // 행 클릭 시 상세로 이동
  const handleRowClick = (reservation: AdminReservation) => {
    navigate(`/admin/reservations/${reservation.id}`)
  }

  // 검색 폼 필드 정의 (드롭다운: 고객명/매니저명, 텍스트: 검색어)
  const searchFields: AdminSearchField[] = [
    {
      type: 'select',
      name: 'type',
      options: [
        { value: 'customerName', label: '고객명' },
        { value: 'managerName', label: '매니저명' }
      ]
    },
    { type: 'text', name: 'keyword', placeholder: '검색어 입력' }
  ]

  // 검색 실행
  const handleSearch = (values: Record<string, string>) => {
    const { type = 'customerName', keyword = '' } = values
    setSearchParams(prev => ({
      ...prev,
      customerNameKeyword: type === 'customerName' ? keyword : '',
      managerNameKeyword: type === 'managerName' ? keyword : '',
      page: 0,
      fromRequestDate: dateRange.startDate || undefined,
      toRequestDate: dateRange.endDate || undefined
    }))
  }
  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (start: string, end: string) => {
    setDateRange({ startDate: start, endDate: end })
  }
  // 검색폼 초기값에 날짜 범위 포함
  const searchFormInitialValues = {
    type: 'customerName',
    keyword: ''
  }
  // 검색폼 리셋 시 날짜 범위도 초기화
  const handleReset = () => {
    setDateRange({ startDate: '', endDate: '' })
    setSearchParams(prev => ({
      ...prev,
      customerName: '',
      managerName: '',
      status: [],
      fromRequestDate: undefined,
      toRequestDate: undefined,
      page: 0
    }))
  }

  // 페이지네이션 변경
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }))
  }

  return (
    <>
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ''}
        onClose={() => setSuccessToastMsg(null)}
      />
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ''}
        onClose={() => setErrorToastMsg(null)}
      />
      <Toast
        open={!!toastMsg}
        message={toastMsg || ''}
        onClose={() => setToastMsg(null)}
      />
      <div className="w-full flex flex-col">
        <AdminPageHeader title="예약 관리" />
        <div className="p-6 flex flex-col gap-6">
          {/* 검색폼 + 날짜 범위 */}
          <div className="mb-2 flex w-full flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-4">
              <div className="min-w-[260px]">
                <DateRangeCalendar
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  onDateRangeChange={handleDateRangeChange}
                />
              </div>
              <AdminSearchForm
                fields={searchFields}
                initialValues={searchFormInitialValues}
                onSearch={handleSearch}
                className=""
              />
            </div>
            {/* <button
              type="button"
              className="ml-2 text-sm text-gray-500 underline"
              onClick={handleReset}
            >
              초기화
            </button> */}
          </div>
          {/* 테이블+섹션 */}
          <TableSection title="예약 목록" total={totalElements}>
            <div className="hidden md:block">
              <AdminTable
                loading={loading}
                columns={columns}
                data={reservations}
                rowKey={row => row.id}
                onRowClick={handleRowClick}
                emptyMessage="예약 내역이 없습니다."
              />
              <div className="w-full flex justify-center py-4">
                <AdminPagination
                  page={searchParams.page || 0}
                  totalPages={totalPages}
                  onChange={handlePageChange}
                />
              </div>
            </div>
            {/* 모바일: 카드형 리스트 등 필요시 추가 */}
          </TableSection>
        </div>
      </div>
    </>
  )
}
