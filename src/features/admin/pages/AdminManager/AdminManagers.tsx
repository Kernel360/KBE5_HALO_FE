import { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/constants";
import { fetchAdminManagers, approveManager, rejectManager, approveTerminateManager } from "@/features/admin/api/adminManager";
import type { AdminManager } from "@/features/admin/types/AdminManagerType";
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader';
import { AdminTabs } from '@/features/admin/components/AdminTabs';
import { AdminTable } from '@/features/admin/components/AdminTable';
import type { AdminTableColumn } from '@/features/admin/components/AdminTable';
import { AdminPagination } from '@/features/admin/components/AdminPagination';
import { StatusBadge } from '@/features/admin/components/StatusBadge';
import { AdminSearchForm } from '@/features/admin/components/AdminSearchForm';
import { TableSection } from '@/features/admin/components/TableSection';

export const AdminManagers = () => {
  const location = useLocation();
  const initialTab = location.state?.tab === 'applied' ? 'applied' : 'all';
  const [activeTab, setActiveTab] = useState<'all' | 'applied' | 'termination'>(initialTab);
  const [nameKeyword, setNameKeyword] = useState('');
  const [phoneKeyword, setPhoneKeyword] = useState('');
  const [emailKeyword, setEmailKeyword] = useState('');
  const [statusKeyword, setStatusKeyword] = useState('');
  const [ratingMinKeyword, setRatingMinKeyword] = useState('');
  const [ratingMaxKeyword, setRatingMaxKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [managers, setManagers] = useState<AdminManager[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    nameKeyword: '',
    phoneKeyword: '',
    emailKeyword: '',
    statusKeyword: '',
    ratingMinKeyword: '',
    ratingMaxKeyword: '',
  });
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ratingSort, setRatingSort] = useState<'asc' | 'desc' | null>(null);
  const [reservationSort, setReservationSort] = useState<'asc' | 'desc' | null>(null);
  const [reviewSort, setReviewSort] = useState<'asc' | 'desc' | null>(null);
  const [openStatusDropdowns, setOpenStatusDropdowns] = useState<{ [managerId: number]: boolean }>({});
  const [selectedContractStatuses, setSelectedContractStatuses] = useState<string[]>(['APPROVED']);
  const [contractStatusDropdownOpen, setContractStatusDropdownOpen] = useState(false);
  const contractStatusDropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // 서버 정렬 파라미터 생성
  const getSortParam = () => {
    if (ratingSort) return `averageRating,${ratingSort}`;
    if (reservationSort) return `reservationCount,${reservationSort}`;
    if (reviewSort) return `reviewCount,${reviewSort}`;
    return undefined;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      const contractStatusParam = selectedContractStatuses.length > 0 ? selectedContractStatuses : undefined;
      if (activeTab === 'applied') {
        // 매니저 신청 내역
        const mappedParams: any = {
          userName: searchParams.nameKeyword || undefined,
          phone: searchParams.phoneKeyword || undefined,
          email: searchParams.emailKeyword || undefined,
          status: searchParams.statusKeyword || undefined,
          minRating: searchParams.ratingMinKeyword ? Number(searchParams.ratingMinKeyword) : undefined,
          maxRating: searchParams.ratingMaxKeyword ? Number(searchParams.ratingMaxKeyword) : undefined,
          page: page,
          size: DEFAULT_PAGE_SIZE,
          contractStatus: contractStatusParam,
          sort: getSortParam(),
        };
        res = await fetchAdminManagers(mappedParams);
        setManagers(res.content || res || []);
        setTotalPages(res.totalPages || 1);
      } else if (activeTab === 'termination') {
        // 매니저 해지 신청 내역
        const mappedParams: any = {
          userName: searchParams.nameKeyword || undefined,
          phone: searchParams.phoneKeyword || undefined,
          email: searchParams.emailKeyword || undefined,
          status: searchParams.statusKeyword || undefined,
          minRating: searchParams.ratingMinKeyword ? Number(searchParams.ratingMinKeyword) : undefined,
          maxRating: searchParams.ratingMaxKeyword ? Number(searchParams.ratingMaxKeyword) : undefined,
          page: page,
          size: DEFAULT_PAGE_SIZE,
          contractStatus: contractStatusParam,
          sort: getSortParam(),
        };
        res = await fetchAdminManagers(mappedParams);
        setManagers(res.content || res || []);
        setTotalPages(res.totalPages || 1);
      } else {
        // 전체 매니저
        const mappedParams: any = {
          userName: searchParams.nameKeyword || undefined,
          phone: searchParams.phoneKeyword || undefined,
          email: searchParams.emailKeyword || undefined,
          status: searchParams.statusKeyword || undefined,
          minRating: searchParams.ratingMinKeyword ? Number(searchParams.ratingMinKeyword) : undefined,
          maxRating: searchParams.ratingMaxKeyword ? Number(searchParams.ratingMaxKeyword) : undefined,
          page: page,
          size: DEFAULT_PAGE_SIZE,
          contractStatus: contractStatusParam,
          sort: getSortParam(),
        };
        res = await fetchAdminManagers(mappedParams);
        setManagers(res.content || res || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err: any) {
      setError(err.message || '매니저 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, page, searchParams, ratingSort, reservationSort, reviewSort, selectedContractStatuses]);

  // 탭 변경 시 검색 조건 및 searchParams, 계약상태 초기화
  useEffect(() => {
    setNameKeyword("");
    setPhoneKeyword("");
    setEmailKeyword("");
    setStatusKeyword("");
    setRatingMinKeyword("");
    setRatingMaxKeyword("");
    setPage(0);
    setSearchParams({
      nameKeyword: '',
      phoneKeyword: '',
      emailKeyword: '',
      statusKeyword: '',
      ratingMinKeyword: '',
      ratingMaxKeyword: '',
    });
    // 탭에 따라 contractStatus 초기값 다르게
    if (activeTab === 'applied') {
      setSelectedContractStatuses(['PENDING']);
    } else if (activeTab === 'termination') {
      setSelectedContractStatuses(['TERMINATION_PENDING']);
    } else {
      setSelectedContractStatuses(['APPROVED']);
    }
  }, [activeTab]);

  // 필터링된 매니저 목록 (정렬은 서버에서만 처리)
  const filteredManagers =
    statusFilter === "ALL"
      ? managers
      : managers.filter(manager => {
          const status = manager.userstatus;
          if (statusFilter === "REPORTED") {
            // 신고 상태는 별도 처리 필요시 여기에 추가
            return status === "REPORTED";
          }
          return status === statusFilter;
        });

  // 계약 상태 변경 핸들러
  const handleStatusChange = async (managerId: number, newStatus: string) => {
    try {
      if (newStatus === 'APPROVED') {
        await approveManager(managerId);
      } else if (newStatus === 'REJECTED') {
        await rejectManager(managerId);
      } else if (newStatus === 'TERMINATION_PENDING' || newStatus === 'TERMINATED') {
        await approveTerminateManager(managerId);
      }
      setOpenStatusDropdowns(prev => ({ ...prev, [managerId]: false }));
      fetchData();
    } catch (err: any) {
      alert(err.message || '계약 상태 변경에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (!contractStatusDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        contractStatusDropdownRef.current &&
        !contractStatusDropdownRef.current.contains(e.target as Node)
      ) {
        setContractStatusDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [contractStatusDropdownOpen]);

  const CONTRACT_STATUS_OPTIONS = [
    { value: "APPROVED", label: "활성" },
    { value: "REJECTED", label: "승인거절" },
    { value: "TERMINATED", label: "계약해지" },
  ];

  const handleContractStatusCheckbox = (status: string) => {
    setSelectedContractStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setPage(0);
  };

  const toggleContractStatusDropdown = () => {
    setContractStatusDropdownOpen(open => !open);
  };

  return (
    <Fragment>
      <div className="w-full flex flex-col">
        <AdminPageHeader title="매니저 정보 관리" />
        <div className="p-6 flex flex-col gap-6">
          {/* 탭 + 검색 폼 한 줄 배치 */}
          <div className="w-full flex flex-row items-center justify-between mb-2 gap-2">
            <AdminTabs
              tabs={[
                { key: 'all', label: '전체 매니저' },
                { key: 'applied', label: '매니저 신청 내역' },
                { key: 'termination', label: '매니저 해지 신청 내역' },
              ]}
              activeKey={activeTab}
              onTabChange={key => setActiveTab(key as typeof activeTab)}
              className="w-fit min-w-0"
            />
            <div className="flex-shrink-0">
              <AdminSearchForm
                fields={[
                  { type: "select", name: "type", options: [
                    { value: "name", label: "이름" },
                    { value: "phone", label: "연락처" },
                    { value: "email", label: "이메일" }
                  ]},
                  { type: "text", name: "keyword", placeholder: "검색어 입력" }
                ]}
                initialValues={{ type: "name", keyword: "" }}
                onSearch={({ type, keyword }) => {
                  setNameKeyword(type === "name" ? keyword : "");
                  setPhoneKeyword(type === "phone" ? keyword : "");
                  setEmailKeyword(type === "email" ? keyword : "");
                  setPage(0);
                }}
              />
            </div>
          </div>
          {/* 테이블 + 페이지네이션 + 타이틀/카운트 공통 영역 */}
          <TableSection title="매니저 정보" total={managers.length}>
            <AdminTable
              columns={
                activeTab === 'applied'
                  ? [
                      { key: "userName", header: "이름", className: "w-[20%] text-center" },
                      { key: "phone", header: "연락처", className: "w-[20%] text-center" },
                      { key: "email", header: "이메일", className: "w-[20%] text-center" },
                      {
                        key: "contractStatus",
                        header: "계약 상태",
                        className: "w-[20%] text-center",
                        render: row => <StatusBadge status={row.contractStatus} />,
                      },
                    ]
                  : activeTab === 'termination'
                  ? [
                      { key: "userName", header: "이름", className: "w-[14%] text-center" },
                      { key: "phone", header: "연락처", className: "w-[14%] text-center" },
                      { key: "email", header: "이메일", className: "w-[18%] text-center" },
                      {
                        key: "averageRating",
                        header: (
                          <div className="flex items-center justify-center gap-1 cursor-pointer select-none" onClick={() => {
                            setRatingSort(prev => prev === null ? 'desc' : prev === 'desc' ? 'asc' : null);
                            setReservationSort(null);
                            setReviewSort(null);
                          }}>
                            평점
                            <span className="text-xs flex flex-col ml-1">
                              <span style={{ color: ratingSort === 'desc' ? '#6366f1' : '#cbd5e1', fontWeight: ratingSort === 'desc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▲</span>
                              <span style={{ color: ratingSort === 'asc' ? '#6366f1' : '#cbd5e1', fontWeight: ratingSort === 'asc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▼</span>
                            </span>
                          </div>
                        ),
                        className: "w-[10%] text-center",
                        render: row => row.averageRating ?? '-'
                      },
                      {
                        key: "reservationCount",
                        header: (
                          <div className="flex items-center justify-center gap-1 cursor-pointer select-none" onClick={() => {
                            setReservationSort(prev => prev === null ? 'desc' : prev === 'desc' ? 'asc' : null);
                            setRatingSort(null);
                            setReviewSort(null);
                          }}>
                            예약 수
                            <span className="text-xs flex flex-col ml-1">
                              <span style={{ color: reservationSort === 'desc' ? '#6366f1' : '#cbd5e1', fontWeight: reservationSort === 'desc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▲</span>
                              <span style={{ color: reservationSort === 'asc' ? '#6366f1' : '#cbd5e1', fontWeight: reservationSort === 'asc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▼</span>
                            </span>
                          </div>
                        ),
                        className: "w-[12%] text-center",
                        render: row => row.reservationCount ?? '-'
                      },
                      {
                        key: "reviewCount",
                        header: (
                          <div className="flex items-center justify-center gap-1 cursor-pointer select-none" onClick={() => {
                            setReviewSort(prev => prev === null ? 'desc' : prev === 'desc' ? 'asc' : null);
                            setRatingSort(null);
                            setReservationSort(null);
                          }}>
                            리뷰 수
                            <span className="text-xs flex flex-col ml-1">
                              <span style={{ color: reviewSort === 'desc' ? '#6366f1' : '#cbd5e1', fontWeight: reviewSort === 'desc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▲</span>
                              <span style={{ color: reviewSort === 'asc' ? '#6366f1' : '#cbd5e1', fontWeight: reviewSort === 'asc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▼</span>
                            </span>
                          </div>
                        ),
                        className: "w-[12%] text-center",
                        render: row => row.reviewCount ?? '-'
                      },
                      {
                        key: "contractStatus",
                        header: "계약 상태",
                        className: "w-[20%] text-center",
                        render: row => <StatusBadge status={row.contractStatus} />,
                      },
                    ]
                  : [
                      { key: "userName", header: "이름", className: "w-[14%] text-center" },
                      { key: "phone", header: "연락처", className: "w-[14%] text-center" },
                      { key: "email", header: "이메일", className: "w-[18%] text-center" },
                      {
                        key: "averageRating",
                        header: (
                          <div className="flex items-center justify-center gap-1 cursor-pointer select-none" onClick={() => {
                            setRatingSort(prev => prev === null ? 'desc' : prev === 'desc' ? 'asc' : null);
                            setReservationSort(null);
                            setReviewSort(null);
                          }}>
                            평점
                            <span className="text-xs flex flex-col ml-1">
                              <span style={{ color: ratingSort === 'desc' ? '#6366f1' : '#cbd5e1', fontWeight: ratingSort === 'desc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▲</span>
                              <span style={{ color: ratingSort === 'asc' ? '#6366f1' : '#cbd5e1', fontWeight: ratingSort === 'asc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▼</span>
                            </span>
                          </div>
                        ),
                        className: "w-[10%] text-center",
                        render: row => row.averageRating ?? '-'
                      },
                      {
                        key: "reservationCount",
                        header: (
                          <div className="flex items-center justify-center gap-1 cursor-pointer select-none" onClick={() => {
                            setReservationSort(prev => prev === null ? 'desc' : prev === 'desc' ? 'asc' : null);
                            setRatingSort(null);
                            setReviewSort(null);
                          }}>
                            예약 수
                            <span className="text-xs flex flex-col ml-1">
                              <span style={{ color: reservationSort === 'desc' ? '#6366f1' : '#cbd5e1', fontWeight: reservationSort === 'desc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▲</span>
                              <span style={{ color: reservationSort === 'asc' ? '#6366f1' : '#cbd5e1', fontWeight: reservationSort === 'asc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▼</span>
                            </span>
                          </div>
                        ),
                        className: "w-[12%] text-center",
                        render: row => row.reservationCount ?? '-'
                      },
                      {
                        key: "reviewCount",
                        header: (
                          <div className="flex items-center justify-center gap-1 cursor-pointer select-none" onClick={() => {
                            setReviewSort(prev => prev === null ? 'desc' : prev === 'desc' ? 'asc' : null);
                            setRatingSort(null);
                            setReservationSort(null);
                          }}>
                            리뷰 수
                            <span className="text-xs flex flex-col ml-1">
                              <span style={{ color: reviewSort === 'desc' ? '#6366f1' : '#cbd5e1', fontWeight: reviewSort === 'desc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▲</span>
                              <span style={{ color: reviewSort === 'asc' ? '#6366f1' : '#cbd5e1', fontWeight: reviewSort === 'asc' ? 'bold' : 'normal', lineHeight: '0.9' }}>▼</span>
                            </span>
                          </div>
                        ),
                        className: "w-[12%] text-center",
                        render: row => row.reviewCount ?? '-'
                      },
                      {
                        key: "contractStatus",
                        header: (
                          <div className="relative select-none">
                            <div
                              className="flex items-center justify-center gap-1 cursor-pointer"
                              onClick={toggleContractStatusDropdown}
                            >
                              계약 상태
                              <span className="ml-1 text-xs">▼</span>
                            </div>
                            {contractStatusDropdownOpen && (
                              <div ref={contractStatusDropdownRef} className="absolute z-10 bg-white border rounded shadow-md mt-2 left-1/2 -translate-x-1/2 min-w-[140px] p-2">
                                {CONTRACT_STATUS_OPTIONS.map(opt => (
                                  <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={selectedContractStatuses.includes(opt.value)}
                                      onChange={() => handleContractStatusCheckbox(opt.value)}
                                    />
                                    <span>{opt.label}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        ),
                        className: "w-[20%] text-center",
                        render: row => <StatusBadge status={row.contractStatus} />,
                      },
                    ]
              }
              data={filteredManagers}
              rowKey={row => row.managerId}
              emptyMessage={"조회된 매니저가 없습니다."}
              onRowClick={row => navigate(`/admin/managers/${row.managerId}`)}
            />
            <div className="w-full flex justify-center py-6 min-h-20">
              <AdminPagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </TableSection>
        </div>
      </div>
    </Fragment>
  );
};
