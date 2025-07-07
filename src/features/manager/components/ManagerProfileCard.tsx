import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { ContractStatusBadge } from "@/shared/components/ui/ContractStatusBadge";
import DetailField from "@/shared/components/ui/DetailField";

interface ManagerProfileCardProps {
  userName: string;
  status: string;
  statusName?: string;
  bio?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  genderName?: string;
}

const ManagerProfileCard: React.FC<ManagerProfileCardProps> = ({
  userName,
  status,
  statusName,
  bio,
  email,
  phone,
  birthDate,
  genderName,
}) => {
  return (
    <Card className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
      <div className="flex flex-col items-center justify-center w-40 min-w-[10rem]">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-indigo-100 mb-2">
          <span className="text-5xl font-bold text-indigo-400">
            {userName?.charAt(0) || "?"}
          </span>
        </div>
        <ContractStatusBadge status={status} className="mt-2" />
        {statusName && (
          <div className="text-xs text-slate-500 mt-1">{statusName}</div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-2">
          <div className="text-2xl font-bold text-slate-800">{userName}</div>
          {bio && (
            <div className="text-base text-slate-500 mt-1 md:mt-0">{bio}</div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <DetailField label="이메일" value={email} />
          <DetailField label="연락처" value={phone} />
          <DetailField label="생년월일" value={birthDate} />
          <DetailField label="성별" value={genderName} />
        </div>
      </div>
    </Card>
  );
};

export default ManagerProfileCard; 