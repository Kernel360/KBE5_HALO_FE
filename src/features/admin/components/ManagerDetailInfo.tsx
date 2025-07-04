import React from "react";
import type { AdminManagerDetail } from "@/features/admin/types/AdminManagerType";
import ManagerAvailableTimeClock from "./ManagerAvailableTimeClock";
import ManagerAddressMap from "./ManagerAddressMap";

interface ManagerDetailInfoProps {
  manager: AdminManagerDetail;
  weekDays: { label: string; key: string }[];
  groupedTimes: Record<string, string[]>;
}

const ManagerDetailInfo: React.FC<ManagerDetailInfoProps> = ({
  manager,
  weekDays,
  groupedTimes,
}) => {
  return (
    <div className="w-full p-8 bg-white rounded-xl shadow flex flex-col gap-6">
      <div className="text-slate-800 text-lg font-semibold">상세 정보</div>
      <div className="flex flex-col gap-2">
        <div className="text-slate-500 text-base font-medium">
          주소 및 서비스 지역
        </div>
        <div className="p-4 bg-slate-50 rounded-lg flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-slate-700 text-sm font-medium">
              주소: {manager.roadAddress}
            </div>
            <div className="text-slate-700 text-sm font-medium">
              상세주소: {manager.detailAddress}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-slate-600 text-sm font-medium">
                서비스 가능 지역
              </span>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <div className="text-indigo-700 text-sm font-medium mb-1">
                위 주소 기준 반경 5km 이내
              </div>
              <div className="text-indigo-600 text-xs">
                매니저가 직접 방문하여 서비스를 제공할 수 있는 지역입니다.
              </div>
            </div>
            <ManagerAddressMap
              address={manager.roadAddress}
              detailAddress={manager.detailAddress}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-slate-500 text-base font-medium">
          업무 가능 시간
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <ManagerAvailableTimeClock
            weekDays={weekDays}
            groupedTimes={groupedTimes}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-slate-500 text-base font-medium">첨부파일</div>
        <div className="h-11 relative bg-gray-50 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center pl-4 gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 7V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4m-8 0h8m-8 0v14a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7m-8 0h8"
            />
          </svg>
          <div className="text-gray-900 text-sm font-normal">
            {manager.fileId ?? "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDetailInfo;
