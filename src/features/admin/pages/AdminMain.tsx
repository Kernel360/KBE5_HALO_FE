import { Fragment, useEffect, useState } from "react";
import { fetchAdminManagers } from "../api/adminManager";
import { useNavigate } from "react-router-dom";
import { searchAdminInquiries } from "../api/adminInquiry";
import { ChevronRight, ArrowUp, ArrowDown } from "lucide-react";

const EXCLUDE_STATUSES = ["ACTIVE", "REJECTED", "TERMINATED"]; // "승인대기"(예: WAITING)는 제외

export const AdminMain = () => {
  const [newManagers, setNewManagers] = useState<any[]>([]);
  const [newManagersTotal, setNewManagersTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pendingInquiries, setPendingInquiries] = useState<any[]>([]);
  const [pendingInquiriesLoading, setPendingInquiriesLoading] = useState(false);
  const [totalPendingInquiries, setTotalPendingInquiries] = useState(0);
  const navigate = useNavigate();

  // 하드코딩된 추이 데이터 (실제 API 연동 전용)
  const stats = {
    totalReservation: { value: 248, trend: "12% 증가" },
    completedReservation: { value: 186, trend: "8% 증가" },
    todayReservation: { value: 24, trend: "+12%" },
    sales: { value: 4862500, trend: "5% 감소" }, // 감소 예시
  };

  // 하드코딩된 오늘의 스케줄 데이터
  const todaySchedules = [
    {
      time: "09:00 - 12:00",
      title: "홍길동 고객 방문 청소",
      address: "서울시 강남구 테헤란로 123",
    },
    {
      time: "14:00 - 17:00",
      title: "김철수 고객 방문 청소",
      address: "서울시 서초구 서초대로 456",
    },
    {
      time: "18:00 - 20:00",
      title: "이영희 고객 방문 청소",
      address: "서울시 송파구 올림픽로 789",
    },
  ];

  useEffect(() => {
    const fetchManagers = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminManagers({
          excludeStatus: EXCLUDE_STATUSES,
          size: 3,
          page: 0,
        });
        setNewManagers(data.content || []);
        setNewManagersTotal(data.page.totalElements || 0);
      } catch (e) {
        // 에러 핸들링
        setNewManagers([]);
        setNewManagersTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchManagers();
  }, []);

  useEffect(() => {
    const fetchPendingInquiries = async () => {
      setPendingInquiriesLoading(true);
      try {
        const [customer, manager] = await Promise.all([
          searchAdminInquiries("customer", {
            replyStatus: "PENDING",
            page: 0,
            size: 3,
          }),
          searchAdminInquiries("manager", {
            replyStatus: "PENDING",
            page: 0,
            size: 3,
          }),
        ]);
        const combined = [
          ...(customer.content || []).map((item: any) => ({
            ...item,
            type: "customer",
          })),
          ...(manager.content || []).map((item: any) => ({
            ...item,
            type: "manager",
          })),
        ];
        combined.sort((a, b) => {
          if (a.createdAt === b.createdAt) return b.id - a.id;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setPendingInquiries(combined.slice(0, 3));
        setTotalPendingInquiries(
          (customer.page?.totalElements || 0) +
            (manager.page?.totalElements || 0),
        );
      } catch (e) {
        setPendingInquiries([]);
        setTotalPendingInquiries(0);
      } finally {
        setPendingInquiriesLoading(false);
      }
    };
    fetchPendingInquiries();
  }, []);

  // 오늘 날짜와 요일을 포맷하는 함수
  function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const day = days[today.getDay()];
    return `${year}년 ${month}월 ${date}일 ${day}`;
  }

  // trend 텍스트에 증가/감소 문구를 자동으로 붙여주는 함수
  function getTrendText(trend: string) {
    if (trend.includes("증가") || trend.includes("감소")) return trend;
    if (trend.startsWith("-") || trend.includes("▼")) return trend + " 감소";
    return trend + " 증가";
  }

  return (
    <Fragment>
      <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-start items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">
            대시보드
          </div>
        </div>
        <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-start items-start gap-4">
              <div className="flex-1 h-24 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                  이번주 총 예약 건수
                </div>
                <div className="justify-start text-gray-900 text-2xl font-bold font-['Inter'] leading-7">
                  {stats.totalReservation.value}
                </div>
                <div className="inline-flex justify-start items-center gap-1">
                  {stats.totalReservation.trend.includes("감소") ? (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <ArrowUp className="w-4 h-4 text-emerald-500" />
                  )}
                  <div
                    className={`justify-start text-xs font-medium font-['Inter'] leading-none ${stats.totalReservation.trend.includes("감소") ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {stats.totalReservation.trend}
                  </div>
                </div>
              </div>
              <div className="flex-1 h-24 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                  완료된 예약 건수
                </div>
                <div className="justify-start text-gray-900 text-2xl font-bold font-['Inter'] leading-7">
                  {stats.completedReservation.value}
                </div>
                <div className="inline-flex justify-start items-center gap-1">
                  {stats.completedReservation.trend.includes("감소") ? (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <ArrowUp className="w-4 h-4 text-emerald-500" />
                  )}
                  <div
                    className={`justify-start text-xs font-medium font-['Inter'] leading-none ${stats.completedReservation.trend.includes("감소") ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {stats.completedReservation.trend}
                  </div>
                </div>
              </div>
              <div className="flex-1 h-24 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                  오늘의 예약 건수
                </div>
                <div className="justify-start text-gray-900 text-2xl font-bold font-['Inter'] leading-7">
                  {stats.todayReservation.value}
                </div>
                <div className="inline-flex justify-start items-center gap-1">
                  {stats.todayReservation.trend.includes("감소") ? (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <ArrowUp className="w-4 h-4 text-emerald-500" />
                  )}
                  <div
                    className={`justify-start text-xs font-medium font-['Inter'] leading-none ${stats.todayReservation.trend.includes("감소") ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {getTrendText(stats.todayReservation.trend)}
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-4">
              <div className="flex-1 h-24 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                  매출 요약
                </div>
                <div className="justify-start text-gray-900 text-2xl font-bold font-['Inter'] leading-7">
                  ₩{stats.sales.value.toLocaleString()}
                </div>
                <div className="inline-flex justify-start items-center gap-1">
                  {stats.sales.trend.includes("감소") ? (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <ArrowUp className="w-4 h-4 text-emerald-500" />
                  )}
                  <div
                    className={`justify-start text-xs font-medium font-['Inter'] leading-none ${stats.sales.trend.includes("감소") ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {stats.sales.trend}
                  </div>
                </div>
              </div>
              <div className="flex-1 h-24 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                  신규 매니저 신청 수
                </div>
                <div
                  className="justify-start text-amber-500 text-2xl font-bold font-['Inter'] leading-7 cursor-pointer hover:underline"
                  onClick={() =>
                    navigate("/admin/managers", { state: { tab: "applied" } })
                  }
                >
                  {newManagersTotal}
                </div>
                {newManagersTotal > 0 && (
                  <div className="px-2 py-0.5 bg-amber-50 rounded-xl inline-flex justify-center items-center">
                    <div className="justify-start text-amber-600 text-xs font-medium font-['Inter'] leading-none">
                      확인 필요
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 h-24 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                  새로 등록된 문의글 수
                </div>
                <div
                  className="justify-start text-amber-500 text-2xl font-bold font-['Inter'] leading-7 cursor-pointer hover:underline"
                  onClick={() => navigate("/admin/inquiries")}
                >
                  {totalPendingInquiries}
                </div>
                {totalPendingInquiries > 0 && (
                  <div className="px-2 py-0.5 bg-amber-50 rounded-xl inline-flex justify-center items-center">
                    <div className="justify-start text-amber-600 text-xs font-medium font-['Inter'] leading-none">
                      답변 필요
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="self-stretch p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-gray-900 text-base font-semibold font-['Inter'] leading-tight">
                오늘의 스케줄
              </div>
              <div className="justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-none">
                {getTodayString()}
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              {todaySchedules.map((schedule, idx) => (
                <div
                  key={idx}
                  className="self-stretch p-3 bg-gray-50 rounded-lg inline-flex justify-between items-center transition-colors hover:bg-indigo-50 cursor-pointer"
                >
                  <div className="flex justify-start items-center gap-3">
                    <div className="px-2 py-1 bg-indigo-100 rounded flex justify-center items-center">
                      <div className="justify-start text-indigo-600 text-xs font-medium font-['Inter'] leading-none">
                        {schedule.time}
                      </div>
                    </div>
                    <div className="inline-flex flex-col justify-start items-start gap-0.5">
                      <div className="justify-start text-gray-900 text-sm font-semibold font-['Inter'] leading-none">
                        {schedule.title}
                      </div>
                      <div className="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-none">
                        {schedule.address}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-start items-start gap-6">
            <div className="flex-1 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="justify-start text-gray-900 text-base font-semibold font-['Inter'] leading-tight">
                  신규 매니저 신청
                </div>
                <div
                  className="flex justify-start items-center gap-1 cursor-pointer"
                  onClick={() =>
                    navigate("/admin/managers", { state: { tab: "applied" } })
                  }
                >
                  <div className="justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">
                    전체보기
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-600 ml-0.5" />
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {loading ? (
                  <div>로딩중...</div>
                ) : newManagers.length === 0 ? (
                  <div>신규 매니저 신청이 없습니다.</div>
                ) : (
                  newManagers.map((manager) => (
                    <div
                      key={manager.id}
                      className="self-stretch p-3 bg-gray-50 rounded-lg inline-flex justify-between items-center cursor-pointer transition-colors hover:bg-indigo-50"
                      onClick={() =>
                        navigate(`/admin/managers/${manager.managerId}`)
                      }
                    >
                      <div className="flex justify-start items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-[20px] inline-flex flex-col justify-center items-center">
                          <div className="justify-start text-indigo-600 text-sm font-semibold font-['Inter'] leading-none">
                            {manager.userName
                              ? manager.userName
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                              : ""}
                          </div>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start gap-0.5">
                          <div className="justify-start text-gray-900 text-sm font-semibold font-['Inter'] leading-none">
                            {manager.userName}
                          </div>
                          <div className="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-none">
                            {manager.createdAt?.slice(0, 10)} 신청
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex-1 p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="justify-start text-gray-900 text-base font-semibold font-['Inter'] leading-tight">
                  답변이 필요한 문의사항
                </div>
                <div
                  className="flex justify-start items-center gap-1 cursor-pointer"
                  onClick={() => navigate("/admin/inquiries")}
                >
                  <div className="justify-start text-indigo-600 text-sm font-medium font-['Inter'] leading-none">
                    전체보기
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-600 ml-0.5" />
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {pendingInquiriesLoading ? (
                  <div>로딩중...</div>
                ) : pendingInquiries.length === 0 ? (
                  <div>답변이 필요한 문의사항이 없습니다.</div>
                ) : (
                  pendingInquiries.map((inquiry) => (
                    <div
                      key={inquiry.inquiryId}
                      className="self-stretch p-3 bg-gray-50 rounded-lg inline-flex justify-between items-center cursor-pointer transition-colors hover:bg-indigo-50"
                      onClick={() =>
                        navigate(
                          `/admin/inquiries/${inquiry.type}/${inquiry.inquiryId}`,
                          { state: { authorId: inquiry.authorId } },
                        )
                      }
                    >
                      <div className="flex justify-start items-center gap-3">
                        <div
                          className={`px-2 py-0.5 rounded-xl flex justify-center items-center ${inquiry.type === "customer" ? "bg-amber-100" : "bg-indigo-100"}`}
                        >
                          <div
                            className={`justify-start text-xs font-medium font-['Inter'] leading-none ${inquiry.type === "customer" ? "text-amber-600" : "text-indigo-600"}`}
                          >
                            {inquiry.type === "customer" ? "고객" : "매니저"}
                          </div>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start gap-0.5">
                          <div className="justify-start text-gray-900 text-sm font-semibold font-['Inter'] leading-none">
                            {inquiry.title}
                          </div>
                          <div className="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-none">
                            {inquiry.createdAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
