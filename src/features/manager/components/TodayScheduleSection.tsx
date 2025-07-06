import React from "react";

const weekStats = [
  { day: "월", count: 2 },
  { day: "화", count: 1 },
  { day: "수", count: 0 },
  { day: "목", count: 3 },
  { day: "금", count: 2 },
  { day: "토", count: 0 },
  { day: "일", count: 0 },
];
const maxCount = Math.max(...weekStats.map((d) => d.count), 1);

export const TodayScheduleSection = () => {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 lg:p-12 shadow flex flex-col gap-8 w-full h-full flex-1 overflow-hidden min-h-[320px] md:min-h-[380px] lg:min-h-[420px]">
      {/* 주간 스케줄 통계 */}
      <div>
        <div className="text-base md:text-lg lg:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400" />
          주간 스케줄 통계
        </div>
        <div className="flex items-end gap-3 md:gap-8 min-h-[100px] md:min-h-[160px] lg:min-h-[200px] py-4 md:py-6 px-2 md:px-6">
          {weekStats.map((stat) => (
            <div key={stat.day} className="flex flex-col items-center group">
              {/* 예약 건수 */}
              <span className={`mb-1 text-xs md:text-sm font-semibold ${stat.count > 0 ? "text-indigo-600" : "text-slate-300"}`}>{stat.count}</span>
              {/* 막대그래프 */}
              <div
                className={`w-6 md:w-10 lg:w-12 rounded-t-lg transition-all duration-200 group-hover:scale-110 ${stat.count > 0 ? "bg-gradient-to-t from-indigo-400 to-indigo-200 shadow-md" : "bg-slate-100"}`}
                style={{ height: `${(stat.count / maxCount) * 80 + 12}px` }}
              ></div>
              {/* 요일 */}
              <span className="mt-2 text-xs md:text-sm text-slate-500 font-medium">{stat.day}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 구분선 */}
      <div className="border-t border-slate-200 my-2" />
      {/* 오늘의 예약 */}
      <div>
        <div className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400" />
          오늘의 예약
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center p-4 md:p-6 bg-slate-50 rounded-lg shadow-sm">
            <div>
              <div className="font-semibold text-slate-700 text-base md:text-lg">홍길동 고객 방문 청소</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">09:00 - 12:00 | 서울시 강남구</div>
            </div>
            <button className="bg-indigo-100 text-indigo-600 px-5 py-2 md:px-8 md:py-3 rounded font-semibold hover:bg-indigo-200 transition text-sm md:text-base">체크인</button>
          </div>
          <div className="flex justify-between items-center p-4 md:p-6 bg-slate-50 rounded-lg shadow-sm">
            <div>
              <div className="font-semibold text-slate-700 text-base md:text-lg">김철수 고객 방문 청소</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">14:00 - 17:00 | 서울시 서초구</div>
            </div>
            <button className="bg-slate-100 text-slate-500 px-5 py-2 md:px-8 md:py-3 rounded font-semibold hover:bg-slate-200 transition text-sm md:text-base">체크인</button>
          </div>
        </div>
      </div>
    </div>
  );
}; 