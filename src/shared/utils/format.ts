/**
 * 01012345678 → 010-1234-5678 형식으로 변환
 */
export const formatPhoneNumber = (value: string): string => {
  const rawValue = value.replace(/[^0-9]/g, '')

  if (rawValue.length < 4) {
    return rawValue
  } else if (rawValue.length < 8) {
    return `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`
  } else {
    return `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`
  }
}

/**
 * 시작 시간과 소요시간 입력 시 아래와 같이 표시
 * 12:00 ~ 15:00 (총 3시간)
 */
export const formatTimeRange = (
  startTime: string | null,
  duration: number | null
): string => {
  // null 값 체크
  if (!startTime || duration === null || duration === undefined) {
    return '-'
  }

  const [hour, minute] = startTime.split(':').map(Number)

  const pad = (n: number) => n.toString().padStart(2, '0')

  const startHour = hour
  const endHour = (hour + duration) % 24 // 24시 넘어가면 0부터 다시

  return `${pad(startHour)}:${pad(minute)} ~ ${pad(endHour)}:${pad(minute)} (총 ${duration}시간)`
}
