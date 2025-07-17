// src/utils/dateUtils.ts

/**
 * 날짜 문자열을 받아서 'YYYY-MM-DD' 형식의 문자열로 반환
 */
export const getFormattedDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 시간 문자열과 소요시간을 받아서 '07:00~11:00' 형식의 문자열로 반환
 */
export const formatTimeRange = (
  startTime: string,
  turnaround: number
): string => {
  const [hour, minute] = startTime.split(':')
  const formattedStartTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
  const endHour = (parseInt(hour) + turnaround).toString().padStart(2, '0')
  const formattedEndTime = `${endHour}:${minute.padStart(2, '0')}`
  return `${formattedStartTime}~${formattedEndTime}`
}

/**
 * 날짜 문자열을 받아서 'YYYY-MM-DD (요일)' 형식의 문자열로 반환
 */
export const formatDateWithDay = (dateStr: string): string => {
  const date = new Date(dateStr)
  const formattedDate = getFormattedDate(date)
  const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'short' })
  return `${formattedDate} (${dayOfWeek})`
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const formatDateToKorean = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const isSameMonth = startDate.getMonth() === endDate.getMonth()
  const isSameYear = startDate.getFullYear() === endDate.getFullYear()

  if (isSameYear && isSameMonth) {
    return `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일~${endDate.getDate()}일`
  } else if (isSameYear) {
    return `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일~${endDate.getMonth() + 1}월 ${endDate.getDate()}일`
  } else {
    return `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일~${endDate.getFullYear()}년 ${endDate.getMonth() + 1}월 ${endDate.getDate()}일`
  }
}

export const getDateRangePreset = (
  preset: string
): { start: string; end: string } => {
  const today = new Date()
  const startOfWeek = new Date(today)
  const endOfWeek = new Date(today)
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  // 이번 주 (월요일 시작)
  const dayOfWeek = today.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  startOfWeek.setDate(today.getDate() + mondayOffset)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  // 지난 주
  const lastWeekStart = new Date(startOfWeek)
  const lastWeekEnd = new Date(endOfWeek)
  lastWeekStart.setDate(startOfWeek.getDate() - 7)
  lastWeekEnd.setDate(endOfWeek.getDate() - 7)

  // 지난 달
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

  switch (preset) {
    case 'today':
      return { start: formatDate(today), end: formatDate(today) }
    case 'thisWeek':
      return { start: formatDate(startOfWeek), end: formatDate(endOfWeek) }
    case 'thisMonth':
      return { start: formatDate(startOfMonth), end: formatDate(endOfMonth) }
    case 'lastWeek':
      return { start: formatDate(lastWeekStart), end: formatDate(lastWeekEnd) }
    case 'lastMonth':
      return { start: formatDate(lastMonth), end: formatDate(lastMonthEnd) }
    case 'last7Days':
      const last7Days = new Date(today)
      last7Days.setDate(today.getDate() - 6)
      return { start: formatDate(last7Days), end: formatDate(today) }
    case 'last30Days':
      const last30Days = new Date(today)
      last30Days.setDate(today.getDate() - 29)
      return { start: formatDate(last30Days), end: formatDate(today) }
    case 'all':
      return { start: '', end: '' }
    default:
      return { start: '', end: '' }
  }
}

export const getDateRangeLabel = (preset: string): string => {
  switch (preset) {
    case 'today':
      return '오늘'
    case 'thisWeek':
      return '이번 주'
    case 'thisMonth':
      return '이번 달'
    case 'lastWeek':
      return '지난 주'
    case 'lastMonth':
      return '지난 달'
    case 'last7Days':
      return '최근 7일'
    case 'last30Days':
      return '최근 30일'
    case 'all':
      return '전체'
    default:
      return '전체'
  }
}

export const getDateRangeDisplayText = (
  startDate: string,
  endDate: string
): string => {
  if (!startDate || !endDate) {
    return '전체'
  }

  const start = new Date(startDate)
  const end = new Date(startDate)

  if (startDate === endDate) {
    return formatDateToKorean(start)
  }

  return formatDateRange(start, end)
}

// 기존 함수들 유지...
export const formatDateToYearMonth = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const formatDateToMonthDay = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export const formatDateToKoreanShort = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateToKoreanFull = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

export const isToday = (date: Date): boolean => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

export const getRelativeTimeString = (date: Date): string => {
  if (isToday(date)) {
    return '오늘'
  } else if (isYesterday(date)) {
    return '어제'
  } else {
    return formatDateToKoreanShort(date)
  }
}

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export const startOfWeek = (date: Date): Date => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? -6 : 1) // 월요일을 시작으로
  result.setDate(diff)
  return result
}

export const endOfWeek = (date: Date): Date => {
  const result = startOfWeek(date)
  result.setDate(result.getDate() + 6)
  return result
}

export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

export const isSameYear = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear()
}

export const parseDate = (dateString: string): Date => {
  // YYYY-MM-DD → local date
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  // fallback for other formats (e.g., with time)
  return new Date(dateString)
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateTime = (date: Date): string => {
  return `${formatDateToKorean(date)} ${formatTime(date)}`
}

export const formatDateTimeKoreanFull = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  return `${year}년 ${month}월 ${day}일\n${hour}시 ${minute}분 ${second}초`
}
