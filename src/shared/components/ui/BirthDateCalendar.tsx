import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface BirthDateCalendarProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

const BirthDateCalendar: React.FC<BirthDateCalendarProps> = ({
  selectedDate,
  onDateChange
}) => {
  // 만 15세가 되는 날짜 계산 (오늘로부터 15년 전)
  const getMaxBirthDate = (): Date => {
    const today = new Date()
    const maxDate = new Date(
      today.getFullYear() - 15,
      today.getMonth(),
      today.getDate()
    )
    return maxDate
  }

  // 기본값으로 선택 가능한 최신 날짜 (만 15세가 되는 날짜) 설정
  const getDefaultDate = () => {
    if (selectedDate) {
      return new Date(selectedDate + 'T00:00:00')
    }
    // 선택된 날짜가 없으면 선택 가능한 최신 날짜 반환
    return getMaxBirthDate()
  }

  const [currentMonth, setCurrentMonth] = useState(() => {
    const defaultDate = getDefaultDate()
    return new Date(defaultDate.getFullYear(), defaultDate.getMonth())
  })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | null>(
    getDefaultDate()
  )
  const [isYearMonthSelector, setIsYearMonthSelector] = useState(false)
  const [tempYear, setTempYear] = useState(new Date().getFullYear())
  const [tempMonth, setTempMonth] = useState(new Date().getMonth())
  const calendarRef = useRef<HTMLDivElement>(null)

  // 최소 생년월일 (예: 100세까지)
  const getMinBirthDate = (): Date => {
    const today = new Date()
    const minDate = new Date(today.getFullYear() - 100, 0, 1)
    return minDate
  }

  useEffect(() => {
    if (selectedDate) {
      setSelectedBirthDate(new Date(selectedDate + 'T00:00:00'))
    } else {
      // 기본값으로 선택 가능한 최신 날짜 설정
      const defaultDate = getMaxBirthDate()
      setSelectedBirthDate(defaultDate)
      // 부모 컴포넌트에 기본값 전달
      onDateChange(formatDate(defaultDate))
      // 달력도 해당 년월로 이동
      setCurrentMonth(
        new Date(defaultDate.getFullYear(), defaultDate.getMonth())
      )
    }
  }, [selectedDate, onDateChange])

  // 달력 밖 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setIsYearMonthSelector(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Date[] = []

    // 이전 달의 마지막 날들
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i))
    }

    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    // 다음 달의 첫 날들
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day))
    }

    return days
  }

  const handleDateClick = (date: Date) => {
    const maxBirthDate = getMaxBirthDate()
    const minBirthDate = getMinBirthDate()

    // 만 18세 이하이거나 100세 이상인 경우 선택 불가
    if (date > maxBirthDate || date < minBirthDate) return

    setSelectedBirthDate(date)
    onDateChange(formatDate(date))
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedBirthDate(null)
    onDateChange('')
    setIsOpen(false)
  }

  const isDateSelected = (date: Date): boolean => {
    if (!selectedBirthDate) return false
    return date.getTime() === selectedBirthDate.getTime()
  }

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isSelectableDate = (date: Date): boolean => {
    const maxBirthDate = getMaxBirthDate()
    const minBirthDate = getMinBirthDate()

    return date <= maxBirthDate && date >= minBirthDate
  }

  const canGoToPreviousMonth = (): boolean => {
    const minBirthDate = getMinBirthDate()
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    )
    return (
      prevMonth >= new Date(minBirthDate.getFullYear(), minBirthDate.getMonth())
    )
  }

  const canGoToNextMonth = (): boolean => {
    const maxBirthDate = getMaxBirthDate()
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    )
    return (
      nextMonth <= new Date(maxBirthDate.getFullYear(), maxBirthDate.getMonth())
    )
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  // 년도 선택 옵션 생성
  const getYearOptions = () => {
    const minYear = getMinBirthDate().getFullYear()
    const maxYear = getMaxBirthDate().getFullYear()
    const years = []
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year)
    }
    return years
  }

  // 월 선택 옵션 생성
  const getMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: `${i + 1}월`
    }))
  }

  // 년월 선택 적용
  const handleYearMonthSelect = () => {
    const newDate = new Date(tempYear, tempMonth)
    const minBirthDate = getMinBirthDate()
    const maxBirthDate = getMaxBirthDate()

    // 선택된 년월이 유효한 범위인지 확인
    if (
      newDate >=
        new Date(minBirthDate.getFullYear(), minBirthDate.getMonth()) &&
      newDate <= new Date(maxBirthDate.getFullYear(), maxBirthDate.getMonth())
    ) {
      setCurrentMonth(newDate)
    }
    setIsYearMonthSelector(false)
  }

  // 년월 선택 취소
  const handleYearMonthCancel = () => {
    setTempYear(currentMonth.getFullYear())
    setTempMonth(currentMonth.getMonth())
    setIsYearMonthSelector(false)
  }

  // 년월 선택 모드 열기
  const openYearMonthSelector = () => {
    setTempYear(currentMonth.getFullYear())
    setTempMonth(currentMonth.getMonth())
    setIsYearMonthSelector(true)
  }

  return (
    <div
      className="relative"
      ref={calendarRef}>
      <div
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-3 text-sm hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        onClick={() => setIsOpen(!isOpen)}>
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-gray-700">
          {selectedBirthDate
            ? formatDisplayDate(selectedBirthDate)
            : '생년월일 선택'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          {/* 헤더 */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => {
                const newMonth = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1
                )
                const minBirthDate = getMinBirthDate()
                const minAllowedMonth = new Date(
                  minBirthDate.getFullYear(),
                  minBirthDate.getMonth()
                )

                // 최소 허용 월보다 이전으로 가려고 하면 최소 허용 월로 설정
                if (newMonth < minAllowedMonth) {
                  setCurrentMonth(minAllowedMonth)
                } else {
                  setCurrentMonth(newMonth)
                }
              }}
              disabled={!canGoToPreviousMonth()}
              className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3
              className="cursor-pointer font-semibold text-gray-900 transition-colors hover:text-indigo-600"
              onClick={openYearMonthSelector}>
              {currentMonth.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long'
              })}
            </h3>
            <button
              onClick={() => {
                const newMonth = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1
                )
                const maxBirthDate = getMaxBirthDate()
                const maxAllowedMonth = new Date(
                  maxBirthDate.getFullYear(),
                  maxBirthDate.getMonth()
                )

                // 최대 허용 월보다 이후로 가려고 하면 최대 허용 월로 설정
                if (newMonth > maxAllowedMonth) {
                  setCurrentMonth(maxAllowedMonth)
                } else {
                  setCurrentMonth(newMonth)
                }
              }}
              disabled={!canGoToNextMonth()}
              className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* 년월 선택 모달 */}
          {isYearMonthSelector && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 text-center text-sm font-medium text-gray-700">
                년도와 월을 선택하세요
              </div>
              <div className="mb-4 flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-gray-600">
                    년도
                  </label>
                  <select
                    value={tempYear}
                    onChange={e => setTempYear(Number(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                    {getYearOptions().map(year => (
                      <option
                        key={year}
                        value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-gray-600">월</label>
                  <select
                    value={tempMonth}
                    onChange={e => setTempMonth(Number(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                    {getMonthOptions().map(month => (
                      <option
                        key={month.value}
                        value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleYearMonthCancel}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  취소
                </button>
                <button
                  onClick={handleYearMonthSelect}
                  className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700">
                  적용
                </button>
              </div>
            </div>
          )}
          {/* 요일 헤더 */}
          {!isYearMonthSelector && (
            <div className="mb-2 grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
          )}

          {/* 날짜 그리드 */}
          {!isYearMonthSelector && (
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                const isSelected = isDateSelected(date)
                const isCurrentMonthDate = isCurrentMonth(date)
                const isSelectable = isSelectableDate(date)

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    disabled={!isSelectable}
                    className={`rounded-lg p-2 text-sm transition-colors ${
                      !isCurrentMonthDate ? 'text-gray-300' : ''
                    } ${
                      !isSelectable ? 'cursor-not-allowed text-gray-400' : ''
                    } ${
                      isCurrentMonthDate && isSelectable ? 'text-gray-700' : ''
                    } ${
                      isSelected && isSelectable
                        ? 'bg-[#6366F1] text-white'
                        : ''
                    } ${
                      isCurrentMonthDate && !isSelected && isSelectable
                        ? 'hover:bg-gray-100'
                        : ''
                    } `}>
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          )}

          {/* 안내 텍스트 */}
          {!isYearMonthSelector && (
            <div className="mt-4 text-center text-xs text-gray-500">
              만 15세 이상, 100세 이하만 가입가능합니다.
            </div>
          )}

          {/* 버튼 */}
          {!isYearMonthSelector && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleClear}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                초기화
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl bg-[#6366F1] px-4 py-2 text-sm text-white hover:bg-[#5558E3]">
                확인
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BirthDateCalendar
