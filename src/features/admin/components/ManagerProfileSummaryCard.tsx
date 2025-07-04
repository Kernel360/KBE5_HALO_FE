import Card from "@/shared/components/ui/Card";
import React from "react";

interface KPI {
  label: string;
  value: string | number;
}

interface ManagerProfileSummaryCardProps {
  userName: string;
  bio: string;
  kpiList: KPI[];
}

const ManagerProfileSummaryCard: React.FC<ManagerProfileSummaryCardProps> = ({
  userName,
  bio,
  kpiList,
}) => (
  <Card className="w-full p-8 flex gap-8 items-center shadow-lg border border-gray-200 bg-white">
    <div className="w-40 h-40 bg-slate-100 rounded-full flex justify-center items-center">
      <div className="text-slate-400 text-5xl font-bold">
        {userName?.[0] || "?"}
      </div>
    </div>
    <div className="flex-1 flex flex-col gap-2">
      <div className="text-xl font-bold mb-2">프로필 요약</div>
      <div className="border-b border-gray-100 mb-4"></div>
      <div className="text-2xl font-bold text-slate-800">{userName}</div>
      <div className="text-base text-slate-500 mb-2">{bio}</div>
      <div className="flex gap-4 mt-2">
        {kpiList.map((kpi) => (
          <div
            key={kpi.label}
            className="flex flex-col items-center bg-slate-50 rounded-lg px-4 py-2 min-w-[90px]"
          >
            <div className="text-lg font-bold text-indigo-600">{kpi.value}</div>
            <div className="text-xs text-slate-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export default ManagerProfileSummaryCard;
