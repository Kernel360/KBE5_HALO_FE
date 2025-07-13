import React, { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface ReservationDateCalendarProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

const ReservationDateCalendar: React.FC<ReservationDateCalendarProps> = ({
  selectedDate,
  onDateChange
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(
    selectedDate ? new Date(selectedDate + "T00:00:00") : null
  )
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInternalSelectedDate(selectedDate ? new Date(selectedDate + "T00:00:00") : null)
  }, [selectedDate])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
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
    // 내일부터 3개월 후까지만 선택 가능
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const threeMonthsLater = new Date()
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
    threeMonthsLater.setHours(23, 59, 59, 999)
    
    if (date < tomorrow || date > threeMonthsLater) return

    setInternalSelectedDate(date)
    onDateChange(formatDate(date))
    setIsOpen(false)
  }

  const handleClear = () => {
    setInternalSelectedDate(null)
    onDateChange("")
    setIsOpen(false)
  }

  const isDateSelected = (date: Date): boolean => {
    if (!internalSelectedDate) return false
    return date.getTime() === internalSelectedDate.getTime()
  }

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isSelectableDate = (date: Date): boolean => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const threeMonthsLater = new Date()
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
    threeMonthsLater.setHours(23, 59, 59, 999)
    
    return date >= tomorrow && date <= threeMonthsLater
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"]

  return (
    <div className="relative" ref={calendarRef}>
      <div
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:border-gray-400"
        onClick={() => setIsOpen(!isOpen)}>
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-gray-700">
          {internalSelectedDate
            ? formatDisplayDate(internalSelectedDate)
            : "예약 날짜 선택"}
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
              const isSelected = isDateSelected(date)
              const isCurrentMonthDate = isCurrentMonth(date)
              const isSelectable = isSelectableDate(date)

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={!isSelectable}
                  className={`rounded-lg p-2 text-sm transition-colors ${!isCurrentMonthDate ? "text-gray-300" : ""} ${!isSelectable ? "cursor-not-allowed text-gray-400" : ""} ${isCurrentMonthDate && isSelectable ? "text-gray-700" : ""} ${isSelected && isSelectable ? "bg-[#6366F1] text-white" : ""} ${isCurrentMonthDate && !isSelected && isSelectable ? "hover:bg-gray-100" : ""} `}>
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* 안내 텍스트 */}
          <div className="mt-4 text-center text-xs text-gray-500">
            내일부터 3개월 후까지 선택 가능합니다
          </div>

          {/* 버튼 */}
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
        </div>
      )}
    </div>
  )
}

export default ReservationDateCalendar