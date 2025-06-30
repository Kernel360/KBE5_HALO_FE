import { Fragment, useState, useEffect } from "react";
import { searchManagerPayments } from "@/features/manager/api/managerPayment";
import type { ManagerPayments as Payments } from "@/features/manager/types/ManagerPaymentType";
import { ChevronDown, ChevronUp } from "lucide-react";

export const ManagerPayments = () => {
  const [fadeKey, setFadeKey] = useState(0);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [resetTrigger, setResetTrigger] = useState(false);

  const [payments, setPayments] = useState<Payments[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [commission, setCommission] = useState(0);
  const [settlementAmount, setSettlementAmount] = useState(0);

  const now = new Date();
  const [searchYear, setSearchYear] = useState<number>(now.getFullYear());
  const [searchMonth, setSearchMonth] = useState(now.getMonth() + 1);
  const [searchWeekIndexInMonth, setSearchWeekIndexInMonth] = useState<number | "">("");
  const [weekOptions, setWeekOptions] = useState<number[]>([]);

  // 월요일 기준 주차 수 계산
  const getMondayWeekCount = (year: number, month: number): number => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    let count = 0;

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 1) count++;
    }

    return count;
  };

  // 현재 날짜가 몇 번째 주차에 속하는지 계산
  const getCurrentWeekIndex = (date: Date, year: number, month: number): number | "" => {
    const firstDay = new Date(year, month - 1, 1);
    const mondays: Date[] = [];

    for (let d = new Date(firstDay); d.getMonth() === month - 1; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 1) {
        mondays.push(new Date(d));
      }
    }

    for (let i = 0; i < mondays.length; i++) {
      const start = mondays[i];
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      if (date >= start && date <= end) {
        return i + 1;
      }
    }

    return "";
  };

  useEffect(() => {
    if (searchYear && searchMonth) {
      const weekCount = getMondayWeekCount(searchYear, searchMonth);
      const weekList = Array.from({ length: weekCount }, (_, i) => i + 1);
      setWeekOptions(weekList);
      if (now.getFullYear() === searchYear && now.getMonth() + 1 === searchMonth) {
        const currentWeek = getCurrentWeekIndex(now, searchYear, searchMonth);
        setSearchWeekIndexInMonth(currentWeek);
      } else {
        setSearchWeekIndexInMonth("");
      }
    }
  }, [searchYear, searchMonth]);

  useEffect(() => {
    if (
      resetTrigger &&
      searchYear &&
      searchMonth &&
      searchWeekIndexInMonth
    ) {
      handleSearch();
      setResetTrigger(false);
    }
  }, [resetTrigger, searchYear, searchMonth, searchWeekIndexInMonth]);
  
  // 검색
  const handleSearch = async () => {
    if (!searchYear) {
      alert("연도를 입력해주세요.");
    }
    if (!searchMonth) {
      alert("월을 입력해주세요.");
    }
    if (!searchWeekIndexInMonth) {
      alert("주차를 입력해주세요.");
    }

    if (!searchWeekIndexInMonth || !searchYear || !searchMonth) return;
    
    try {
      const data = await searchManagerPayments({
        searchYear,
        searchMonth,
        searchWeekIndexInMonth,
      });

      setPayments(data);

      // 총합 계산
      const total = data.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
      const comm = data.reduce((sum: number, item: any) => sum + item.commission, 0);
      const settlement = data.reduce((sum: number, item: any) => sum + item.settlementAmount, 0);

      setTotalPrice(total);
      setCommission(comm);
      setSettlementAmount(settlement);
      setFadeKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  // 초기화
  const handleReset = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    setSearchYear(year);
    setSearchMonth(month);

    const currentWeek = getCurrentWeekIndex(today, year, month);
    setSearchWeekIndexInMonth(currentWeek);

    setResetTrigger(true);
  };

  return (
    <Fragment>
      <div className="flex-1 flex flex-col justify-start items-start w-full min-w-0">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">정산 관리</div>
        </div>
        
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col gap-4"
          >
            {/* 검색 조건 제목 */}
            <div className="text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">
              검색 조건
            </div>

            {/* 입력창 + 버튼 */}
            <div className="w-full flex flex-wrap items-end gap-4">
              {/* 연도 */}
              <div className="w-28 flex flex-col gap-1">
                <label className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-nonetext-sm text-slate-700 font-medium">연도</label>
                <select
                  value={searchYear}
                  onChange={(e) => setSearchYear(Number(e.target.value))}
                  className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-indigo-500"
                >
                  {Array.from({ length: new Date().getFullYear() - 2025 + 1 }, (_, i) => 2025 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                </select>
              </div>

              {/* 월 */}
              <div className="w-28 flex flex-col gap-1">
                <label className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-nonetext-sm text-slate-700 font-medium">월</label>
                <select
                  value={searchMonth}
                  onChange={(e) => setSearchMonth(Number(e.target.value))}
                  className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-indigo-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}월
                    </option>
                  ))}
                </select>
              </div>

              {/* 주차 */}
              <div className="w-28 flex flex-col gap-1">
                <label className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-nonetext-sm text-slate-700 font-medium">주차</label>
                <select
                  value={searchWeekIndexInMonth}
                  onChange={(e) => setSearchWeekIndexInMonth(Number(e.target.value))}
                  disabled={!weekOptions.length}
                  className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-indigo-500"
                >
                  <option value="">-- 선택 --</option>
                  {weekOptions.map((w) => (
                    <option key={w} value={w}>
                      {w}주차
                    </option>
                  ))}
                </select>
              </div>

              {/* 버튼들 */}
              <div className="flex gap-2 ml-auto pt-5">
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

          <div className="w-full flex items-center gap-8">
            {/* 금액 */}
            <div className="flex-1 h-28 p-5 bg-white rounded-xl shadow border border-green-200 flex flex-col justify-between">
              <div className="text-green-500 text-base font-semibold">금액</div>
              <div className="text-slate-900 text-3xl font-bold leading-10">{totalPrice.toLocaleString()}원</div>
            </div>

            {/* - 기호 */}
            <div className="h-28 flex items-center justify-center text-4xl font-extrabold text-slate-400 select-none">
              -
            </div>

            {/* 수수료 */}
            <div className="flex-1 h-28 p-5 bg-white rounded-xl shadow border border-rose-200 flex flex-col justify-between">
              <div className="text-rose-500 text-base font-semibold">수수료</div>
              <div className="text-slate-900 text-3xl font-bold leading-10">{commission.toLocaleString()}원</div>
            </div>

            {/* = 기호 */}
            <div className="h-28 flex items-center justify-center text-4xl font-extrabold text-indigo-500 select-none">
              =
            </div>

            {/* 정산 금액 */}
            <div className="flex-1 h-28 p-5 bg-white rounded-xl shadow border border-indigo-300 flex flex-col justify-between">
              <div className="text-indigo-600 text-base font-semibold">정산 금액</div>
              <div className="text-indigo-600 text-3xl font-bold leading-10">{settlementAmount.toLocaleString()}원</div>
            </div>
          </div>

          <div className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start">
            <div className="self-stretch inline-flex justify-between items-center pb-4">
              <div className="justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">정산 상세 내역</div>
            </div>
            <div className="self-stretch h-12 px-4 bg-slate-50 border-b border-slate-200 inline-flex justify-start items-center">
              <div className="flex-1 flex justify-center items-center">
                <div className="flex-1 flex justify-center items-center">
                  <div className="flex-1 flex justify-center items-center gap-4">
                    <div className="w-[5%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">예약번호</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">고객명</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">요청날짜</div>
                    <div className="w-[15%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">요청시간</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">서비스</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">추가서비스</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">서비스금액</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">추가서비스금액</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">총 금액</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">수수료</div>
                    <div className="w-[10%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">정산 금액</div>
                  </div>
                </div>
              </div>
            </div>

            <div key={fadeKey} className="w-full fade-in">
              { payments.length === 0 ? (
                <div className="self-stretch h-16 px-4 border-b border-slate-200 flex items-center text-center">
                  <div className="w-full text-sm text-slate-500">조회된 정산 내역이 없습니다.</div>
                </div>
              ) : (
                payments.map(payment => {
                  const isExpanded = expandedRow === payment.reservationId;
                  return (
                    <Fragment key={payment.reservationId}>
                      <div key={payment.reservationId} className="self-stretch h-16 px-4 border-b border-slate-200 flex items-center text-center gap-4">
                        <div className="w-[5%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.reservationId}</div>
                        <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.customerName}</div>
                        <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.requestDate}</div>
                        <div className="w-[15%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.reservationTime} (총 {payment.turnaround}시간)</div>
                        <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.serviceName}</div>
                        <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">
                          <div className="inline-flex items-center justify-center gap-1 cursor-pointer" onClick={() => setExpandedRow(isExpanded ? null : payment.reservationId)}>
                            {payment.extraServices?.length ? `총 ${payment.extraServices.length}건` : `-`}
                            {payment.extraServices?.length ? (isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : null}
                          </div>
                        </div>
                        <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.price.toLocaleString()}원</div>
                        <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.extraPrice.toLocaleString()}원</div>
                        <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.totalPrice.toLocaleString()}원</div>
                        <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.commission.toLocaleString()}원</div>
                        <div className="w-[10%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{payment.settlementAmount.toLocaleString()}원</div>
                      </div>

                      {/* 토글 내용 */}
                      {isExpanded && payment.extraServices?.length && (
                        <div className="w-full px-6 py-3 bg-slate-100 border-b border-slate-200 text-sm text-slate-700">
                          <div className="ml-[40%] w-[30%]">
                            <div className="text-sm font-semibold mb-2">추가 서비스 내역</div>
                            {payment.extraServices.map((es, idx) => (
                              <div key={idx} className="flex justify-between py-1 border-t border-slate-200 first:border-t-0">
                                <div>{es.extraServiceName}</div>
                                <div>{es.extraPrice?.toLocaleString()}원</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Fragment>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
