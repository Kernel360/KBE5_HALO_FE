interface AccountStatusBadgeProps {
  status: string;
  className?: string;
}

const accountStatusMap: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "활성", color: "bg-emerald-50 text-emerald-500" },
  SUSPENDED: { label: "비활성", color: "bg-red-50 text-red-500" },
  REPORTED: { label: "신고됨", color: "bg-yellow-50 text-yellow-600" },
  DELETED: { label: "탈퇴", color: "bg-red-50 text-red-500" },
  // 필요시 추가
};

const AccountStatusBadge = ({ status, className = "" }: AccountStatusBadgeProps) => {
  const { label, color } = accountStatusMap[status] || { label: status, color: "bg-gray-100 text-gray-500" };
  return (
    <div className={`px-2 py-0.5 rounded-xl text-xs font-medium inline-block ${color} ${className}`}>{label}</div>
  );
};

export default AccountStatusBadge; 