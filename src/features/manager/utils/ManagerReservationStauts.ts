export const ReservationStatusMap = {
  /**
   * 노란색: REQUESTED(예약 요청), CONFIRMED(예약완료)
   * bgColor: "bg-amber-100",
   * textColor: "text-amber-800"
   */
  REQUESTED: {
    label: '예약 요청',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800'
  },
  CONFIRMED: {
    label: '예약 완료',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800'
  },
  /**
   * 하늘색: IN_PROGRESS(서비스 진행 중)
   * bgColor: "bg-sky-100"
   * textColor: "text-sky-800"
   */
  IN_PROGRESS: {
    label: '서비스 진행 중',
    bgColor: 'bg-sky-100',
    textColor: 'text-sky-800'
  },
  /**
   * 초록색: IN_PROGRESS(서비스 진행 중)
   * bgColor: "bg-sky-100"
   * textColor: "text-sky-800"
   */
  COMPLETED: {
    label: '방문 완료',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  /**
   * 빨간색: PRE_CANCELED(예약 확정 전 취소), CANCELED(예약 취소), REFUND_PROCESSING(환불 진행중), REFUND_COMPLETED(환불 완료), REFUND_REJECTED(환불 거절)
   * bgColor: "bg-rose-100",
   * textColor: "text-rose-800",
   */
  PRE_CANCELED: {
    label: '예약 확정 전 취소',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-800'
  },
  CANCELED: {
    label: '예약 취소',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-800'
  },
  REFUND_PROCESSING: {
    label: '환불 진행중',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-800'
  },
  REFUND_COMPLETED: {
    label: '환불 완료',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-800'
  },
  REFUND_REJECTED: {
    label: '환불 거절',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-800'
  },
  /**
   * 회색: REJECTED(예약 거절), DEFAULT(그 외)
   * bgColor: "bg-gray-100",
   * textColor: "text-gray-800",
   */
  REJECTED: {
    label: '예약 거절',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  DEFAULT: {
    label: '알 수 없음',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  }
} as const

export type ReservationStatus = keyof typeof ReservationStatusMap

export const getReservationStatusStyle = (status: string) => {
  return (
    ReservationStatusMap[status as ReservationStatus] ??
    ReservationStatusMap.DEFAULT
  )
}
