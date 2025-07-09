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
    <div className="mb-4 flex w-full items-center gap-4 overflow-x-auto rounded-2xl border-2 border-yellow-400 bg-white px-6 py-3 whitespace-nowrap shadow-md">
      <svg
        className="h-6 w-6 flex-shrink-0 text-yellow-500"
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
      <span className="flex-shrink-0 text-base font-bold text-yellow-700">예약 요청 대기</span>
      {/* md 이상에서만 확인 필요, 정보 노출 */}
      <span className="hidden flex-shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700 md:inline">
        확인 필요
      </span>
      <span className="ml-2 hidden flex-shrink-0 text-xs text-gray-500 md:inline">
        <b className="text-gray-900">고객명</b>: {reservation.userName}
        <span className="hidden md:inline">{' | '}</span>
        <b className="text-gray-900 hidden md:inline">서비스</b>
        <span className="hidden md:inline">: {reservation.serviceName}</span>
        <span className="hidden lg:inline">{' | '}</span>
        <b className="text-gray-900 hidden lg:inline">요청일</b>
        <span className="hidden lg:inline">: {reservation.requestDate}</span>
      </span>
      <div className="ml-auto flex flex-shrink-0 gap-2">
        <button
          className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700 sm:text-sm"
          onClick={onAccept}
        >
          예약 수락
        </button>
        <button
          className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600 sm:text-sm"
          onClick={onReject}
        >
          예약 거절
        </button>
      </div>
    </div>
  )
}

export default ReservationRequestBanner 