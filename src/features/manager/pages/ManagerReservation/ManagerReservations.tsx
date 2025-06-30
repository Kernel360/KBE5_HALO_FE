import { Fragment, useEffect, useRef, useState } from "react";
import type { ManagerReservationSummary as ManagerReservationType } from "@/features/manager/types/ManagerReservationType";
import { isValidDateRange } from "@/shared/utils/validation";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/constants";
import { searchManagerReservations } from "@/features/manager/api/managerReservation";
import { Link } from "react-router-dom";
import { getReservationStatusStyle } from "@/features/manager/utils/ManagerReservationStauts";
import { formatTimeRange } from "@/shared/utils/format";

export const ManagerReservations = () => {
  const statuses = [
    // { value: "PRE_CANCELED", label: "예약 확정 전 취소" },
    // { value: "REQUESTED", label: "예약 요청" },
    { value: "CONFIRMED", label: "예약 완료" },
    { value: "IN_PROGRESS", label: "서비스 진행 중" },
    { value: "COMPLETED", label: "방문 완료" },
    // { value: "CANCELED", label: "예약 취소" },
    { value: "REJECTED", label: "예약 거절" },
    // { value: "REFUND_PROCESSING", label: "환불 진행중" },
    // { value: "REFUND_COMPLETED", label: "환불 완료" },
    // { value: "REFUND_REJECTED", label: "환불 거절" },
  ];
  const [fadeKey, setFadeKey] = useState(0);
  const [reservations, setReservations] = useState<ManagerReservationType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [fromRequestDate, setFromRequestDate] = useState<string>("");
  const [toRequestDate, setToRequestDate] = useState<string>(""); 
  // const [reservationStatus, setReservationStatus] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    statuses.map((s) => s.value) // 전체 선택으로 시작
  );
  const [isCheckedIn, setIsCheckedIn] = useState<string>("");
  const [isCheckedOut, setIsCheckedOut] = useState<string>("");
  const [isReviewed, setIsReviewed] = useState<string>("");
  const [customerNameKeyword, setCustomerNameKeyword] = useState("");
  const fromDateRef = useRef<HTMLInputElement>(null);


  // "전체" 토글 로직
  const handleToggleAll = () => {
    if (selectedStatuses.length === statuses.length) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses(statuses.map((s) => s.value));
    }
  };

  // 개별 상태 토글
  const handleStatusChange = (value: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const StatusBadge = ({
    value,
    trueText,
    falseText,
  }: {
    value: boolean;
    trueText: string;
    falseText: string;
  }) => (
    <div
      className={`h-7 px-3 rounded-2xl inline-flex justify-center items-center
        ${value ? "bg-green-100" : "bg-slate-100"}`}
    >
      <div
        className={`text-sm font-medium font-['Inter'] leading-none
          ${value ? "text-green-800" : "text-slate-800"}`}
      >
        {value ? trueText : falseText}
      </div>
    </div>
  );

  const fetchReservations = (paramsOverride?: Partial<ReturnType<typeof getCurrentParams>>) => {
    const params = getCurrentParams();
    const finalParams = { ...params, ...paramsOverride };

    if (!isValidDateRange(finalParams.fromRequestDate, finalParams.toRequestDate)) {
      alert("시작일은 종료일보다 늦을 수 없습니다.");
      fromDateRef.current?.focus();
      return;
    }

    searchManagerReservations(finalParams)
    .then((res) => {
      setReservations(res.content);
      setTotal(res.page.totalElements);
      setFadeKey((prev) => prev + 1);
    });
  };

  const getCurrentParams = () => ({
    fromRequestDate,
    toRequestDate,
    // reservationStatus,
    reservationStatus: 
      selectedStatuses.length === statuses.length || selectedStatuses.length === 0
        ? ""
        : selectedStatuses.join(","),
    isCheckedIn,
    isCheckedOut,
    isReviewed,
    customerNameKeyword,
    page,
    size: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    fetchReservations();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchReservations({ page: 0 });
  };

  const handleReset = () => {
    const resetState = {
      fromRequestDate: "",
      toRequestDate: "",
      reservationStatus: "",
      isCheckedIn: "",
      isCheckedOut: "",
      isReviewed: "",
      customerNameKeyword: "",
      page: 0,
    };

    setFromRequestDate(resetState.fromRequestDate);
    setToRequestDate(resetState.toRequestDate);
    // setReservationStatus(resetState.reservationStatus);
    setSelectedStatuses(statuses.map((s) => s.value)); // 전체 선택으로 초기화!
    setIsCheckedIn(resetState.isCheckedIn);
    setIsCheckedOut(resetState.isCheckedOut);
    setIsReviewed(resetState.isReviewed);
    setCustomerNameKeyword(resetState.customerNameKeyword);
    setPage(0);

    fetchReservations(resetState);
  };

  const totalPages = Math.max(Math.ceil(total / DEFAULT_PAGE_SIZE), 1);

  return (
    <Fragment>
      <div className="flex-1 flex flex-col justify-start items-start w-full min-w-0">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">예약 관리</div>
        </div>
        
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4"
          >
            <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">검색 조건</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">예약 상태</div>
                  <div className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-center">
                    {/* 체크박스들을 감싸는 가로 flex 영역 */}
                    <div className="flex flex-wrap gap-4">
                      {/* 전체 체크박스 */}
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.length === statuses.length}
                          onChange={handleToggleAll}
                        />
                        <span className="text-sm text-slate-700 font-semibold">전체</span>
                      </label>

                      {/* 개별 체크박스들 */}
                      {statuses.map((status) => (
                        <label key={status.value} className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={status.value}
                            checked={selectedStatuses.includes(status.value)}
                            onChange={() => handleStatusChange(status.value)}
                          />
                          <span className="text-sm text-slate-700">{status.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">예약 날짜</div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <input
                      type="date"
                      ref={fromDateRef}
                      value={fromRequestDate}
                      onChange={(e) => setFromRequestDate(e.target.value)}
                      className="flex-1 h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm placeholder:text-slate-400 focus:outline-indigo-500 "
                    />
                    <span className="text-slate-500 text-sm">~</span>
                    <input
                      type="date"
                      value={toRequestDate}
                      onChange={(e) => setToRequestDate(e.target.value)}
                      className="flex-1 h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm placeholder:text-slate-400 focus:outline-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">고객명</div>
                  <div className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-center">
                    <input
                      value={customerNameKeyword}
                      onChange={(e) => setCustomerNameKeyword(e.target.value)}
                      placeholder="고객명 검색"
                      className="w-full text-sm text-slate-700 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">체크인 여부</div>
                  <select
                    value={isCheckedIn}
                    onChange={(e) => setIsCheckedIn(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-indigo-500"
                  >
                    <option value="">전체</option>
                    <option value="true">완료</option>
                    <option value="false">대기</option>
                  </select>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">체크아웃 여부</div>
                  <select
                    value={isCheckedOut}
                    onChange={(e) => setIsCheckedOut(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-indigo-500"
                  >
                    <option value="">전체</option>
                    <option value="true">완료</option>
                    <option value="false">대기</option>
                  </select>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">리뷰작성 여부</div>
                  <select
                    value={isReviewed}
                    onChange={(e) => setIsReviewed(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-indigo-500"
                  >
                    <option value="">전체</option>
                    <option value="true">완료</option>
                    <option value="false">대기</option>
                  </select>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-end items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-28 h-12 bg-slate-100 rounded-lg flex justify-center items-center text-slate-500 text-sm font-medium font-['Inter'] leading-none hover:bg-slate-200 transition cursor-pointer"
                >
                  초기화
                </button>
                <button
                  type="submit"
                  className="w-28 h-12 bg-indigo-600 rounded-lg flex justify-center items-center text-white text-sm font-medium font-['Inter'] leading-none hover:bg-indigo-700 transition cursor-pointer"
                >
                  검색
                </button>
              </div>
            </div>
          </form>


          <div className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start">
            <div className="self-stretch inline-flex justify-between items-center pb-4">
              <div className="justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">예약 내역</div>
              <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">총 {total}건</div>
            </div>
            <div className="self-stretch h-12 px-4 bg-slate-50 border-b border-slate-200 inline-flex justify-start items-center">
              <div className="flex-1 flex justify-center items-center">
                <div className="flex-1 flex justify-center items-center">
                  <div className="flex-1 flex justify-center items-center gap-4">
                    <div className="w-[5%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">번호</div>
                    <div className="w-[15%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">청소 요청 날짜</div>
                    <div className="w-[15%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">시간</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">고객명</div>
                    <div className="w-[20%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">고객 주소</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">서비스</div>
                    <div className="w-[12%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">예약 상태</div>
                    <div className="w-[5%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">체크인</div>
                    <div className="w-[8%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">체크아웃</div>
                    <div className="w-[5%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">리뷰작성</div>
                  </div>
                </div>
              </div>
            </div>

            <div key={fadeKey} className="w-full fade-in">
              {reservations.length === 0 ? (
                <div className="self-stretch h-16 px-4 border-b border-slate-200 flex items-center text-center">
                  <div className="w-full text-sm text-slate-500">조회된 문의사항이 없습니다.</div>
                </div>
              ) : (
                reservations.map((reservation) => {
                  const statusInfo = getReservationStatusStyle(reservation.status);
                  return (
                    <Link
                      key={reservation.reservationId}
                      to={`/managers/reservations/${reservation.reservationId}`}
                      className="self-stretch h-16 px-4 border-b border-slate-200 flex items-center text-center gap-4"
                    >
                      <div className="w-[5%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">
                        {reservation.reservationId}
                      </div>
                      <div className="w-[15%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">
                        {reservation.requestDate}
                      </div>
                      <div className="w-[15%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">
                        {formatTimeRange(reservation.startTime, reservation.turnaround)}
                      </div>
                      <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">
                        {reservation.customerName}
                      </div>
                      <div className="w-[20%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">
                        {reservation.customerAddress}
                      </div>
                      <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">
                        <div className="h-7 px-3 bg-sky-100 rounded-2xl inline-flex justify-center items-center">
                          <div className="text-sky-900 text-sm text-slate-700 font-medium font-['Inter'] leading-none">
                            {reservation.serviceName}
                          </div>
                        </div>
                      </div>
                      <div className="w-[12%] text-center text-sm font-medium">
                        <div className={`h-7 px-3 rounded-2xl inline-flex justify-center items-center ${statusInfo.bgColor}`}>
                          <div className={`text-sm font-medium font-['Inter'] leading-none ${statusInfo.textColor}`}>
                            {reservation.statusName}
                          </div>
                        </div>
                      </div>
                      <div className="w-[5%] text-center">
                        <StatusBadge value={reservation.isCheckedIn} trueText="완료" falseText="대기" />
                      </div>
                      <div className="w-[8%] text-center">
                        <StatusBadge value={reservation.isCheckedOut} trueText="완료" falseText="대기" />
                      </div>
                      <div className="w-[5%] text-center">
                        <StatusBadge value={reservation.isReviewed} trueText="완료" falseText="대기" />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* 페이징 */}
            <div className="self-stretch flex justify-center gap-1 pt-4">
              <div
                className="w-8 h-8 rounded-md flex justify-center items-center cursor-pointer bg-slate-100 text-slate-500"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                <div className="text-sm font-medium font-['Inter'] leading-none">이전</div>
              </div>
              {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                <div
                  key={p}
                  className={`w-8 h-8 rounded-md flex justify-center items-center cursor-pointer ${
                    page === p ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                  onClick={() => setPage(p)}
                >
                  <div className="text-sm font-medium font-['Inter'] leading-none">{p + 1}</div>
                </div>
              ))}
              <div
                className="w-8 h-8 rounded-md flex justify-center items-center cursor-pointer bg-slate-100 text-slate-500"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              >
                <div className="text-sm font-medium font-['Inter'] leading-none">다음</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  );
};