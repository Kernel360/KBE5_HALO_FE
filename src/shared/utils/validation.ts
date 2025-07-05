/**
 * 연락처 유효성 검사 (010-1234-5678 형식)
 * @param phone 연락처
 * @returns 유효하면 true, 아니면 false
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^010-\d{4}-\d{4}$/
  return phoneRegex.test(phone)
}

/**
 * 비밀번호 유효성 검사 (8~20자, 대/소문자/숫자/특수문자 중 3가지 이상 포함)
 * @param password 비밀번호
 * @returns 유효하면 true, 아니면 false
 */
export const isValidPassword = (password: string): boolean => {
  const lengthValid = password.length >= 8 && password.length <= 20

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const fulfilledTypes = [
    hasUppercase,
    hasLowercase,
    hasDigit,
    hasSpecialChar
  ].filter(Boolean).length

  return lengthValid && fulfilledTypes >= 3
}

/**
 * 이메일 유효성 검사
 * @param email 이메일
 * @returns 유효하면 true, 아니면 false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 문자열 길이 유효성 검사
 * @param value 검사할 문자열
 * @param min 최소 글자 수 (기본값: 0)
 * @param max 최대 글자 수 (기본값: 무제한)
 * @returns 유효하면 true, 아니면 false
 */
export const isValidLength = (
  value: string,
  min: number = 0,
  max: number = Infinity
): boolean => {
  const length = value.trim().length
  return length >= min && length <= max
}

/**
 * 날짜 유효성 검사
 * @param start 시작일
 * @param end 종료일
 * @returns 유효하면 true, 아니면 false
 */
export const isValidDateRange = (start: string, end: string): boolean => {
  if (!start || !end) return true // 둘 중 하나라도 비어있으면 검사는 패스
  return new Date(start) <= new Date(end)
}
