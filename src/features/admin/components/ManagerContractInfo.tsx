import React from "react";
import StatusBadge from "./StatusBadge";
import type { AdminManagerDetail } from "@/features/admin/types/AdminManagerType";

interface ManagerContractInfoProps {
  manager: AdminManagerDetail;
  onApprove: () => void;
  onReject: () => void;
  onTerminateApprove: () => void;
}

const ManagerContractInfo: React.FC<ManagerContractInfoProps> = ({ manager, onApprove, onReject, onTerminateApprove }) => {
  return (
    <div className="w-full p-8 bg-white rounded-xl shadow flex flex-col gap-4">
      <div className="text-slate-800 text-lg font-semibold">계약 정보</div>
      <div className="inline-flex justify-start items-center gap-2">
        <div className="w-40 text-slate-500 text-sm font-medium">계약 시작일</div>
        <div className="flex-1 text-slate-700 text-sm font-medium">{manager.contractAt || '-'}</div>
      </div>
      <div className="inline-flex justify-start items-center gap-2">
        <div className="w-40 text-slate-500 text-sm font-medium">계약 상태</div>
        <div className="h-7 px-3 flex justify-center items-center">
          <StatusBadge status={manager.status} />
        </div>
      </div>
      {manager.status === 'TERMINATED' && manager.terminatedAt && manager.terminationReason && (
        <>
          <div className="inline-flex justify-start items-center gap-2">
            <div className="w-40 text-slate-500 text-sm font-medium">계약 해지일</div>
            <div className="flex-1 text-slate-700 text-sm font-medium">{manager.terminatedAt}</div>
          </div>
          <div className="inline-flex justify-start items-center gap-2">
            <div className="w-40 text-slate-500 text-sm font-medium">계약 해지 사유</div>
            <div className="flex-1 text-slate-700 text-sm font-medium">{manager.terminationReason}</div>
          </div>
        </>
      )}
      {manager.status === 'PENDING' && (
        <div className="flex gap-2 mt-4 justify-end">
          <button
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded bg-white hover:bg-indigo-600 hover:text-white transition-colors"
            onClick={onApprove}
          >
            승인
          </button>
          <button
            className="px-4 py-2 border border-red-500 text-red-500 rounded bg-white hover:bg-red-500 hover:text-white transition-colors"
            onClick={onReject}
          >
            거절
          </button>
        </div>
      )}
      {manager.status === 'TERMINATION_PENDING' && (
        <div className="flex gap-2 mt-4 justify-end">
          <button
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded bg-white hover:bg-indigo-600 hover:text-white transition-colors"
            onClick={onTerminateApprove}
          >
            계약해지 승인
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerContractInfo; 