import React, { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  BellAlertIcon,
  StarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";
import { searchManagerReservations } from "@/features/manager/api/managerReservation";
import { useNavigate } from "react-router-dom";

function getThisWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export const KPISection = () => {
  const navigate = useNavigate();
  const [weekCount, setWeekCount] = useState<number | null>(null);
  const [weekLoading, setWeekLoading] = useState(false);
  const [weekError, setWeekError] = useState<string | null>(null);

  const [requestedCount, setRequestedCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 이번 주 예약 수
    setWeekLoading(true);
    setWeekError(null);
    const weekDates = getThisWeekDates().map((d) => d.toISOString().slice(0, 10));
    searchManagerReservations({
      fromRequestDate: weekDates[0],
      toRequestDate: weekDates[6],
      reservationStatus: "IN_PROGRESS,CONFIRMED,COMPLETED",
      page: 0,
      size: 1,
    })
      .then((data) => {
        setWeekCount(data.page?.totalElements ?? 0);
      })
      .catch(() => {
        setWeekError("-");
      })
      .finally(() => setWeekLoading(false));
    // 예약 요청 수
    setLoading(true);
    setError(null);
    searchManagerReservations({
      reservationStatus: "REQUESTED",
      page: 0,
      size: 1,
    })
      .then((data) => {
        setRequestedCount(data.page?.totalElements ?? 0);
      })
      .catch(() => {
        setError("-");
      })
      .finally(() => setLoading(false));
  }, []);

  // 클릭 시 이동 함수
  const handleWeekCardClick = () => {
    const weekDates = getThisWeekDates().map((d) => d.toISOString().slice(0, 10));
    navigate(
      `/managers/reservations?fromRequestDate=${weekDates[0]}&toRequestDate=${weekDates[6]}&status=IN_PROGRESS,CONFIRMED,COMPLETED`
    );
  };
  const handleRequestedCardClick = () => {
    navigate(`/managers/reservations?status=REQUESTED`);
  };

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 이번 주 예약 */}
      <button
        type="button"
        className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2 items-start border border-slate-100 transition hover:shadow-md focus:outline-none"
        onClick={handleWeekCardClick}
      >
        <div className="flex items-center gap-2 mb-1">
          <CalendarDaysIcon className="w-6 h-6 text-indigo-500" />
          <span className="text-base font-semibold text-slate-700">
            이번 주 예약
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-indigo-700">
            {weekLoading ? "..." : weekError ? weekError : `${weekCount ?? 0}`}
          </span>
          <span className="flex items-center text-green-600 text-sm font-semibold">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-0.5" />
            +12%
          </span>
        </div>
        <span className="text-xs text-slate-400 mt-1">전체 예약 수</span>
      </button>
      {/* 예약 요청 */}
      <button
        type="button"
        className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2 items-start border border-slate-100 transition hover:shadow-md focus:outline-none"
        onClick={handleRequestedCardClick}
      >
        <div className="flex items-center gap-2 mb-1">
          <BellAlertIcon className="w-6 h-6 text-rose-500" />
          <span className="text-base font-semibold text-slate-700">
            예약 요청
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-rose-600">
            {loading ? "..." : error ? error : `${requestedCount ?? 0}`}
          </span>
          <span className="flex items-center text-green-600 text-sm font-semibold">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-0.5" />
            +1
          </span>
        </div>
        <span className="text-xs text-slate-400 mt-1">확정 대기</span>
      </button>
      {/* 평균 평점 */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2 items-start border border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <StarIcon className="w-6 h-6 text-yellow-400" />
          <span className="text-base font-semibold text-slate-700">
            평균 평점
          </span>
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
          <span className="text-base font-semibold text-slate-700">
            예상 정산
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-emerald-600">
            ₩1,200,000
          </span>
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