import React from "react";
import { CalendarDaysIcon, BellAlertIcon, StarIcon, BanknotesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

export const KPISection = () => {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 이번 달 예약 */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2 items-start border border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDaysIcon className="w-6 h-6 text-indigo-500" />
          <span className="text-base font-semibold text-slate-700">이번 달 예약</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-indigo-700">24</span>
          <span className="flex items-center text-green-600 text-sm font-semibold">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-0.5" />
            +12%
          </span>
        </div>
        <span className="text-xs text-slate-400 mt-1">전체 예약 수</span>
      </div>
      {/* 예약 요청 */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2 items-start border border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <BellAlertIcon className="w-6 h-6 text-rose-500" />
          <span className="text-base font-semibold text-slate-700">예약 요청</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-rose-600">3</span>
          <span className="flex items-center text-green-600 text-sm font-semibold">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-0.5" />
            +1
          </span>
        </div>
        <span className="text-xs text-slate-400 mt-1">확정 대기</span>
      </div>
      {/* 평균 평점 */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2 items-start border border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <StarIcon className="w-6 h-6 text-yellow-400" />
          <span className="text-base font-semibold text-slate-700">평균 평점</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-yellow-500">4.8</span>
          <span className="flex items-center text-red-500 text-sm font-semibold">
            <ArrowTrendingDownIcon className="w-4 h-4 mr-0.5" />
            -0.1
          </span>
        </div>
        <span className="text-xs text-slate-400 mt-1">최근 30일</span>
      </div>
      {/* 매출 */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2 items-start border border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <BanknotesIcon className="w-6 h-6 text-emerald-500" />
          <span className="text-base font-semibold text-slate-700">예상 정산</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-emerald-600">₩1,200,000</span>
          <span className="flex items-center text-green-600 text-sm font-semibold">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-0.5" />
            +8%
          </span>
        </div>
        <span className="text-xs text-slate-400 mt-1">이번 주 정산</span>
      </div>
    </div>
  );
}; 