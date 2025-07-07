// src/pages/CustomerMyReservationPage.tsx

import React, { Fragment, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerReservations} from "@/features/customer/api/CustomerReservation"; 
import type { CustomerReservationListRspType, ReservationStatus} from "@/features/customer/types/CustomerReservationType"; 
import ReservationCard from "@/features/customer/components/ReservationCard"; // ReservationCard 컴포넌트 경로를 맞게 수정해주세요
import { getFormattedDate } from "@/shared/utils/dateUtils"; // 날짜 유틸 함수를 사용한다고 가정
import { REVIEW_PAGE_SIZE } from "@/shared/constants/constants";
import Pagination from "@/shared/components/Pagination";


export const CustomerMyReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const [fadeKey, setFadeKey] = useState(0);
  // 문의 대신 예약 데이터 상태
  const [reservations, setReservations] = useState<CustomerReservationListRspType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const isMounted = useRef(false);

  // 예약 조회에 필요한 파라미터로 변경
  const [searchParams, setSearchParams] = useState({
    reservationStatus: "" as ReservationStatus,
    page: 0,
    size: REVIEW_PAGE_SIZE,
  });


  // 초기 로딩 시 예약 내역 조회 (오늘 날짜를 endDate로 고정)
  useEffect(() => {
    const fetchInitialReservations = async () => {
      const today = new Date();
      const todayFormatted = getFormattedDate(today);

      setSearchParams((prev) => ({
        ...prev,
        endDate: todayFormatted, // 초기 endDate 설정
      }));

      setLoading(true);
      try {
        const res = await getCustomerReservations({
          status: searchParams.reservationStatus || undefined,
          page: searchParams.page
        });

        if (res?.body) {
          setReservations(res.body.content);
          setTotal(res.body.page.totalElements);
          setFadeKey((prev) => prev + 1);
        }
      } catch (err) {
        setReservations([]);
        setTotal(0);
      } finally {
        setLoading(false);
        isMounted.current = true; // 컴포넌트가 마운트되었음을 표시
      }
    };

    if (!isMounted.current) { // 이펙트가 처음 실행될 때만 초기 로딩 수행
      fetchInitialReservations();
    }
  }, []); // 빈 배열은 컴포넌트 마운트 시 한 번만 실행

  // 예약 내역 조회 함수 (searchParams 변경 시 호출됨)
  const loadReservations = useCallback(async (paramsToSearch: typeof searchParams) => {
    // isMounted.current가 true일 때만 실행 (초기 로딩 이후에만)
    if (!isMounted.current && (!paramsToSearch.reservationStatus && paramsToSearch.page === 0)) {
        return;
    }

    setLoading(true);
    try {
      const res = await getCustomerReservations({
        status: paramsToSearch.reservationStatus || undefined,
        page: paramsToSearch.page
      });

      if (res?.body) {
        setReservations(res.body.content);
        setTotal(res.body.page.totalElements);
        setFadeKey((prev) => prev + 1);
      } else {
        setReservations([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
      setReservations([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);


  // searchParams 변경 시에만 예약 내역 재조회
  useEffect(() => {
    // isMounted.current가 true일 때만 loadReservations 호출 (초기 로딩 이후)
    if (isMounted.current) {
        loadReservations(searchParams);
    }
  }, [searchParams, loadReservations]);

  // Handle reservation status filter change
  const handleReservationStatusFilter = (status: string) => {
    setSearchParams((prev) => ({
      ...prev,
      reservationStatus: status as ReservationStatus, // 상태 필터 상태 저장
      page: 0, // 필터 변경 시 첫 페이지로 이동
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
            <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">나의 예약 내역</div>
          </div>

          <div className="self-stretch p-6 flex flex-col gap-6">
            {/* Reservation List Section */}
            <div className="self-stretch p-6 bg-white rounded-lg flex flex-col gap-4">
              <div className="flex justify-end items-center">
                <div className="flex items-center gap-4">
                  
                  {/* 예약 상태 드롭다운 */}
                  <div className="relative">
                    <select
                      value={searchParams.reservationStatus}
                      onChange={(e) => handleReservationStatusFilter(e.target.value)}
                      className="h-10 pr-10 pl-4 text-sm rounded-md border border-slate-200 text-slate-700 bg-white appearance-none"
                    >
                      <option value="">전체</option>
                      <option value="REQUESTED">예약 요청</option>
                      <option value="CONFIRMED">예약 완료</option>
                      <option value="IN_PROGRESS">서비스 진행 중</option>
                      <option value="COMPLETED">방문 완료</option>
                      <option value="CANCELED">예약 취소</option>
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

              {/* 예약 카드 반복 렌더링 부분 */}
              <div key={fadeKey}>
                {loading ? (
                  <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-center text-sm text-slate-500">
                    예약 내역 로딩 중...
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="h-12 px-4 border-b border-slate-200 flex items-center justify-center text-sm text-slate-500">
                    조회된 예약 내역이 없습니다.
                  </div>
                ) : (
                  reservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.reservationId}
                      reservation={reservation}
                      onWriteReview={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/my/reviews/${reservation.reservationId}`, {
                          state: { 
                            fromReservation: true,
                            serviceName: reservation.serviceName,
                            managerName: reservation.managerName
                          }
                        });
                      }}
                    />
                  ))
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