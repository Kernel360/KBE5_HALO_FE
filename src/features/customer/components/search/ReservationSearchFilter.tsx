import React, { useState } from "react"
import type { ReservationStatus } from "@/features/customer/types/CustomerReservationType"

interface ReservationSearchFilterProps {
  onStatusChange: (status: ReservationStatus | "") => void
}

const ReservationSearchFilter: React.FC<ReservationSearchFilterProps> = ({
  onStatusChange
}) => {
  const [status, setStatus] = useState<ReservationStatus | "">("")

  const handleStatusClick = (selectedStatus: ReservationStatus | "") => {
    setStatus(selectedStatus)
    onStatusChange(selectedStatus)
  }

  const statusOptions = [
    { label: "전체", value: "" },
    { label: "예약 요청", value: "REQUESTED" },
    { label: "예약 완료", value: "CONFIRMED" },
    { label: "서비스 진행 중", value: "IN_PROGRESS" },
    { label: "방문 완료", value: "COMPLETED" },
    { label: "예약 취소", value: "CANCELED" }
  ] as const

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          예약 상태
        </label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(option => (
            <button
              key={option.label}
              onClick={() => handleStatusClick(option.value)}
              className={`rounded-full border px-3 py-1 text-sm ${
                status === option.value
                  ? "border-indigo-500 bg-indigo-100 text-indigo-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReservationSearchFilter
