import React, { useState } from "react";
import WarningToast from "@/shared/components/ui/toast/WarningToast";

export const NoticeSection = () => {
  const [warningOpen, setWarningOpen] = useState(false);
  const handleClick = () => {
    setWarningOpen(true);
  };
  return (
    <>
      <div
        className="bg-white rounded-xl p-4 md:p-8 lg:p-12 shadow flex flex-col gap-6 min-h-[180px] md:min-h-[220px] lg:min-h-[260px] cursor-pointer select-none"
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label="공지사항 서비스 준비 중"
      >
        <div className="text-lg md:text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400" />
          공지사항
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-1 shadow-sm">
            <span className="font-semibold text-slate-700 text-base md:text-lg">[필독] 서비스 이용 가이드라인 안내</span>
            <span className="text-xs md:text-sm text-slate-500 mt-1">2023-05-01</span>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-1 shadow-sm">
            <span className="font-semibold text-slate-700 text-base md:text-lg">5월 휴무일 안내</span>
            <span className="text-xs md:text-sm text-slate-500 mt-1">2023-04-28</span>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-1 shadow-sm">
            <span className="font-semibold text-slate-700 text-base md:text-lg">서비스 품질 향상 설문조사 안내</span>
            <span className="text-xs md:text-sm text-slate-500 mt-1">2023-04-15</span>
          </div>
        </div>
      </div>
      <WarningToast open={warningOpen} message="서비스 준비 중입니다." onClose={() => setWarningOpen(false)} />
    </>
  );
}; 