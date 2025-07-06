import React from "react";

export const RecentReviewsSection = () => {
  return (
    <div className="bg-white rounded-xl p-4 md:p-8 lg:p-12 shadow flex flex-col gap-6 min-h-[220px] md:min-h-[260px] lg:min-h-[300px]">
      <div className="text-lg md:text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400" />
        최근 리뷰
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 text-base md:text-lg">김철수</span>
            <span className="text-yellow-400 text-base md:text-lg">★★★★☆</span>
          </div>
          <div className="text-sm md:text-base text-slate-700">청소가 꼼꼼하게 잘 되어있어요. 다음에도 같은 매니저님 부탁드립니다.</div>
          <div className="text-xs md:text-sm text-slate-500 mt-1">2023.05.10</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 text-base md:text-lg">이영희</span>
            <span className="text-yellow-400 text-base md:text-lg">★★★★★</span>
          </div>
          <div className="text-sm md:text-base text-slate-700">시간 약속을 잘 지키시고 친절하게 응대해주셔서 좋았습니다.</div>
          <div className="text-xs md:text-sm text-slate-500 mt-1">2023.05.08</div>
        </div>
      </div>
    </div>
  );
}; 