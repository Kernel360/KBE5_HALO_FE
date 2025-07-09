import React from 'react'

interface ReservationRequestBannerProps {
  reservation: {
    userName: string
    serviceName: string
    requestDate: string
  }
  onAccept: () => void
  onReject: () => void
}

const ReservationRequestBanner: React.FC<ReservationRequestBannerProps> = ({
  reservation,
  onAccept,
  onReject
}) => {
  return (
    <div className="mb-4 flex w-full items-center gap-4 rounded-2xl border-2 border-yellow-400 bg-white px-6 py-3 shadow-md">
      <svg
        className="h-6 w-6 text-yellow-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-base font-bold text-yellow-700">
        예약 요청 대기
      </span>
      <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
        확인 필요
      </span>
      <span className="ml-6 text-sm text-gray-700">
        <b className="text-gray-900">고객명</b>: {reservation.userName}
        {' | '}
        <b className="text-gray-900">서비스</b>: {reservation.serviceName}
        {' | '}
        <b className="text-gray-900">요청일</b>: {reservation.requestDate}
      </span>
      <div className="ml-auto flex gap-2">
        <button
          className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
          onClick={onAccept}
        >
          예약 수락
        </button>
        <button
          className="rounded-lg bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
          onClick={onReject}
        >
          예약 거절
        </button>
      </div>
    </div>
  )
}

export default ReservationRequestBanner 