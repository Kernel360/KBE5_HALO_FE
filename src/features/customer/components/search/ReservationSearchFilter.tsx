import React, { useState } from 'react'
import type { ReservationStatus } from '@/features/customer/types/CustomerReservationType'
import ReservationDateRangeCalendar from '@/shared/components/ui/ReservationDateRangeCalendar'
import { SearchButton } from '@/shared/components/ui/SearchButton'
import { ResetButton } from '@/shared/components/ui/ResetButton'

interface ReservationSearchFilterProps {
  onSearch: (filters: {
    dateRange: { start: string; end: string }
    reservationStatus: ReservationStatus[]
    managerNameKeyword: string
  }) => void
  onReset: () => void
}

const ReservationSearchFilter: React.FC<ReservationSearchFilterProps> = ({
  onSearch,
  onReset
}) => {
  const [selectedStatuses, setSelectedStatuses] = useState<ReservationStatus[]>(
    []
  )
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [managerName, setManagerName] = useState('')

  const handleStatusClick = (selectedStatus: ReservationStatus | '') => {
    let newStatuses: ReservationStatus[]

    if (selectedStatus === '') {
      // 전체 선택 시 모든 상태 선택 해제
      newStatuses = []
    } else {
      // 특정 상태 선택/해제
      if (selectedStatuses.includes(selectedStatus as ReservationStatus)) {
        newStatuses = selectedStatuses.filter(
          s => s !== (selectedStatus as ReservationStatus)
        )
      } else {
        newStatuses = [...selectedStatuses, selectedStatus as ReservationStatus]
      }
    }

    setSelectedStatuses(newStatuses)
    
    // 상태 변경 시 즉시 검색 실행
    onSearch({
      dateRange: { start: startDate, end: endDate },
      reservationStatus: newStatuses,
      managerNameKeyword: managerName
    })
  }

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }

  const handleSearch = () => {
    onSearch({
      dateRange: { start: startDate, end: endDate },
      reservationStatus: selectedStatuses,
      managerNameKeyword: managerName
    })
  }

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setSelectedStatuses([])
    setManagerName('')
    onReset()
  }

  const statusOptions = [
    { label: '전체', value: '' },
    { label: '예약 요청', value: 'REQUESTED' as ReservationStatus },
    { label: '예약 완료', value: 'CONFIRMED' as ReservationStatus },
    { label: '서비스 진행 중', value: 'IN_PROGRESS' as ReservationStatus },
    { label: '방문 완료', value: 'COMPLETED' as ReservationStatus },
    { label: '예약 취소', value: 'CANCELED' as ReservationStatus }
  ]

  return (
    <div className="space-y-4">
      {/* 예약 날짜 범위 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          서비스 날짜
        </label>
        <ReservationDateRangeCalendar
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      {/* 예약 상태 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          예약 상태
        </label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(option => (
            <button
              key={option.label}
              onClick={() =>
                handleStatusClick(option.value as ReservationStatus | '')
              }
              className={`rounded-full border px-3 py-1 text-sm ${
                option.value === ''
                  ? selectedStatuses.length === 0
                    ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  : selectedStatuses.includes(option.value as ReservationStatus)
                    ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 매니저명 검색 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          매니저명
        </label>
        <input
          type="text"
          value={managerName}
          onChange={e => setManagerName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          placeholder="매니저명을 입력하세요"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {/* 검색/초기화 버튼 */}
      <div className="flex gap-2">
        <ResetButton
          onClick={handleReset}
          className="flex-1"
        />
        <SearchButton
          onClick={handleSearch}
          className="flex-1"
        />
      </div>
    </div>
  )
}

export default ReservationSearchFilter
