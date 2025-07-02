import React from "react";
import type { AdminManagerDetail } from "@/features/admin/types/AdminManagerType";

interface ManagerDetailInfoProps {
  manager: AdminManagerDetail;
  weekDays: { label: string; key: string }[];
  groupedTimes: Record<string, string[]>;
}

const ManagerDetailInfo: React.FC<ManagerDetailInfoProps> = ({ manager, weekDays, groupedTimes }) => {
  return (
    <div className="w-full p-8 bg-white rounded-xl shadow flex flex-col gap-6">
      <div className="text-slate-800 text-lg font-semibold">상세 정보</div>
      <div className="flex flex-col gap-2">
        <div className="text-slate-500 text-base font-medium">주소</div>
        <div className="p-4 bg-slate-50 rounded-lg flex flex-col gap-1">
          <div className="text-slate-700 text-sm font-medium">주소: {manager.roadAddress}</div>
          <div className="text-slate-700 text-sm font-medium">상세주소: {manager.detailAddress}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-slate-500 text-base font-medium">업무 가능 지역</div>
        <div className="p-4 bg-slate-50 rounded-lg flex flex-col">
          <div className="text-slate-700 text-sm font-medium">서울시 강남구, 서초구, 송파구</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-slate-500 text-base font-medium">업무 가능 시간</div>
        <div className="p-4 bg-slate-50 rounded-lg flex flex-col gap-2">
          {weekDays.map(({ label, key }) => {
            const times = groupedTimes[key];
            const displayText = times?.length ? times.join(', ') : '휴무';
            return (
              <div key={key} className="inline-flex justify-start items-center">
                <div className="w-28 text-slate-700 text-sm font-medium">{label}</div>
                <div className="flex-1 text-slate-700 text-sm font-medium">{displayText}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-slate-500 text-base font-medium">첨부파일</div>
        <div className="h-11 relative bg-gray-50 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center pl-4 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4m-8 0h8m-8 0v14a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7m-8 0h8" />
          </svg>
          <div className="text-gray-900 text-sm font-normal">{manager.fileId ?? '-'}</div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDetailInfo; 