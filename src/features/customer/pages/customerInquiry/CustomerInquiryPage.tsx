// CustomerInquiryPage.tsx
import React, { Fragment, useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/constants";
import { searchCustomerInquiries } from "@/features/customer/api/CustomerInquiries";
import type { SearchCustomerInquiries as CustomerInquiryType } from "@/features/customer/types/CustomerInquiryType";
import Pagination from "@/shared/components/Pagination";

export const CustomerInquiryPage: React.FC = () => {
  const [fadeKey, setFadeKey] = useState(0);
  const [inquiries, setInquiries] = useState<CustomerInquiryType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const isMounted = useRef(false);

  const [searchParams, setSearchParams] = useState({
    keyword: "",
    inquiryType: "",
    dateRange: "", // This will store the selected date range (e.g., "1m", "3m", "6m")
    startDate: "",
    page: 0,
    size: DEFAULT_PAGE_SIZE,
  });

  // 날짜 표시를 위한 상태 추가
  const [startDateDisplay, setStartDateDisplay] = useState<string>('');
  // Helper function to format ISO date string to 'YYYY-MM-DD'
  const formatDateToYMD = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      const today = new Date();
      const convertedParams = {
        ...searchParams,
        endDate: getFormattedDate(today),
      };

      setLoading(true);
      try {
        const res = await searchCustomerInquiries(convertedParams);
        if (res?.body) {
          setInquiries(res.body.content);
          setTotal(res.body.page.totalElements);
          setFadeKey((prev) => prev + 1);
        }
      } catch (err) {
        setInquiries([]);
        setTotal(0);
      } finally {
        setLoading(false);
        isMounted.current = true;
      }
    };

    if (!isMounted.current) {
      fetchInquiries();
    }
  }, []);

  // 문의사항 조회 함수
  const loadInquiries = useCallback(async (paramsToSearch: typeof searchParams) => {
    if (!isMounted.current) return; // 초기 로딩 시에는 실행하지 않음

    setLoading(true);
    try {
      const calculatedStartDate = getDateRangeStart(paramsToSearch.dateRange);

      const convertedParams = {
        startDate: calculatedStartDate,
        page: paramsToSearch.page,
        size: paramsToSearch.size,
      };

      const res = await searchCustomerInquiries(convertedParams);

      if (res?.body) {
        setInquiries(res.body.content);
        setTotal(res.body.page.totalElements);
        setFadeKey((prev) => prev + 1);
      } else {
        setInquiries([]);
        setTotal(0);
      }
    } catch (err) {
      setInquiries([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // searchParams 변경 시에만 문의사항 재조회
  useEffect(() => {
    if (isMounted.current) {
      loadInquiries(searchParams);
    }
  }, [searchParams, loadInquiries]);

  /**
   * Helper function to format a Date object into 'YYYY-MM-DD' string
   * for API calls.
   */
  const getFormattedDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Helper function to format a Date object into 'YY년 MM월 DD일' string
   * for display purposes.
   */
  const getFormattedDateDisplay = (date: Date): string => {
    const year = date.getFullYear().toString().slice(2); // '25'
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // '06'
    const day = date.getDate().toString().padStart(2, '0'); // '09'
    return `${year}년 ${month}월 ${day}일`;
  };

  // Helper function to calculate start date based on date range string
  const getDateRangeStart = (range: string): string => {
    const today = new Date();
    let startDate = new Date();

    if (range === "1m") {
      startDate.setMonth(today.getMonth() - 1);
      startDate.setDate(today.getDate() + 1); // 현재 날짜로부터 1개월 전의 '다음 날' (ex. 6/9 -> 5/10)
    } else if (range === "3m") {
      startDate.setMonth(today.getMonth() - 3);
      startDate.setDate(today.getDate() + 1); // 현재 날짜로부터 3개월 전의 '다음 날' (ex. 6/9 -> 3/10)
    } else if (range === "6m") {
      startDate.setMonth(today.getMonth() - 6);
      startDate.setDate(today.getDate() + 1); // 현재 날짜로부터 6개월 전의 '다음 날' (ex. 6/9 -> 12/10)
    } else { // 초기 로딩 또는 아무 필터도 선택되지 않았을 때
      return ''; // 또는 API가 전체 기간을 조회하도록 빈 문자열 반환
    }
    return getFormattedDate(startDate) + "T00:00:00";
  };


  // Handle date range button click
  const handleDateRangeSearch = (range: string) => {
    const today = new Date();
    const newStartDate = new Date();

    if (range === "1m") {
      newStartDate.setMonth(today.getMonth() - 1);
      newStartDate.setDate(today.getDate() + 1); // '오늘' 포함을 위한 조정
    } else if (range === "3m") {
      newStartDate.setMonth(today.getMonth() - 3);
      newStartDate.setDate(today.getDate() + 1); // '오늘' 포함을 위한 조정
    } else if (range === "6m") {
      newStartDate.setMonth(today.getMonth() - 6);
      newStartDate.setDate(today.getDate() + 1); // '오늘' 포함을 위한 조정
    }

    setStartDateDisplay(getFormattedDateDisplay(newStartDate));

    setSearchParams((prev) => ({
      ...prev,
      dateRange: range,
      startDate: range ? getFormattedDate(newStartDate) + "T00:00:00" : "",
      page: 0,
    }));
  };


  // Helper to update specific search parameter
  const updateSearchParam = (key: string, value: any) => {
    setSearchParams((prev) => ({ ...prev, [key]: value }));
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    updateSearchParam("page", pageNumber);
  };


  return (
    <Fragment>
      <div className="flex self-stretch">
        <div className="flex-1 self-stretch inline-flex flex-col">
          {/* Header Section */}
          <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
            <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">문의사항</div>
            <Link
              to="/my/inquiries/new"
              className="h-10 px-4 bg-indigo-600 rounded-md flex justify-center items-center gap-2 cursor-pointer hover:bg-indigo-700 transition"
            >
              <span className="material-symbols-outlined text-white">add</span>
              <span className="text-white text-sm font-semibold font-['Inter'] leading-none">문의하기</span>
            </Link>
          </div>

          <div className="self-stretch p-6 flex flex-col gap-6">
            {/* Inquiry List Section */}
            <div className="self-stretch p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col gap-4">
              <div className="flex justify-end items-center">
                <div className="flex items-center gap-4">
                  {/* Display selected date range */}
                  {searchParams.dateRange !== "" && startDateDisplay && (
                    <div className="text-slate-600 text-sm font-medium">
                      {startDateDisplay}~
                    </div>
                  )}
                  <div className="relative">
                    <select
                      value={searchParams.dateRange}
                      onChange={(e) => handleDateRangeSearch(e.target.value)}
                      className="h-10 pr-10 pl-4 text-sm rounded-md border border-slate-200 text-slate-700 bg-white appearance-none"
                    >
                      <option value="">전체</option>
                      <option value="1m">최근 1개월</option>
                      <option value="3m">최근 3개월</option>
                      <option value="6m">최근 6개월</option>
                    </select>
                    <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div className="h-12 px-4 bg-slate-50 border-b border-slate-200 flex items-center">
                <div className="w-[20%] text-center text-sm font-semibold text-slate-700"> 
                  문의 유형
                </div>
                <div className="w-[45%] text-center text-sm font-semibold text-slate-700">
                  제목
                </div>
                <div className="w-[20%] text-center text-sm font-semibold text-slate-700">
                  등록일
                </div>
                <div className="w-[15%] text-center text-sm font-semibold text-slate-700">
                  상태
                </div>
              </div>

              <div key={fadeKey}>
                {inquiries.length === 0 && !loading ? (
                  <div className="h-12 px-4 border-b border-slate-200 flex items-center justify-center text-sm text-slate-500">
                    조회된 문의사항이 없습니다.
                  </div>
                ) : (
                  inquiries.map((inquiry) => (
                    <Link
                      key={inquiry.inquiryId}
                      to={`/my/inquiries/${inquiry.inquiryId}`}
                      className="h-12 px-4 border-b border-slate-200 flex items-center hover:bg-slate-50 cursor-pointer transition"
                    >
                      <div className="w-[20%] text-center text-sm font-medium text-slate-700">
                        {inquiry.categoryName || "기타"}
                      </div>
                      <div className="w-[45%] text-center text-sm font-medium text-indigo-600">
                        {inquiry.title}
                      </div>
                      <div className="w-[20%] text-center text-sm font-medium text-slate-700">
                        {formatDateToYMD(inquiry.createdAt)}
                      </div>
                      <div className="w-[15%] flex justify-center items-center">
                        <span
                          className={`px-3 py-1 text-sm rounded-2xl font-normal ${
                            inquiry.isReplied
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {inquiry.isReplied ? "답변완료" : "처리중"}
                        </span>
                      </div>
                    </Link>
                  ))
                )}

                {loading && inquiries.length === 0 && (
                  <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-center text-sm text-slate-500">
                    로딩 중...
                  </div>
                )}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={searchParams.page}
                totalItems={total}
                pageSize={searchParams.size}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};