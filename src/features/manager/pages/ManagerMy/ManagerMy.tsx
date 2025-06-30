import { Fragment, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getManager } from "@/features/manager/api/managerMy";
import type { ManagerInfo } from "@/features/manager/types/ManagerMyType";

const weekDays = [
  { label: "월요일", key: "MONDAY" },
  { label: "화요일", key: "TUESDAY" },
  { label: "수요일", key: "WEDNESDAY" },
  { label: "목요일", key: "THURSDAY" },
  { label: "금요일", key: "FRIDAY" },
  { label: "토요일", key: "SATURDAY" },
  { label: "일요일", key: "SUNDAY" },
];

const statusColorMap: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "bg-green-100", text: "text-green-800" },
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800" },
  TERMINATION_PENDING: { bg: "bg-orange-100", text: "text-orange-800" },
  TERMINATED: { bg: "bg-gray-200", text: "text-gray-700" },
};

export const ManagerMy = () => {
  const [manager, setManager] = useState<ManagerInfo | null>(null);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const body = await getManager();
        setManager(body);
      } catch (err) {
      alert("매니저 정보 조회 중 오류가 발생하였습니다.");
      }
    };
    fetchManager();
  }, []);

  const statusColor = useMemo(() => {
    if (!manager) {
      return {
        bg: "bg-slate-100",
        text: "text-slate-600",
      };
    }
    return statusColorMap[manager.status] || {
      bg: "bg-slate-100",
      text: "text-slate-600",
    };
  }, [manager]);

  const groupedTimes = useMemo(() => {
    const map: Record<string, string[]> = {};

    if (!manager) return map;

    for (const { dayOfWeek, time } of manager.availableTimes) {
      if (!map[dayOfWeek]) map[dayOfWeek] = [];
      map[dayOfWeek].push(time.slice(0, 5)); // ex: "14:00:00" → "14:00"
    }

    for (const key in map) {
      map[key].sort(); // 시간 순 정렬
    }

    return map;
  }, [manager]);

  // 로딩 화면은 여기서 처리
  if (!manager) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">마이페이지</div>
          {manager.status === 'ACTIVE' && (
            <Link
              to="/managers/my/edit"
              className="h-10 px-4 bg-indigo-600 rounded-md flex justify-center items-center gap-2 cursor-pointer hover:bg-indigo-700 transition"
            >
              <span className="material-symbols-outlined text-white">edit</span>
              <span className="text-white text-sm font-semibold font-['Inter'] leading-none">정보 수정</span>
            </Link>
          )}
        </div>
        <div className="self-stretch h-[1049px] p-6 flex flex-col justify-start items-start gap-6">
          <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] inline-flex justify-start items-start gap-8">
            <div className="w-40 h-40 bg-slate-100 rounded-[80px] flex justify-center items-center">
              <div className="justify-start text-slate-400 text-5xl font-bold font-['Inter'] leading-[57.60px]">{manager.userName?.charAt(0)}</div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-start text-slate-800 text-2xl font-bold font-['Inter'] leading-7">{ manager.userName }</div>
                <div className="self-stretch justify-start text-slate-700 text-base font-medium font-['Inter'] leading-tight">{ manager.bio }</div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-28 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">연락처</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{ manager.phone }</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-28 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">이메일</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{ manager.email }</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-28 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">생년월일</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{ manager.birthDate }</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-28 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">성별</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{ manager.genderName }</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-28 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">주소</div>
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{ manager.roadAddress }, { manager.detailAddress }</div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-6">
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-2">
              <div className="text-base font-semibold text-slate-800">업무 가능 시간</div>
              <div className="self-stretch p-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-3">
                {weekDays.map(({ label, key }) => {
                  const times = groupedTimes[key];
                  const displayText = times?.length ? times.join(', ') : '휴무';

                  return (
                    <div key={key} className="self-stretch inline-flex justify-start items-center">
                      <div className="w-28 justify-start text-slate-700 text-sm font-medium leading-none">{label}</div>
                      <div className="flex-1 justify-start text-slate-700 text-sm font-medium leading-none">{displayText}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 첨부파일 (있을 때만 표시) */}
            {manager.fileId && (
              <div className="flex flex-col gap-2">
                <div className="text-base font-semibold text-slate-800">첨부파일</div>
                <div className="h-12 px-4 bg-slate-50 rounded-lg flex items-center gap-2 outline outline-1 outline-slate-200">
                  <span className="material-symbols-outlined text-slate-500">description</span>
                  {/* <a
                    href={manager.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-700 text-sm font-medium underline hover:text-blue-600"
                  >
                    {manager.fileName}
                  </a> */}
                </div>
              </div>
            )}
          </div>
          <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">계약 정보</div>
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">
                계약 상태
              </div>
              <div className={`h-7 px-3 rounded-2xl flex justify-center items-center ${statusColor.bg}`}>
                <div className={`text-sm font-medium font-['Inter'] leading-none ${statusColor.text}`}>
                  {manager.statusName}
                </div>
              </div>
            </div>
            {manager.status === 'ACTIVE' && (
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">계약 시작일</div>
                <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{ manager.contractAt }</div>
              </div>
            )}
            {manager.status === 'TERMINATION_PENDING' && (
              <Fragment>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">계약 해지 사유</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none p-4 bg-slate-50 rounded-lg text-slate-700 text-sm whitespace-pre-wrap">{ manager.terminationReason }</div>
                </div>
              </Fragment>
            )}
            {manager.status === 'ACTIVE' && (
              <div className="self-stretch inline-flex justify-end items-center">
                <Link
                  to="/managers/my/contract-cancel"
                  state={{ contractAt: manager.contractAt, statusName: manager.statusName }}
                  className="w-40 h-10 bg-red-500 rounded-lg flex justify-center items-center hover:bg-red-600"
                >
                  <div className="justify-start text-white text-sm font-medium font-['Inter'] leading-none">계약 해지 요청</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};