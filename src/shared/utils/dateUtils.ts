// src/utils/dateUtils.ts

/**
 * 날짜 문자열을 받아서 'YYYY-MM-DD' 형식의 문자열로 반환
 */
export const getFormattedDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 시간 문자열과 소요시간을 받아서 '07:00~11:00' 형식의 문자열로 반환
 */
export const formatTimeRange = (startTime: string, turnaround: number): string => {
  const [hour, minute] = startTime.split(':');
  const formattedStartTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  const endHour = (parseInt(hour) + turnaround).toString().padStart(2, '0');
  const formattedEndTime = `${endHour}:${minute.padStart(2, '0')}`;
  return `${formattedStartTime}~${formattedEndTime}`;
};

/**
 * 날짜 문자열을 받아서 'YYYY-MM-DD (요일)' 형식의 문자열로 반환
 */
export const formatDateWithDay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const formattedDate = getFormattedDate(date);
  const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'short' });
  return `${formattedDate} (${dayOfWeek})`;
};