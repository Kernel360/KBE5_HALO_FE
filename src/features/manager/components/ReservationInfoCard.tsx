import { getReservationStatusStyle } from "@/features/manager/utils/ManagerReservationStauts";

export function ReservationInfoCard({ reservation }: { reservation: any }) {
  const statusInfo = getReservationStatusStyle(reservation.status);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-800">예약 정보</h2>
            <p className="text-sm text-slate-500">예약 번호: #{reservation.reservationId}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`inline-flex h-8 items-center justify-center rounded-full px-4 ${statusInfo.bgColor} w-fit`}>
            <span className={`text-sm font-medium ${statusInfo.textColor}`}>{statusInfo.label}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-slate-600">예약 일시</span>
          </div>
          <p className="text-lg font-semibold text-slate-800">{reservation.requestDate}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-slate-600">예약 시간</span>
          </div>
          <p className="text-lg font-semibold text-slate-800">
            {reservation.startTime && reservation.turnaround
              ? reservation.startTime + ' / ' + reservation.turnaround + '시간'
              : '-'}
          </p>
        </div>
      </div>
    </div>
  );
} 