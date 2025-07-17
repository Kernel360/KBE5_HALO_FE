import React from 'react'
import type { ManagerReservationDetail } from '@/features/manager/types/ManagerReservationType'

interface ReservationCheckInOutBannerProps {
  reservation: Pick<
    ManagerReservationDetail,
    'inTime' | 'outTime' | 'userName' | 'serviceName' | 'requestDate'
  >
  onCheckIn: () => void
  onCheckOut: () => void
}

const ReservationCheckInOutBanner: React.FC<
  ReservationCheckInOutBannerProps
> = ({ reservation, onCheckIn, onCheckOut }) => {
  const isCheckedIn = !!reservation.inTime
  const isCheckedOut = !!reservation.outTime

  return (
    <div className="mb-2 flex w-full items-center gap-1 rounded-2xl border-2 border-indigo-300 bg-white px-2 py-1 shadow-sm">
      <svg
        className="h-4 w-4 text-indigo-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-xs font-bold text-indigo-700">체크인/체크아웃</span>
      <span className="ml-1 text-xs text-gray-500">
        <b className="text-gray-900">고객명</b>: {reservation.userName}
        {' | '}
        <b className="text-gray-900">서비스</b>: {reservation.serviceName}
      </span>
      <div className="ml-auto flex gap-1">
        {!isCheckedIn && (
          <button
            className="rounded bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
            onClick={onCheckIn}>
            체크인
          </button>
        )}
        {isCheckedIn && !isCheckedOut && (
          <button
            className="rounded bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
            onClick={onCheckOut}>
            체크아웃
          </button>
        )}
        {isCheckedIn && isCheckedOut && (
          <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-500">
            완료
          </span>
        )}
      </div>
    </div>
  )
}

export default ReservationCheckInOutBanner
