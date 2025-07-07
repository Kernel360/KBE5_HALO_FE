export const ReservationStatusMap = {
  /**
   * 노란색: REQUESTED(예약 요청)
   * bgColor: "bg-amber-200",
   * textColor: "text-amber-900"
   */
  REQUESTED: {
    label: "예약 요청",
    bgColor: "bg-amber-200",
    textColor: "text-amber-900",
  },
  /**
   * 초록색: CONFIRMED(예약 완료), COMPLETED(방문 완료)
   * bgColor: "bg-sky-200",
   * textColor: "text-sky-900"
   */
  CONFIRMED: {
    label: "예약 완료",
    bgColor: "bg-sky-200",
    textColor: "text-sky-900",
  },
  COMPLETED: {
    label: "방문 완료",
    bgColor: "bg-green-200",
    textColor: "text-green-900",
  },
  /**
   * 파란색: IN_PROGRESS(서비스 진행 중)
   * bgColor: "bg-blue-200"
   * textColor: "text-blue-900"
   */
  IN_PROGRESS: {
    label: "서비스 진행 중",
    bgColor: "bg-blue-200",
    textColor: "text-blue-900",
  },
  /**
   * 빨간색: PRE_CANCELED(예약 확정 전 취소), CANCELED(예약 취소), REJECTED(예약 거절), REFUND_PROCESSING(환불 진행중), REFUND_COMPLETED(환불 완료), REFUND_REJECTED(환불 거절)
   * bgColor: "bg-rose-200",
   * textColor: "text-rose-900",
   */
  PRE_CANCELED: {
    label: "예약 확정 전 취소",
    bgColor: "bg-rose-200",
    textColor: "text-rose-900",
  },
  CANCELED: {
    label: "예약 취소",
    bgColor: "bg-rose-200",
    textColor: "text-rose-900",
  },
  REJECTED: {
    label: "예약 거절",
    bgColor: "bg-rose-200",
    textColor: "text-rose-900",
  },
  REFUND_PROCESSING: {
    label: "환불 진행중",
    bgColor: "bg-rose-200",
    textColor: "text-rose-900",
  },
  REFUND_COMPLETED: {
    label: "환불 완료",
    bgColor: "bg-rose-200",
    textColor: "text-rose-900",
  },
  REFUND_REJECTED: {
    label: "환불 거절",
    bgColor: "bg-rose-200",
    textColor: "text-rose-900",
  },
  /**
   * 회색: DEFAULT(그 외)
   * bgColor: "bg-gray-100",
   * textColor: "text-gray-900",
   */
  DEFAULT: {
    label: "알 수 없음",
    bgColor: "bg-gray-100",
    textColor: "text-gray-900",
  },
} as const;

export type ReservationStatus = keyof typeof ReservationStatusMap;

export const getReservationStatusStyle = (status: string) => {
  return (
    ReservationStatusMap[status as ReservationStatus] ??
    ReservationStatusMap.DEFAULT
  );
};
