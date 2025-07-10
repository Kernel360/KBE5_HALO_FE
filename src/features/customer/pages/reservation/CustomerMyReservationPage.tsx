// src/pages/CustomerMyReservationPage.tsx

import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useRef
} from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getCustomerReservations } from '@/features/customer/api/CustomerReservation'
import type {
  CustomerReservationListRspType,
  ReservationStatus
} from '@/features/customer/types/CustomerReservationType'
import ReservationCard from '@/features/customer/components/ReservationCard' // ReservationCard 컴포넌트 경로를 맞게 수정해주세요
import Pagination from '@/shared/components/Pagination'

export const CustomerMyReservationPage: React.FC = () => {
  const navigate = useNavigate()
  const [urlParams] = useSearchParams()
  const [fadeKey, setFadeKey] = useState(0)
  // 문의 대신 예약 데이터 상태
  const [reservations, setReservations] = useState<
    CustomerReservationListRspType[]
  >([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const isMounted = useRef(false)

  // 예약 조회에 필요한 파라미터로 변경
  const [searchParams, setSearchParams] = useState({
    reservationStatus: [] as ReservationStatus[],
    fromRequestDate: '',
    toRequestDate: '',
    managerName: '',
    page: 0,
    size: 5
  })

  // URL 파라미터에서 검색 조건 추출
  useEffect(() => {
    const statuses = urlParams.getAll('status') as ReservationStatus[]
    const fromRequestDate = urlParams.get('fromRequestDate') || ''
    const toRequestDate = urlParams.get('toRequestDate') || ''
    const managerName = urlParams.get('managerName') || ''

    setSearchParams(prev => ({
      ...prev,
      reservationStatus: statuses,
      fromRequestDate,
      toRequestDate,
      managerName,
      page: 0
    }))
  }, [urlParams])

  // 초기 로딩 시 예약 내역 조회
  useEffect(() => {
    const fetchInitialReservations = async () => {
      setLoading(true)
      try {
        const res = await getCustomerReservations(
          {
            reservationStatus:
              searchParams.reservationStatus &&
              searchParams.reservationStatus.length > 0
                ? searchParams.reservationStatus
                : undefined,
            fromRequestDate: searchParams.fromRequestDate || undefined,
            toRequestDate: searchParams.toRequestDate || undefined,
            managerName: searchParams.managerName || undefined
          },
          {
            page: searchParams.page,
            size: searchParams.size
          }
        )

        if (res?.body) {
          setReservations(res.body.content)
          setTotal(res.body.page.totalElements)
          setFadeKey(prev => prev + 1)
        }
      } catch {
        setReservations([])
        setTotal(0)
      } finally {
        setLoading(false)
        isMounted.current = true
      }
    }

    if (!isMounted.current) {
      fetchInitialReservations()
    }
  }, [searchParams])

  // 예약 내역 조회 함수 (searchParams 변경 시 호출됨)
  const loadReservations = useCallback(
    async (paramsToSearch: typeof searchParams) => {
      // isMounted.current가 true일 때만 실행 (초기 로딩 이후에만)
      if (
        !isMounted.current &&
        !paramsToSearch.reservationStatus &&
        paramsToSearch.page === 0
      ) {
        return
      }

      setLoading(true)
      try {
        const res = await getCustomerReservations(
          {
            reservationStatus:
              paramsToSearch.reservationStatus &&
              paramsToSearch.reservationStatus.length > 0
                ? paramsToSearch.reservationStatus
                : undefined,
            fromRequestDate: paramsToSearch.fromRequestDate || undefined,
            toRequestDate: paramsToSearch.toRequestDate || undefined,
            managerName: paramsToSearch.managerName || undefined
          },
          {
            page: paramsToSearch.page,
            size: paramsToSearch.size
          }
        )

        if (res?.body) {
          setReservations(res.body.content)
          setTotal(res.body.page.totalElements)
          setFadeKey(prev => prev + 1)
        } else {
          setReservations([])
          setTotal(0)
        }
      } catch (err) {
        console.error('Failed to fetch reservations:', err)
        setReservations([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // searchParams 변경 시에만 예약 내역 재조회
  useEffect(() => {
    if (isMounted.current) {
      loadReservations(searchParams)
    }
  }, [searchParams, loadReservations])

  // Helper to update specific search parameter
  const updateSearchParam = (key: string, value: unknown) => {
    setSearchParams(prev => ({ ...prev, [key]: value }))
  }

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    updateSearchParam('page', pageNumber)
  }

  return (
    <Fragment>
      <div className="flex self-stretch">
        <div className="inline-flex flex-1 flex-col self-stretch">
          {/* Header Section */}
          <div className="inline-flex h-16 items-center justify-between self-stretch border-b border-gray-200 bg-white px-6">
            <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
              나의 예약 내역
            </div>
          </div>

          <div className="flex flex-col gap-6 self-stretch p-6">
            {/* Reservation List Section */}
            <div className="flex flex-col gap-4 self-stretch rounded-lg bg-white p-6">
              {/* 예약 카드 반복 렌더링 부분 */}
              <div key={fadeKey}>
                {loading ? (
                  <div className="flex h-16 items-center justify-center border-b border-slate-200 px-4 text-sm text-slate-500">
                    예약 내역 로딩 중...
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="flex h-12 items-center justify-center border-b border-slate-200 px-4 text-sm text-slate-500">
                    조회된 예약 내역이 없습니다.
                  </div>
                ) : (
                  reservations.map(reservation => (
                    <ReservationCard
                      key={reservation.reservationId}
                      reservation={reservation}
                      onWriteReview={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        navigate(`/my/reviews/${reservation.reservationId}`, {
                          state: {
                            fromReservation: true,
                            serviceName: reservation.serviceName,
                            managerName: reservation.managerName
                          }
                        })
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
  )
}
