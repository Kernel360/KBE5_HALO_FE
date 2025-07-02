import React from "react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "활성", color: "bg-emerald-50 text-emerald-500" },
  PENDING: { label: "승인대기", color: "bg-yellow-50 text-yellow-600" },
  APPROVED: { label: "승인완료", color: "bg-emerald-50 text-emerald-500" },
  REJECTED: { label: "승인거절", color: "bg-red-50 text-red-500" },
  TERMINATION_PENDING: { label: "계약해지대기", color: "bg-yellow-50 text-yellow-600" },
  TERMINATED: { label: "계약해지", color: "bg-red-50 text-red-500" },
  SUSPENDED: { label: "정지", color: "bg-red-50 text-red-500" },
  DELETED: { label: "탈퇴", color: "bg-red-50 text-red-500" },
  EXPIRED: { label: "만료", color: "bg-gray-100 text-gray-500" },
  PENDING_APPROVAL: { label: "승인대기", color: "bg-yellow-50 text-yellow-600" },
  // 필요시 추가
};

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const { label, color } = statusMap[status] || { label: status, color: "bg-gray-100 text-gray-500" };
  return (
    <div className={`px-2 py-0.5 rounded-xl text-xs font-medium inline-block ${color} ${className}`}>{label}</div>
  );
};

export default StatusBadge; 