import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface ReservationDateRangeCalendarProps {
  startDate: string
  endDate: string
  onDateRangeChange: (startDate: string, endDate: string) => void
}

const ReservationDateRangeCalendar: React.FC<ReservationDateRangeCalendarProps> = ({
  startDate,
  endDate,
  onDateRangeChange
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    startDate ? new Date(startDate + "T00:00:00") : null
  )
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    endDate ? new Date(endDate + "T00:00:00") : null
  )
  const [isSelectingStart, setIsSelectingStart] = useState(true)

  useEffect(() => {
    setSelectedStartDate(startDate ? new Date(startDate + "T00:00:00") : null)
    setSelectedEndDate(endDate ? new Date(endDate + "T00:00:00") : null)
  }, [startDate, endDate])

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
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
    // 오늘로부터 3개월 이후 날짜만 선택 불가 (과거 날짜는 모두 허용)
    const threeMonthsLater = new Date()
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
    threeMonthsLater.setHours(23, 59, 59, 999) // 3개월 후 끝까지 허용
    
    if (date > threeMonthsLater) return

    if (isSelectingStart) {
      setSelectedStartDate(date)
      setSelectedEndDate(null)
      setIsSelectingStart(false)
    } else {
      if (selectedStartDate && date < selectedStartDate) {
        setSelectedStartDate(date)
        setSelectedEndDate(selectedStartDate)
      } else {
        setSelectedEndDate(date)
      }
      setIsSelectingStart(true)

      // 종료날짜 선택 시 자동으로 적용하고 닫기
      setTimeout(() => {
        const startForApply =
          selectedStartDate && date < selectedStartDate
            ? date
            : selectedStartDate
        const endForApply =
          selectedStartDate && date < selectedStartDate
            ? selectedStartDate
            : date

        if (startForApply && endForApply) {
          onDateRangeChange(formatDate(startForApply), formatDate(endForApply))
        }
        setIsOpen(false)
      }, 100)
    }
  }

  const handleApply = () => {
    if (selectedStartDate && selectedEndDate) {
      onDateRangeChange(
        formatDate(selectedStartDate),
        formatDate(selectedEndDate)
      )
    } else if (selectedStartDate) {
      onDateRangeChange(
        formatDate(selectedStartDate),
        formatDate(selectedStartDate)
      )
    }
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedStartDate(null)
    setSelectedEndDate(null)
    onDateRangeChange("", "")
    setIsSelectingStart(true)
    setIsOpen(false)
  }

  const isDateInRange = (date: Date): boolean => {
    if (!selectedStartDate || !selectedEndDate) return false
    return date >= selectedStartDate && date <= selectedEndDate
  }

  const isDateSelected = (date: Date): boolean => {
    if (!selectedStartDate) return false
    if (selectedEndDate) {
      return (
        date.getTime() === selectedStartDate.getTime() ||
        date.getTime() === selectedEndDate.getTime()
      )
    }
    return date.getTime() === selectedStartDate.getTime()
  }

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isSelectableDate = (date: Date): boolean => {
    const threeMonthsLater = new Date()
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
    threeMonthsLater.setHours(23, 59, 59, 999)
    
    // 과거 날짜는 모두 허용, 3개월 후까지만 제한
    return date <= threeMonthsLater
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"]

  return (
    <div className="relative">
      <div
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:border-gray-400"
        onClick={() => setIsOpen(!isOpen)}>
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-gray-700">
          {selectedStartDate && selectedEndDate
            ? `${formatDisplayDate(selectedStartDate)} ~ ${formatDisplayDate(selectedEndDate)}`
            : selectedStartDate
              ? `${formatDisplayDate(selectedStartDate)} ~ 종료일 선택`
              : "예약 날짜 범위 선택"}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          {/* 헤더 */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                  )
                )
              }
              className="rounded p-1 hover:bg-gray-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="font-semibold text-gray-900">
              {currentMonth.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long"
              })}
            </h3>
            <button
              onClick={() => {
                const nextMonth = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1
                )
                const threeMonthsLater = new Date()
                threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
                
                // 3개월 후 달까지만 이동 가능
                if (nextMonth.getFullYear() <= threeMonthsLater.getFullYear() && 
                    nextMonth.getMonth() <= threeMonthsLater.getMonth()) {
                  setCurrentMonth(nextMonth)
                }
              }}
              disabled={(() => {
                const nextMonth = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1
                )
                const threeMonthsLater = new Date()
                threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
                
                return nextMonth.getFullYear() > threeMonthsLater.getFullYear() || 
                       (nextMonth.getFullYear() === threeMonthsLater.getFullYear() && 
                        nextMonth.getMonth() > threeMonthsLater.getMonth())
              })()}
              className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const isInRange = isDateInRange(date)
              const isSelected = isDateSelected(date)
              const isCurrentMonthDate = isCurrentMonth(date)
              const isSelectable = isSelectableDate(date)

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={!isSelectable}
                  className={`rounded-lg p-2 text-sm transition-colors ${!isCurrentMonthDate ? "text-gray-300" : ""} ${!isSelectable ? "cursor-not-allowed text-gray-400" : ""} ${isCurrentMonthDate && isSelectable ? "text-gray-700" : ""} ${isSelected && isSelectable ? "bg-[#6366F1] text-white" : ""} ${isInRange && !isSelected && isSelectable ? "bg-[#6366F1]/20 text-[#6366F1]" : ""} ${isCurrentMonthDate && !isSelected && !isInRange && isSelectable ? "hover:bg-gray-100" : ""} `}>
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* 안내 텍스트 */}
          <div className="mt-4 text-center text-xs text-gray-500">
            {isSelectingStart
              ? "시작 날짜를 선택하세요 (과거~3개월 후까지)"
              : "종료 날짜를 선택하세요"}
          </div>

          {/* 버튼 */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              초기화
            </button>
            <button
              onClick={handleApply}
              className="flex-1 rounded-xl bg-[#6366F1] px-4 py-2 text-sm text-white hover:bg-[#5558E3]">
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationDateRangeCalendar