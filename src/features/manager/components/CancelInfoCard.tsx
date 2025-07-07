export function CancelInfoCard({ reservation }: { reservation: any }) {
  if (reservation.status !== "CANCELED") return null;
  return (
    <div className="flex flex-col items-start gap-4 self-stretch rounded-xl bg-red-50 p-8 border border-red-200 shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11H9v4a1 1 0 002 0V7zm0 6H9v2h2v-2z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-red-700">예약이 취소되었습니다</h2>
      </div>
      <div className="text-base text-red-800">
        <div className="mb-1">
          <span className="font-medium">취소 일시:</span> {reservation.cancelDate || "-"}
        </div>
        <div className="mb-1">
          <span className="font-medium">취소 사유:</span> {reservation.cancelReason || "-"}
        </div>
        <div>
          <span className="font-medium">취소자:</span> {reservation.canceledByName} ({reservation.canceledByRole === "MANAGER" ? "매니저" : "고객"})
        </div>
      </div>
    </div>
  );
} 