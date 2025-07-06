import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchManagerReservations } from "@/features/manager/api/managerReservation";
import type { ManagerReservationSummary as ManagerReservationType } from "@/features/manager/types/ManagerReservationType";

export const NotificationSection = () => {
  const navigate = useNavigate();
  const [requestedList, setRequestedList] = useState<ManagerReservationType[]>([]);
  const [requestedCount, setRequestedCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchManagerReservations({
      reservationStatus: "REQUESTED",
      page: 0,
      size: 3,
    })
      .then((data) => {
        setRequestedList(data.content || []);
        setRequestedCount(data.page?.totalElements ?? 0);
      })
      .catch(() => {
        setError("예약 요청 내역을 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 md:p-8 lg:p-12 shadow flex flex-col gap-6 min-h-[120px] md:min-h-[160px] lg:min-h-[200px]">
      <button
        type="button"
        className="text-lg md:text-xl font-bold text-slate-800 mb-2 flex items-center gap-2 hover:underline focus:outline-none"
        onClick={() => navigate("/managers/reservations?status=REQUESTED")}
      >
        <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400" />
        예약 요청
      </button>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-slate-400 text-center py-8">불러오는 중...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : requestedList.length === 0 ? (
          <div className="text-slate-400 text-center py-8">예약 요청 내역이 없습니다.</div>
        ) : (
          <>
            {requestedList.map((r) => (
              <div
                key={r.reservationId}
                className="bg-slate-50 rounded-lg p-4 flex flex-col gap-1 shadow-sm cursor-pointer hover:bg-slate-100 transition"
                onClick={() => navigate(`/managers/reservations/${r.reservationId}`)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 text-base md:text-lg">
                    {r.customerName}
                  </span>
                  <span className="text-xs text-slate-500">{r.serviceName}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {r.requestDate} | {r.customerAddress}
                </div>
              </div>
            ))}
            {requestedCount && requestedCount > 3 && (
              <button
                className="mt-2 text-indigo-600 text-sm font-semibold hover:underline focus:outline-none"
                onClick={() => navigate("/managers/reservations?status=REQUESTED")}
              >
                더보기
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 