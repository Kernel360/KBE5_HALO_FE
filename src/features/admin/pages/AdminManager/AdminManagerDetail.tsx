import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAdminManagerById, approveManager, rejectManager, approveTerminateManager } from "@/features/admin/api/adminManager";
import type { AdminManagerDetail as AdminManagerDetailType } from "@/features/admin/types/AdminManagerType";
import { AlertModal } from '@/shared/components/ui/modal';
import ManagerProfileCard from '@/features/admin/components/ManagerProfileCard';
import ManagerDetailInfo from '@/features/admin/components/ManagerDetailInfo';
import ManagerContractInfo from '@/features/admin/components/ManagerContractInfo';

export const AdminManagerDetail = () => {
  const { managerId } = useParams<{ managerId: string }>();
  const [manager, setManager] = useState<AdminManagerDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const weekDays = [
    { label: "월요일", key: "MONDAY" },
    { label: "화요일", key: "TUESDAY" },
    { label: "수요일", key: "WEDNESDAY" },
    { label: "목요일", key: "THURSDAY" },
    { label: "금요일", key: "FRIDAY" },
    { label: "토요일", key: "SATURDAY" },
    { label: "일요일", key: "SUNDAY" },
  ];

  const groupedTimes = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (!manager || !manager.availableTimes) return map;
    for (const { dayOfWeek, time } of manager.availableTimes) {
      if (!map[dayOfWeek]) map[dayOfWeek] = [];
      map[dayOfWeek].push(time.slice(0, 5));
    }
    for (const key in map) {
      map[key].sort();
    }
    return map;
  }, [manager]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAdminManagerById(managerId!);
        setManager(res || null);
        if (!res) setError('매니저 정보를 찾을 수 없습니다.');
      } catch (err: any) {
        const backendMsg = err?.response?.data?.message;
        setError(backendMsg || '매니저 정보 조회 실패');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [managerId]);

  if (loading) return <div className="p-8">로딩 중...</div>;
  if (error) {
    return (
      <AlertModal
        open={true}
        message={error}
        onClose={() => navigate('/admin/managers')}
        confirmLabel="목록으로"
      />
    );
  }
  if (!manager) return null;

  // 승인/거절 핸들러
  const handleApprove = async () => {
    if (!manager) return;
    try {
      await approveManager(manager.managerId);
      alert('승인되었습니다.');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || '승인 실패');
    }
  };
  const handleReject = async () => {
    if (!manager) return;
    try {
      await rejectManager(manager.managerId);
      alert('거절되었습니다.');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || '거절 실패');
    }
  };
  // 계약해지대기 승인 핸들러
  const handleTerminateApprove = async () => {
    if (!manager) return;
    try {
      await approveTerminateManager(manager.managerId);
      alert('계약해지 승인되었습니다.');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || '계약해지 승인 실패');
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
        <div className="text-gray-900 text-xl font-bold">매니저 상세 정보</div>
      </div>
      <div className="w-full flex-1 p-6 flex flex-col gap-6 max-w-4xl mx-auto px-4">
        <div className="w-full p-8 bg-white rounded-xl shadow flex gap-8">
          <ManagerProfileCard manager={manager} />
          <div className="w-40 h-40 bg-slate-100 rounded-full flex justify-center items-center">
            <div className="text-slate-400 text-5xl font-bold">{manager.userName?.[0] || '?'}</div>
          </div>
        </div>
        <ManagerDetailInfo manager={manager} weekDays={weekDays} groupedTimes={groupedTimes} />
        <ManagerContractInfo 
          manager={manager}
          onApprove={handleApprove}
          onReject={handleReject}
          onTerminateApprove={handleTerminateApprove}
        />
      </div>
    </div>
  );
};

export default AdminManagerDetail;