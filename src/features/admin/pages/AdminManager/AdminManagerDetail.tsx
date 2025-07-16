import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAdminManagerById,
  approveManager,
  rejectManager,
  approveTerminateManager,
} from "@/features/admin/api/adminManager";
import type { AdminManagerDetail as AdminManagerDetailType } from "@/features/admin/types/AdminManagerType";
import { AlertModal } from "@/shared/components/ui/modal";
import ManagerDetailInfo from "@/features/admin/components/ManagerDetailInfo";
import ManagerContractInfo from "@/features/admin/components/ManagerContractInfo";
import ManagerProfileSummaryCard from "@/features/admin/components/ManagerProfileSummaryCard";
import ManagerActivityChartCard from "@/features/admin/components/ManagerActivityChartCard";
import ManagerTimelineCard from "@/features/admin/components/ManagerTimelineCard";
import ManagerRecentItemsCard from "@/features/admin/components/ManagerRecentItemsCard";
import ManagerAdminMemoCard from "@/features/admin/components/ManagerAdminMemoCard";
import Card from "@/shared/components/ui/Card";
import Loading from "@/shared/components/ui/Loading";

export const AdminManagerDetail = () => {
  const { managerId } = useParams<{ managerId: string }>();
  const [manager, setManager] = useState<AdminManagerDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminMemo, setAdminMemo] = useState("");
  const navigate = useNavigate();
  const memoRef = useRef<HTMLTextAreaElement>(null);

  const weekDays = [
    { label: "월요일", key: "MONDAY" },
    { label: "화요일", key: "TUESDAY" },
    { label: "수요일", key: "WEDNESDAY" },
    { label: "목요일", key: "THURSDAY" },
    { label: "금요일", key: "FRIDAY" },
    { label: "토요일", key: "SATURDAY" },
    { label: "일요일", key: "SUNDAY" },
  ];

  // 예시: 월별 활동 데이터 (실제 데이터 연동 전)
  const activityData = [
    { month: "2월", count: 3 },
    { month: "3월", count: 5 },
    { month: "4월", count: 2 },
    { month: "5월", count: 7 },
    { month: "6월", count: 4 },
  ];

  // 예시: 타임라인 데이터
  const timeline = [
    { date: "2024-06-01", event: "계약 승인" },
    { date: "2024-05-20", event: "가입" },
  ];

  // 예시: 최근 문의/리뷰
  const recentItems = [
    { type: "문의", content: "서비스 일정 변경 문의", date: "2024-06-02" },
    { type: "리뷰", content: "매우 친절하고 꼼꼼해요!", date: "2024-05-30" },
    { type: "문의", content: "결제 관련 문의", date: "2024-05-28" },
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
        if (!res) setError("매니저 정보를 찾을 수 없습니다.");
      } catch (err: any) {
        const backendMsg = err?.response?.data?.message;
        setError(backendMsg || "매니저 정보 조회 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [managerId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Loading message="매니저 정보를 불러오는 중..." size="lg" />
      </div>
    );
  if (error) {
    return (
      <AlertModal
        open={true}
        message={error}
        onClose={() => navigate("/admin/managers")}
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
      alert("승인되었습니다.");
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "승인 실패");
    }
  };
  const handleReject = async () => {
    if (!manager) return;
    try {
      await rejectManager(manager.managerId);
      alert("거절되었습니다.");
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "거절 실패");
    }
  };
  // 계약해지대기 승인 핸들러
  const handleTerminateApprove = async () => {
    if (!manager) return;
    try {
      await approveTerminateManager(manager.managerId);
      alert("계약해지 승인되었습니다.");
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "계약해지 승인 실패");
    }
  };

  // KPI 카드용 데이터
  const kpiList = [
    { label: "누적 서비스", value: manager.reservationCount ?? "-" },
    {
      label: "평균 평점",
      value:
        manager.averageRating != null
          ? Number(manager.averageRating).toFixed(1)
          : "-",
    },
    { label: "리뷰 수", value: manager.reviewCount ?? "-" },
    { label: "계약 상태", value: manager.status },
  ];

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
        <div className="text-gray-900 text-xl font-bold">매니저 상세 정보</div>
      </div>
      <div className="w-full flex-1 p-8 flex flex-col gap-8 max-w-7xl mx-auto">
        {/* 상단 2단 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ManagerProfileSummaryCard
            userName={manager.userName}
            bio={manager.bio}
            kpiList={kpiList}
          />
          <ManagerActivityChartCard activityData={activityData} />
        </div>
        {/* 중단 2단 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ManagerTimelineCard timeline={timeline} />
          <ManagerRecentItemsCard recentItems={recentItems} />
        </div>
        {/* 하단 단일(세로) */}
        <ManagerAdminMemoCard
          adminMemo={adminMemo}
          setAdminMemo={setAdminMemo}
          memoRef={memoRef}
        />
        <Card className="w-full">
          <ManagerDetailInfo
            manager={manager}
            weekDays={weekDays}
            groupedTimes={groupedTimes}
          />
        </Card>
        <Card className="w-full">
          <ManagerContractInfo
            manager={manager}
            onApprove={handleApprove}
            onReject={handleReject}
            onTerminateApprove={handleTerminateApprove}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminManagerDetail;
