import React, { useEffect, useState } from "react";
import { searchManagerReservations } from "@/features/manager/api/managerReservation";
import { useNavigate } from "react-router-dom";
import type { ManagerReservationSummary as ManagerReservationType } from "@/features/manager/types/ManagerReservationType";
import { formatTimeRange } from "@/shared/utils/format";

// 이번주 월~일 날짜 배열 생성
function getThisWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0(일)~6(토)
  // 월요일 기준(한국): 일요일(0) → -6, 월(1) → 0, ... 토(6) → -5
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

export const TodayScheduleSection = () => {
  const [todayReservations, setTodayReservations] = useState<ManagerReservationType[]>([]);
  const [weekStats, setWeekStats] = useState<{ day: string; count: number }[]>([]);
  const [weekReservations, setWeekReservations] = useState<ManagerReservationType[]>([]);
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(null);
  const [animatingIdx, setAnimatingIdx] = useState<number | null>(null); // 현재 애니메이션 중인 인덱스
  const [animationType, setAnimationType] = useState<"down" | "up" | null>(null); // 애니메이션 방향
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 오늘 날짜
  const today = new Date().toISOString().slice(0, 10);
  // 이번주 월~일 날짜 (YYYY-MM-DD)
  const weekDates = getThisWeekDates().map((d) => d.toISOString().slice(0, 10));

  useEffect(() => {
    setLoading(true);
    setError(null);
    // 1. 오늘 예약
    searchManagerReservations({
      fromRequestDate: today,
      toRequestDate: today,
      reservationStatus: "CONFIRMED",
      page: 0,
      size: 100,
    })
      .then((data) => {
        setTodayReservations(data.content || []);
      })
      .catch((err) => {
        setError(err.message || "예약 데이터를 불러오지 못했습니다.");
      });
    // 2. 이번주 예약 통계 + 전체 목록
    searchManagerReservations({
      fromRequestDate: weekDates[0],
      toRequestDate: weekDates[6],
      reservationStatus: "CONFIRMED,COMPLETED,IN_PROGRESS",
      page: 0,
      size: 200,
    })
      .then((data) => {
        const reservations: ManagerReservationType[] = data.content || [];
        setWeekReservations(reservations);
        // 요일별 예약 건수 집계
        const counts = Array(7).fill(0);
        reservations.forEach((r) => {
          const reqDate = r.requestDate;
          const idx = weekDates.findIndex(
            (d) => reqDate && reqDate.startsWith(d),
          );
          if (idx >= 0) counts[idx]++;
        });
        setWeekStats(weekDays.map((day, i) => ({ day, count: counts[i] })));
      })
      .catch(() => {
        setWeekStats(weekDays.map((day) => ({ day, count: 0 })));
        setWeekReservations([]);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [today]);

  const maxCount = Math.max(...weekStats.map((d) => d.count), 1);

  // 확장된 요일의 예약 목록 필터링
  const expandedReservations =
    expandedDayIdx !== null
      ? weekReservations.filter(
          (r) =>
            r.requestDate &&
            r.requestDate.startsWith(weekDates[expandedDayIdx]),
        )
      : [];

  // 확장/축소 핸들러
  const handleExpandDay = (idx: number) => {
    if (expandedDayIdx === idx) {
      // 축소: slide-up 적용 후 언마운트
      setAnimationType("up");
      setAnimatingIdx(idx);
      setTimeout(() => {
        setExpandedDayIdx(null);
        setAnimatingIdx(null);
        setAnimationType(null);
      }, 300); // slide-up duration과 맞춤
    } else {
      // 확장: 바로 slide-down
      setExpandedDayIdx(idx);
      setAnimatingIdx(idx);
      setAnimationType("down");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 lg:p-12 shadow flex flex-col gap-8 w-full h-full flex-1 overflow-hidden min-h-[320px] md:min-h-[380px] lg:min-h-[420px]">
      {/* 주간 스케줄 통계 */}
      <div>
        <div className="text-base md:text-lg lg:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400" />
          주간 스케줄 통계
        </div>
        <div className="flex items-end gap-3 md:gap-8 min-h-[100px] md:min-h-[160px] lg:min-h-[200px] py-4 md:py-6 px-2 md:px-6">
          {weekStats.map((stat, i) => (
            <div key={stat.day} className="flex flex-col items-center group">
              {/* 예약 건수 */}
              <span
                className={`mb-1 text-xs md:text-sm font-semibold ${
                  stat.count > 0 ? "text-indigo-600" : "text-slate-300"
                }`}
              >
                {stat.count}
              </span>
              {/* 막대그래프 (클릭 가능) */}
              <div
                className={`w-6 md:w-10 lg:w-12 rounded-t-lg transition-all duration-200 group-hover:scale-110 cursor-pointer ${
                  stat.count > 0
                    ? "bg-gradient-to-t from-indigo-400 to-indigo-200 shadow-md"
                    : "bg-slate-100"
                } ${expandedDayIdx === i ? "ring-2 ring-indigo-400" : ""}`}
                style={{ height: `${(stat.count / maxCount) * 80 + 12}px` }}
                onClick={() => handleExpandDay(i)}
                title={`${stat.day}요일 예약 보기`}
              ></div>
              {/* 요일 */}
              <span className="mt-2 text-xs md:text-sm text-slate-500 font-medium">
                {stat.day}
              </span>
            </div>
          ))}
        </div>
        {/* 확장 영역 */}
        <div style={{ minHeight: 0 }}>
          {(expandedDayIdx !== null || (animatingIdx !== null && animationType === "up")) && (
            <div
              className={`w-full bg-slate-50 rounded-lg shadow-inner mt-4 p-4 flex flex-col gap-2 min-h-[64px] ${
                animationType === "up" ? "slide-up" : "slide-down"
              }`}
              key={animatingIdx ?? expandedDayIdx}
            >
              {(animatingIdx !== null ? weekReservations.filter((r) => r.requestDate && r.requestDate.startsWith(weekDates[animatingIdx])) : []).length === 0 &&
              (animationType === "up" || (expandedDayIdx !== null && expandedReservations.length === 0)) ? (
                <div className="text-slate-400 text-center py-4">
                  예약이 없습니다. 오늘은 여유로운 하루입니다!
                </div>
              ) : (
                (animatingIdx !== null
                  ? weekReservations.filter((r) => r.requestDate && r.requestDate.startsWith(weekDates[animatingIdx]))
                  : expandedReservations
                ).map((reservation) => (
                  <div
                    key={reservation.reservationId}
                    className="flex justify-between items-center p-3 md:p-4 bg-white rounded shadow-sm cursor-pointer hover:bg-indigo-50 transition"
                    onClick={() =>
                      navigate(`/managers/reservations/${reservation.reservationId}`)
                    }
                  >
                    <div>
                      <div className="font-semibold text-slate-700 text-base md:text-lg">
                        {reservation.customerName} {reservation.serviceName}
                      </div>
                      <div className="text-xs md:text-sm text-slate-500 mt-1">
                        {reservation.startTime && reservation.turnaround
                          ? formatTimeRange(reservation.startTime, reservation.turnaround)
                          : reservation.startTime}
                        {" | "}
                        {reservation.customerAddress}
                      </div>
                    </div>
                    <span className="text-xs md:text-sm text-slate-400 font-medium">
                      상세보기
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-slate-200 my-2" />
      {/* 오늘의 예약 */}
      <div>
        <button
          type="button"
          className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2 hover:underline focus:outline-none"
          onClick={() =>
            navigate(
              `/managers/reservations?date=${new Date().toISOString().slice(0, 10)}`
            )
          }
        >
          <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400" />
          오늘의 예약
        </button>
        {loading ? (
          <div className="text-slate-400 text-center py-8">불러오는 중...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : todayReservations.length === 0 ? (
          <div className="text-slate-400 text-center py-8">
            오늘의 예약이 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todayReservations.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="flex justify-between items-center p-4 md:p-6 bg-slate-50 rounded-lg shadow-sm cursor-pointer hover:bg-indigo-50 transition"
                onClick={() =>
                  navigate(
                    `/managers/reservations/${reservation.reservationId}`
                  )
                }
              >
                <div>
                  <div className="font-semibold text-slate-700 text-base md:text-lg">
                    {reservation.customerName} {reservation.serviceName}
                  </div>
                  <div className="text-xs md:text-sm text-slate-500 mt-1">
                    {reservation.startTime && reservation.turnaround
                      ? formatTimeRange(reservation.startTime, reservation.turnaround)
                      : reservation.startTime}
                    {" | "}
                    {reservation.customerAddress}
                  </div>
                </div>
                <button
                  className="bg-indigo-100 text-indigo-600 px-5 py-2 md:px-8 md:py-3 rounded font-semibold hover:bg-indigo-200 transition text-sm md:text-base"
                  onClick={(e) => {
                    e.stopPropagation(); /* prevent parent click */
                  }}
                >
                  체크인
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 