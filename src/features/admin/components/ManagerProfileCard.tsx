import React from "react";
import { ContractStatusBadge } from "@/shared/components/ui/ContractStatusBadge";
import type { AdminManagerDetail } from "@/features/admin/types/AdminManagerType";

interface ManagerProfileCardProps {
  manager: AdminManagerDetail;
}

const ManagerProfileCard: React.FC<ManagerProfileCardProps> = ({ manager }) => {
  return (
    <div className="flex-1 flex flex-col gap-6 pl-15">
      <div className="flex flex-col gap-4">
        <div className="text-slate-800 text-2xl font-bold">
          {manager.userName}
        </div>
        <div className="text-slate-500 text-base">{manager.bio}</div>
        <div className="text-slate-700 text-base font-medium flex items-center gap-2">
          계약 상태: <ContractStatusBadge status={manager.status} />
        </div>
        <div className="text-slate-700 text-base font-medium">
          평점:{" "}
          {manager.averageRating != null
            ? Number(manager.averageRating).toFixed(1)
            : "-"}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-6">
        <div className="inline-flex justify-start items-center gap-2">
          <div className="w-28 text-slate-500 text-sm font-medium">이메일</div>
          <div className="flex-1 text-slate-700 text-sm font-medium">
            {manager.email}
          </div>
        </div>
        <div className="inline-flex justify-start items-center gap-2">
          <div className="w-28 text-slate-500 text-sm font-medium">연락처</div>
          <div className="flex-1 text-slate-700 text-sm font-medium">
            {manager.phone}
          </div>
        </div>
        <div className="inline-flex justify-start items-center gap-2">
          <div className="w-28 text-slate-500 text-sm font-medium">
            생년월일
          </div>
          <div className="flex-1 text-slate-700 text-sm font-medium">
            {manager.birthDate}
          </div>
        </div>
        <div className="inline-flex justify-start items-center gap-2">
          <div className="w-28 text-slate-500 text-sm font-medium">성별</div>
          <div className="flex-1 text-slate-700 text-sm font-medium">
            {manager.gender === "MALE"
              ? "남"
              : manager.gender === "FEMALE"
                ? "여"
                : "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfileCard;
