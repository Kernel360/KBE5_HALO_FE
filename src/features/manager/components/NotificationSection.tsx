import React from "react";

export const NotificationSection = () => {
  return (
    <div className="bg-white rounded-xl p-4 md:p-8 lg:p-12 shadow flex flex-col gap-6 min-h-[120px] md:min-h-[160px] lg:min-h-[200px]">
      <div className="text-lg md:text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400" />
        예약 요청
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <span className="font-semibold text-slate-700 text-base md:text-lg">예약 확정 필요</span>
          <span className="bg-red-100 text-red-600 text-xs md:text-sm font-bold px-3 py-1 rounded-full">미처리</span>
        </div>
      </div>
    </div>
  );
}; 