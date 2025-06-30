import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fetchAdminManagerById, approveManager, rejectManager, approveTerminateManager } from "@/features/admin/api/adminManager";
import type { AdminManagerDetail as AdminManagerDetailType } from "@/features/admin/types/AdminManagerType";

export const AdminManagerDetail = () => {
  const { managerId } = useParams<{ managerId: string }>();
  const [manager, setManager] = useState<AdminManagerDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(err.message || '매니저 정보 조회 실패');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [managerId]);

  if (loading) return <div className="p-8">로딩 중...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
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
          <div className="flex-1 flex flex-col gap-6 pl-15">
            <div className="flex flex-col gap-4">
              <div className="text-slate-800 text-2xl font-bold">{manager.userName}</div>
              <div className="text-slate-500 text-base">{manager.bio}</div>
              <div className="text-slate-700 text-base font-medium">
                계약 상태: {(() => {
                  let label = '';
                  let color = '';
                  switch (manager.status) {
                    case 'ACTIVE':
                      label = '활성';
                      color = 'bg-emerald-50 text-emerald-500';
                      break;
                    case 'PENDING':
                      label = '승인대기';
                      color = 'bg-yellow-50 text-yellow-600';
                      break;
                    case 'TERMINATION_PENDING':
                      label = '계약해지대기';
                      color = 'bg-yellow-50 text-yellow-600';
                      break;
                    case 'SUSPENDED':
                      label = '정지';
                      color = 'bg-red-50 text-red-500';
                      break;
                    case 'DELETED':
                      label = '탈퇴';
                      color = 'bg-red-50 text-red-500';
                      break;
                    case 'REJECTED':
                      label = '승인거절';
                      color = 'bg-red-50 text-red-500';
                      break;
                    case 'TERMINATED':
                      label = '계약해지';
                      color = 'bg-red-50 text-red-500';
                      break;
                    default:
                      label = manager.status;
                      color = 'bg-gray-100 text-gray-500';
                  }
                  return (
                    <div className={`px-2 py-0.5 rounded-xl text-xs font-medium inline-block ${color}`}>{label}</div>
                  );
                })()}
              </div>
              <div className="text-slate-700 text-base font-medium">평점: {manager.averageRating != null ? Number(manager.averageRating).toFixed(1) : '-'}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="inline-flex justify-start items-center gap-2">
                <div className="w-28 text-slate-500 text-sm font-medium">이메일</div>
                <div className="flex-1 text-slate-700 text-sm font-medium">{manager.email}</div>
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <div className="w-28 text-slate-500 text-sm font-medium">연락처</div>
                <div className="flex-1 text-slate-700 text-sm font-medium">{manager.phone}</div>
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <div className="w-28 text-slate-500 text-sm font-medium">생년월일</div>
                <div className="flex-1 text-slate-700 text-sm font-medium">{manager.birthDate}</div>
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <div className="w-28 text-slate-500 text-sm font-medium">성별</div>
                <div className="flex-1 text-slate-700 text-sm font-medium">{manager.gender === 'MALE' ? '남' : manager.gender === 'FEMALE' ? '여' : '-'}</div>
              </div>
            </div>
          </div>
          <div className="w-40 h-40 bg-slate-100 rounded-full flex justify-center items-center">
            <div className="text-slate-400 text-5xl font-bold">{manager.userName?.[0] || '?'}</div>
          </div>
        </div>
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
        <div className="w-full p-8 bg-white rounded-xl shadow flex flex-col gap-4">
          <div className="text-slate-800 text-lg font-semibold">계약 정보</div>
          <div className="inline-flex justify-start items-center gap-2">
            <div className="w-40 text-slate-500 text-sm font-medium">계약 시작일</div>
            <div className="flex-1 text-slate-700 text-sm font-medium">{manager.contractAt || '-'}</div>
          </div>
          <div className="inline-flex justify-start items-center gap-2">
            <div className="w-40 text-slate-500 text-sm font-medium">계약 상태</div>
            <div className="h-7 px-3 flex justify-center items-center">
            {(() => {
                  let label = '';
                  let color = '';
                  switch (manager.status) {
                    case 'ACTIVE':
                      label = '활성';
                      color = 'bg-emerald-50 text-emerald-500';
                      break;
                    case 'PENDING':
                      label = '승인대기';
                      color = 'bg-yellow-50 text-yellow-600';
                      break;
                    case 'TERMINATION_PENDING':
                      label = '계약해지대기';
                      color = 'bg-yellow-50 text-yellow-600';
                      break;
                    case 'SUSPENDED':
                      label = '정지';
                      color = 'bg-red-50 text-red-500';
                      break;
                    case 'DELETED':
                      label = '탈퇴';
                      color = 'bg-red-50 text-red-500';
                      break;
                    case 'REJECTED':
                      label = '승인거절';
                      color = 'bg-red-50 text-red-500';
                      break;
                    case 'TERMINATED':
                      label = '계약해지';
                      color = 'bg-red-50 text-red-500';
                      break;
                    default:
                      label = manager.status;
                      color = 'bg-gray-100 text-gray-500';
                  }
                  return (
                    <div className={`px-2 py-0.5 rounded-xl text-xs font-medium inline-block ${color}`}>{label}</div>
                  );
              })()}
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
                onClick={handleApprove}
              >
                승인
              </button>
              <button
                className="px-4 py-2 border border-red-500 text-red-500 rounded bg-white hover:bg-red-500 hover:text-white transition-colors"
                onClick={handleReject}
              >
                거절
              </button>
            </div>
          )}
          {manager.status === 'TERMINATION_PENDING' && (
            <div className="flex gap-2 mt-4 justify-end">
              <button
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded bg-white hover:bg-indigo-600 hover:text-white transition-colors"
                onClick={handleTerminateApprove}
              >
                계약해지 승인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagerDetail;