import type { ManagerReservationSummary as ManagerReservationType } from "../types/ManagerReservationType";
import { getReservationStatusStyle } from "../utils/ManagerReservationStauts";
import { StatusBadge } from "../../../shared/components";

interface ManagerReservationListMobileProps {
  reservations: ManagerReservationType[];
  onClickItem: (reservationId: number) => void;
}

const ManagerReservationListMobile = ({
  reservations,
  onClickItem,
}: ManagerReservationListMobileProps) => {
  if (!reservations.length) {
    return (
      <div className="py-20 text-center text-slate-400">
        조회된 예약이 없습니다.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {reservations.map((r) => {
        const statusInfo = getReservationStatusStyle(r.status);
        return (
          <div
            key={r.reservationId}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm cursor-pointer transition hover:shadow-md"
            onClick={() => onClickItem(r.reservationId)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-400 font-medium">
                예약ID #{r.reservationId}
              </div>
              <div
                className={`inline-flex items-center rounded-full px-3 h-7 text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.textColor}`}
              >
                {statusInfo.label}
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <div className="text-base font-semibold text-slate-800">
                {r.customerName}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {r.customerAddress}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs text-slate-600 bg-slate-50 rounded px-2 py-0.5">
                {r.serviceName}
              </span>
              <span className="text-xs text-slate-600 bg-slate-50 rounded px-2 py-0.5">
                {r.requestDate}
              </span>
              {r.startTime && r.turnaround && (
                <span className="text-xs text-slate-600 bg-slate-50 rounded px-2 py-0.5">
                  {r.startTime}~{r.turnaround}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge
                value={r.isCheckedIn}
                trueText="체크인 완료"
                falseText="체크인 대기"
              />
              <StatusBadge
                value={r.isCheckedOut}
                trueText="체크아웃 완료"
                falseText="체크아웃 대기"
              />
              <StatusBadge
                value={r.isReviewed}
                trueText="리뷰 완료"
                falseText="리뷰 대기"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManagerReservationListMobile; 