import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ManagerReservationSummary as ManagerReservationType } from "../types/ManagerReservationType";
import { formatTimeRange } from "../../../shared/utils/format";
import { StatusBadge } from "../../../shared/components";
import { Pagination } from "../../../shared/components";
import { getReservationStatusStyle } from "../utils/ManagerReservationStauts";
import ManagerReservationListMobile from "@/features/manager/components/ManagerReservationListMobile";
import { PortalDropdown } from "@/shared/components/PortalDropdown";

interface StatusOption {
  value: string;
  label: string;
}

interface ManagerReservationTableProps {
  reservations: ManagerReservationType[];
  total: number;
  fadeKey: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  statuses: StatusOption[];
  selectedStatuses: string[];
  onStatusFilterChange: (statuses: string[]) => void;
  selectedCheckedIn: string[];
  onCheckedInFilterChange: (values: string[]) => void;
  selectedCheckedOut: string[];
  onCheckedOutFilterChange: (values: string[]) => void;
  selectedReviewed: string[];
  onReviewedFilterChange: (values: string[]) => void;
  selectedDateRange: string;
  onDateRangeChange: (dateRange: string) => void;
  className?: string;
}

export const ManagerReservationTable = ({
  reservations,
  total,
  fadeKey,
  page,
  totalPages,
  onPageChange,
  statuses,
  selectedStatuses,
  onStatusFilterChange,
  selectedCheckedIn,
  onCheckedInFilterChange,
  selectedCheckedOut,
  onCheckedOutFilterChange,
  selectedReviewed,
  onReviewedFilterChange,
  selectedDateRange,
  onDateRangeChange,
  className = ""
}: ManagerReservationTableProps) => {
  const navigate = useNavigate();
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCheckedInDropdownOpen, setIsCheckedInDropdownOpen] = useState(false);
  const [isCheckedOutDropdownOpen, setIsCheckedOutDropdownOpen] = useState(false);
  const [isReviewedDropdownOpen, setIsReviewedDropdownOpen] = useState(false);
  const [isDateRangeDropdownOpen, setIsDateRangeDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const checkedInDropdownRef = useRef<HTMLDivElement>(null);
  const checkedOutDropdownRef = useRef<HTMLDivElement>(null);
  const reviewedDropdownRef = useRef<HTMLDivElement>(null);
  const dateRangeDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const checkedInDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const checkedOutDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const reviewedDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dateRangeDropdownButtonRef = useRef<HTMLButtonElement>(null);

  const checkOptions = [
    { value: "true", label: "완료" },
    { value: "false", label: "대기" },
  ];

  const dateRangeOptions = [
    { value: "all", label: "전체" },
    { value: "today", label: "오늘" },
    { value: "thisWeek", label: "이번 주" },
    { value: "thisMonth", label: "이번 달" },
    { value: "last7Days", label: "최근 7일" },
    { value: "last30Days", label: "최근 30일" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 예약 상태 드롭다운
      if (
        isStatusDropdownOpen &&
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node) &&
        statusDropdownButtonRef.current &&
        !statusDropdownButtonRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
      // 체크인 드롭다운
      if (
        isCheckedInDropdownOpen &&
        checkedInDropdownRef.current &&
        !checkedInDropdownRef.current.contains(event.target as Node) &&
        checkedInDropdownButtonRef.current &&
        !checkedInDropdownButtonRef.current.contains(event.target as Node)
      ) {
        setIsCheckedInDropdownOpen(false);
      }
      // 체크아웃 드롭다운
      if (
        isCheckedOutDropdownOpen &&
        checkedOutDropdownRef.current &&
        !checkedOutDropdownRef.current.contains(event.target as Node) &&
        checkedOutDropdownButtonRef.current &&
        !checkedOutDropdownButtonRef.current.contains(event.target as Node)
      ) {
        setIsCheckedOutDropdownOpen(false);
      }
      // 리뷰작성 드롭다운
      if (
        isReviewedDropdownOpen &&
        reviewedDropdownRef.current &&
        !reviewedDropdownRef.current.contains(event.target as Node) &&
        reviewedDropdownButtonRef.current &&
        !reviewedDropdownButtonRef.current.contains(event.target as Node)
      ) {
        setIsReviewedDropdownOpen(false);
      }
      // 날짜 드롭다운
      if (
        isDateRangeDropdownOpen &&
        dateRangeDropdownRef.current &&
        !dateRangeDropdownRef.current.contains(event.target as Node) &&
        dateRangeDropdownButtonRef.current &&
        !dateRangeDropdownButtonRef.current.contains(event.target as Node)
      ) {
        setIsDateRangeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isStatusDropdownOpen,
    isCheckedInDropdownOpen,
    isCheckedOutDropdownOpen,
    isReviewedDropdownOpen,
    isDateRangeDropdownOpen,
  ]);

  const handleToggleAll = () => {
    if (selectedStatuses.length === statuses.length) {
      onStatusFilterChange([]);
    } else {
      onStatusFilterChange(statuses.map((status) => status.value));
    }
    setTimeout(() => setIsStatusDropdownOpen(false), 100);
  };

  const handleStatusToggle = (value: string) => {
    if (selectedStatuses.includes(value)) {
      onStatusFilterChange(selectedStatuses.filter((s) => s !== value));
    } else {
      onStatusFilterChange([...selectedStatuses, value]);
    }
  };

  const handleCheckedInToggleAll = () => {
    if (selectedCheckedIn.length === checkOptions.length) {
      onCheckedInFilterChange([]);
    } else {
      onCheckedInFilterChange(checkOptions.map((option) => option.value));
    }
    setTimeout(() => setIsCheckedInDropdownOpen(false), 100);
  };

  const handleCheckedInToggle = (value: string) => {
    if (selectedCheckedIn.includes(value)) {
      onCheckedInFilterChange(selectedCheckedIn.filter((s) => s !== value));
    } else {
      onCheckedInFilterChange([...selectedCheckedIn, value]);
    }
  };

  const handleCheckedOutToggleAll = () => {
    if (selectedCheckedOut.length === checkOptions.length) {
      onCheckedOutFilterChange([]);
    } else {
      onCheckedOutFilterChange(checkOptions.map((option) => option.value));
    }
    setTimeout(() => setIsCheckedOutDropdownOpen(false), 100);
  };

  const handleCheckedOutToggle = (value: string) => {
    if (selectedCheckedOut.includes(value)) {
      onCheckedOutFilterChange(selectedCheckedOut.filter((s) => s !== value));
    } else {
      onCheckedOutFilterChange([...selectedCheckedOut, value]);
    }
  };

  const handleReviewedToggleAll = () => {
    if (selectedReviewed.length === checkOptions.length) {
      onReviewedFilterChange([]);
    } else {
      onReviewedFilterChange(checkOptions.map((option) => option.value));
    }
    setTimeout(() => setIsReviewedDropdownOpen(false), 100);
  };

  const handleReviewedToggle = (value: string) => {
    if (selectedReviewed.includes(value)) {
      onReviewedFilterChange(selectedReviewed.filter((s) => s !== value));
    } else {
      onReviewedFilterChange([...selectedReviewed, value]);
    }
  };

  const handleDateRangeSelect = (preset: string) => {
    onDateRangeChange(preset);
    setIsDateRangeDropdownOpen(false);
  };

  const renderDateRangeDropdown = () => (
    <div className="relative">
      <button
        ref={dateRangeDropdownButtonRef}
        onClick={() => setIsDateRangeDropdownOpen((open) => !open)}
        className="flex items-center justify-center gap-1 text-base font-medium text-slate-700 transition-colors hover:text-slate-900">
        청소 요청 날짜
        <svg
          className={`h-4 w-4 transition-transform ${
            isDateRangeDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <PortalDropdown
        anchorRef={
          dateRangeDropdownButtonRef as unknown as React.RefObject<Element>
        }
        open={isDateRangeDropdownOpen}
      >
        <div
          ref={dateRangeDropdownRef}
          className="absolute top-0 left-0 z-[9999] mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
        >
          <div className="max-h-48 overflow-y-auto p-3">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDateRangeSelect(option.value)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  selectedDateRange === option.value
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </PortalDropdown>
    </div>
  );

  return (
    <div className={`h-full w-full flex-1 min-w-0 rounded-xl bg-white p-6 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col ${className}`}>
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">예약 목록</h3>
        <span className="text-sm text-slate-500">총 {total}건</span>
      </div>

      {/* 모바일: 카드형 리스트 */}
      <div className="block md:hidden">
        <ManagerReservationListMobile
          reservations={reservations}
          onClickItem={reservationId => navigate(`/managers/reservations/${reservationId}`)}
        />
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={onPageChange}
          />
        </div>
      </div>

      {/* 데스크탑/태블릿: 테이블 */}
      <div className="hidden md:block w-full max-w-full min-w-0 overflow-x-auto">
        <div className="w-full max-w-full min-w-0">
          <table className="min-w-[900px] w-full rounded-xl shadow-md overflow-hidden">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="py-3 px-4 text-left font-semibold text-base text-slate-700 min-w-[80px]">예약 ID</th>
                <th className="py-3 px-4 text-center font-semibold text-base text-slate-700 min-w-[120px]">
                  <div className="relative">{renderDateRangeDropdown()}</div>
                </th>
                <th className="py-3 px-4 text-center font-semibold text-base text-slate-700 min-w-[120px]">요청 시간</th>
                <th className="py-3 px-4 text-center font-semibold text-base text-slate-700 min-w-[100px]">고객명</th>
                <th className="py-3 px-4 text-center font-semibold text-base text-slate-700 min-w-[180px]">고객 주소</th>
                <th className="py-3 px-4 text-center font-semibold text-base text-slate-700 min-w-[120px]">서비스명</th>
                <th className="py-3 px-4 text-center font-semibold text-base text-slate-700 min-w-[100px]">
                  <div className="relative">
                    <button
                      ref={statusDropdownButtonRef}
                      onClick={() => setIsStatusDropdownOpen((open) => !open)}
                      className="flex items-center justify-center gap-1 text-base font-medium text-slate-700 transition-colors hover:text-slate-900"
                    >
                      예약 상태
                      <svg
                        className={`h-4 w-4 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <PortalDropdown anchorRef={statusDropdownButtonRef as unknown as React.RefObject<Element>} open={isStatusDropdownOpen}>
                      <div
                        ref={statusDropdownRef}
                        className="absolute top-0 left-0 z-[9999] mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
                      >
                        <div className="border-b border-slate-200 p-3">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedStatuses.length === statuses.length}
                              onChange={handleToggleAll}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              전체 선택
                            </span>
                          </label>
                        </div>
                        <div className="max-h-48 overflow-y-auto p-3">
                          {statuses.map((option) => (
                            <label
                              key={option.value}
                              className="mb-2 flex cursor-pointer items-center gap-2 last:mb-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedStatuses.includes(option.value)}
                                onChange={() => handleStatusToggle(option.value)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </PortalDropdown>
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-semibold text-base text-slate-700 min-w-[100px]">
                  <div className="relative">
                    <button
                      ref={checkedInDropdownButtonRef}
                      onClick={() => setIsCheckedInDropdownOpen((open) => !open)}
                      className="flex items-center justify-center gap-1 text-base font-medium text-slate-700 transition-colors hover:text-slate-900"
                    >
                      체크인
                      <svg
                        className={`h-4 w-4 transition-transform ${isCheckedInDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <PortalDropdown anchorRef={checkedInDropdownButtonRef as unknown as React.RefObject<Element>} open={isCheckedInDropdownOpen}>
                      <div
                        ref={checkedInDropdownRef}
                        className="absolute top-0 left-0 z-[9999] mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
                      >
                        <div className="border-b border-slate-200 p-3">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedCheckedIn.length === checkOptions.length}
                              onChange={handleCheckedInToggleAll}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              전체 선택
                            </span>
                          </label>
                        </div>
                        <div className="max-h-48 overflow-y-auto p-3">
                          {checkOptions.map((option) => (
                            <label
                              key={option.value}
                              className="mb-2 flex cursor-pointer items-center gap-2 last:mb-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedCheckedIn.includes(option.value)}
                                onChange={() => handleCheckedInToggle(option.value)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </PortalDropdown>
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-semibold text-base text-slate-700 min-w-[100px]">
                  <div className="relative">
                    <button
                      ref={checkedOutDropdownButtonRef}
                      onClick={() => setIsCheckedOutDropdownOpen((open) => !open)}
                      className="flex items-center justify-center gap-1 text-base font-medium text-slate-700 transition-colors hover:text-slate-900"
                    >
                      체크아웃
                      <svg
                        className={`h-4 w-4 transition-transform ${isCheckedOutDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <PortalDropdown anchorRef={checkedOutDropdownButtonRef as unknown as React.RefObject<Element>} open={isCheckedOutDropdownOpen}>
                      <div
                        ref={checkedOutDropdownRef}
                        className="absolute top-0 left-0 z-[9999] mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
                      >
                        <div className="border-b border-slate-200 p-3">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedCheckedOut.length === checkOptions.length}
                              onChange={handleCheckedOutToggleAll}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              전체 선택
                            </span>
                          </label>
                        </div>
                        <div className="max-h-48 overflow-y-auto p-3">
                          {checkOptions.map((option) => (
                            <label
                              key={option.value}
                              className="mb-2 flex cursor-pointer items-center gap-2 last:mb-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedCheckedOut.includes(option.value)}
                                onChange={() => handleCheckedOutToggle(option.value)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </PortalDropdown>
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-semibold text-base text-slate-700 min-w-[100px]">
                  <div className="relative">
                    <button
                      ref={reviewedDropdownButtonRef}
                      onClick={() => setIsReviewedDropdownOpen((open) => !open)}
                      className="flex items-center justify-center gap-1 text-base font-medium text-slate-700 transition-colors hover:text-slate-900"
                    >
                      리뷰작성
                      <svg
                        className={`h-4 w-4 transition-transform ${isReviewedDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <PortalDropdown anchorRef={reviewedDropdownButtonRef as unknown as React.RefObject<Element>} open={isReviewedDropdownOpen}>
                      <div
                        ref={reviewedDropdownRef}
                        className="absolute top-0 left-0 z-[9999] mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
                      >
                        <div className="border-b border-slate-200 p-3">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedReviewed.length === checkOptions.length}
                              onChange={handleReviewedToggleAll}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              전체 선택
                            </span>
                          </label>
                        </div>
                        <div className="max-h-48 overflow-y-auto p-3">
                          {checkOptions.map((option) => (
                            <label
                              key={option.value}
                              className="mb-2 flex cursor-pointer items-center gap-2 last:mb-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedReviewed.includes(option.value)}
                                onChange={() => handleReviewedToggle(option.value)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </PortalDropdown>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody key={fadeKey}>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-20 text-center text-slate-400 whitespace-nowrap overflow-hidden truncate">
                    조회된 예약이 없습니다.
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr
                    key={reservation.reservationId}
                    className="border-b border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/managers/reservations/${reservation.reservationId}`)}
                  >
                    <td className="py-3 px-4 text-sm text-slate-700 truncate min-w-[80px]">
                      <Link
                        to={`/managers/reservations/${reservation.reservationId}`}
                        className="font-medium text-indigo-600 hover:text-indigo-800 truncate block">
                        {reservation.reservationId || "-"}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700 truncate min-w-[120px]">
                      {reservation.requestDate || "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700 truncate min-w-[120px]">
                      {reservation.startTime && reservation.turnaround
                        ? formatTimeRange(
                            reservation.startTime,
                            reservation.turnaround
                          )
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700 truncate min-w-[100px]">
                      <div className="truncate block" title={reservation.customerName || "-"}>
                        {reservation.customerName || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700 truncate min-w-[180px]">
                      <div className="truncate block" title={reservation.customerAddress || "-"}>
                        {reservation.customerAddress || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700 truncate min-w-[120px]">
                      {reservation.serviceName || "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-sm whitespace-nowrap overflow-hidden truncate min-w-[100px]">
                      {reservation.statusName ? (
                        <div
                          className={`inline-flex h-7 items-center justify-center rounded-2xl px-3 ${
                            getReservationStatusStyle(reservation.status).bgColor
                          }`}>
                          <div
                            className={`font-['Inter'] text-sm leading-none font-medium ${
                              getReservationStatusStyle(reservation.status).textColor
                            }`}>
                            {reservation.statusName}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-sm whitespace-nowrap overflow-hidden truncate min-w-[100px]">
                      <StatusBadge
                        value={reservation.isCheckedIn}
                        trueText="완료"
                        falseText="대기"
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-sm whitespace-nowrap overflow-hidden truncate min-w-[100px]">
                      <StatusBadge
                        value={reservation.isCheckedOut}
                        trueText="완료"
                        falseText="대기"
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-sm whitespace-nowrap overflow-hidden truncate min-w-[100px]">
                      <StatusBadge
                        value={reservation.isReviewed}
                        trueText="완료"
                        falseText="대기"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerReservationTable;
