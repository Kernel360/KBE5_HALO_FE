import { Fragment, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/constants";
import { fetchAdminManagers } from "@/features/admin/api/adminManager";
import type { AdminManager } from "@/features/admin/types/AdminManagerType";

export const AdminManagers = () => {
  const location = useLocation();
  const initialTab = location.state?.tab === 'applied' ? 'applied' : 'all';
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'applied'>(initialTab);
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

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (activeTab === 'active') {
        // 신고된 매니저
        const mappedParams: any = {
          userName: searchParams.nameKeyword || undefined,
          phone: searchParams.phoneKeyword || undefined,
          email: searchParams.emailKeyword || undefined,
          status: undefined, // 상태 필터는 사용하지 않음
          minRating: searchParams.ratingMinKeyword ? Number(searchParams.ratingMinKeyword) : undefined,
          maxRating: searchParams.ratingMaxKeyword ? Number(searchParams.ratingMaxKeyword) : undefined,
          page: page,
          size: DEFAULT_PAGE_SIZE,
          excludeStatus: ['ACTIVE', 'PENDING', 'TERMINATION_PENDING', 'TERMINATED', 'DELETED', 'REJECTED'],
        };
        res = await fetchAdminManagers(mappedParams);
        setManagers(res.content || res || []);
        setTotalPages(res.totalPages || 1);
      } else if (activeTab === 'applied') {
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
          excludeStatus: ['ACTIVE', 'SUSPENDED', 'TERMINATION_PENDING', 'TERMINATED', 'DELETED'],
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
          excludeStatus: ['SUSPENDED', 'PENDING', 'REJECTED'],
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
  }, [activeTab, page, searchParams]);

  // 탭 변경 시 검색 조건 및 searchParams 초기화
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
  }, [activeTab]);

  return (
    <Fragment>
      <div className="w-full flex flex-col">
        {/* 제목 */}
        <div className="h-16 px-6 bg-white border-b border-gray-200 flex items-center">
          <div className="text-gray-900 text-xl font-bold">매니저 정보 관리</div>
        </div>

        {/* 내용 */}
        <div className="p-6 flex flex-col gap-6">
          {/* 탭 */}
          <div className="border-b border-gray-200 flex">
            {[
              { key: 'all', label: '전체 매니저' },
              { key: 'active', label: '신고된 매니저' },
              { key: 'applied', label: '매니저 신청 내역' },
            ].map((tab) => (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`w-40 h-10 px-4 flex justify-center items-center cursor-pointer ${
                  activeTab === tab.key ? 'border-b-2 border-indigo-600' : ''
                }`}
              >
                <span
                  className={`text-sm ${
                    activeTab === tab.key ? 'text-indigo-600 font-semibold' : 'text-gray-500 font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            ))}
          </div>

          {/* 검색 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchParams({
                nameKeyword,
                phoneKeyword,
                emailKeyword,
                statusKeyword,
                ratingMinKeyword,
                ratingMaxKeyword,
              });
              setPage(0);
            }}
            className="w-full p-6 bg-white rounded-xl shadow flex flex-col gap-4"
          >
            <div className="text-slate-800 text-lg font-semibold">검색 조건</div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-medium">이름</label>
                  <div className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 flex items-center">
                    <input
                      type="text"
                      placeholder="이름 입력"
                      value={nameKeyword}
                      onChange={(e) => setNameKeyword(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-medium">연락처</label>
                  <div className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 flex items-center">
                    <input
                      type="text"
                      placeholder="연락처 입력"
                      value={phoneKeyword}
                      onChange={(e) => setPhoneKeyword(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-medium">이메일</label>
                  <div className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 flex items-center">
                    <input
                      type="text"
                      placeholder="이메일 입력"
                      value={emailKeyword}
                      onChange={(e) => setEmailKeyword(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="flex-1"></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-slate-700 text-sm font-medium">평점</label>
                  <div className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      placeholder="최소"
                      value={ratingMinKeyword}
                      onChange={(e) => {
                        const value = e.target.value;
                        if ((/^\d*\.?\d*$/.test(value) || value === "") && (value === "" || (Number(value) >= 1 && Number(value) <= 5))) {
                          setRatingMinKeyword(value);
                        }
                      }}
                      className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                    />
                    <span className="mx-1 text-slate-400">~</span>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      placeholder="최대"
                      value={ratingMaxKeyword}
                      onChange={(e) => {
                        const value = e.target.value;
                        if ((/^\d*\.?\d*$/.test(value) || value === "") && (value === "" || (Number(value) >= 1 && Number(value) <= 5))) {
                          setRatingMaxKeyword(value);
                        }
                      }}
                      className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  {activeTab === 'all' && (
                    <>
                      <label className="text-slate-700 text-sm font-medium">계약 상태</label>
                      <div className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 flex items-center">
                        <select
                          value={statusKeyword}
                          onChange={(e) => setStatusKeyword(e.target.value)}
                          className="w-full bg-transparent outline-none text-sm text-slate-700"
                        >
                          <option value="">전체</option>
                          <option value="ACTIVE">활성</option>
                          <option value="TERMINATION_PENDING">계약해지대기</option>
                          <option value="TERMINATED">계약해지</option>
                          <option value="DELETED">탈퇴</option>
                        </select>
                      </div>
                    </>
                  )}
                  {activeTab === 'applied' && (
                    <>
                      <label className="text-slate-700 text-sm font-medium">계약 상태</label>
                      <div className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 flex items-center">
                        <select
                          value={statusKeyword}
                          onChange={(e) => setStatusKeyword(e.target.value)}
                          className="w-full bg-transparent outline-none text-sm text-slate-700"
                        >
                          <option value="">전체</option>
                          <option value="PENDING">승인대기</option>
                          <option value="REJECTED">승인거절</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex-1"></div>
                <div className="flex-1"></div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="w-28 h-12 bg-slate-100 rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-200 cursor-pointer"
                onClick={() => {
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
                }}
              >
                초기화
              </button>
              <button
                type="submit"
                className="w-28 h-12 bg-indigo-600 rounded-lg text-white text-sm font-medium hover:bg-indigo-700 cursor-pointer"
              >
                검색
              </button>
            </div>
          </form>

          {/* 테이블 */}
          <div className="w-full bg-white rounded-lg shadow flex flex-col">
            {/* 헤더 */}
            <div className="h-12 px-6 bg-gray-50 border-b border-gray-200 flex items-center text-sm font-semibold text-gray-700 space-x-4">
              <div className="w-[20%] flex justify-center items-center">이름</div>
              <div className="w-[20%] flex justify-center items-center">연락처</div>
              <div className="w-[20%] flex justify-center items-center">이메일</div>
              <div className="w-[20%] flex justify-center items-center">평점</div>
              <div className="w-[20%] flex justify-center items-center">계약 상태</div>
            </div>

            {/* 리스트 */}
            {loading ? (
              <div className="w-full h-32 flex items-center justify-center text-gray-400">로딩 중...</div>
            ) : error ? (
              <div className="w-full h-32 flex items-center justify-center text-red-400">{error}</div>
            ) : managers.length === 0 ? (
              <div className="w-full h-32 flex items-center justify-center text-gray-400">등록된 매니저가 없습니다.</div>
            ) : (
              managers.map((manager) => (
                <div
                  key={manager.managerId}
                  className="w-full px-6 h-16 border-b border-gray-200 flex items-center text-sm space-x-4 hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/admin/managers/${manager.managerId}`)}
                >
                  <div className="w-[20%] text-gray-900 font-medium flex justify-center">{manager.userName}</div>
                  <div className="w-[20%] text-gray-500 flex justify-center">{manager.phone}</div>
                  <div className="w-[20%] text-gray-500 flex justify-center">{manager.email}</div>
                  <div className="w-[20%] text-gray-500 flex justify-center items-center">
                    {manager.averageRating != null ? (
                      <span className="w-full text-center text-gray-500 text-sm">{Number(manager.averageRating).toFixed(1)}</span>
                    ) : (
                      '-' 
                    )}
                  </div>
                  <div className="w-[20%] flex justify-center">
                    {(() => {
                      let label = '';
                      let color = '';
                      switch (manager.userstatus) {
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
                          label = manager.userstatus;
                          color = 'bg-gray-100 text-gray-500';
                      }
                      return (
                        <div className={`px-2 py-0.5 rounded-xl text-xs font-medium inline-block ${color}`}>{label}</div>
                      );
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 페이지네이션 - ManagerInquiries에 있는거 가져다가 쓰기... 묘하게 다르네요... */}
          {totalPages > 1 && (
            <div className="self-stretch flex justify-center gap-1 pt-4">
              <div
                className="w-8 h-8 rounded-md flex justify-center items-center cursor-pointer bg-slate-100 text-slate-500"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                <div className="text-sm font-medium">이전</div>
              </div>
              {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                <div
                  key={p}
                  className={`w-8 h-8 rounded-md flex justify-center items-center cursor-pointer ${
                    page === p ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                  onClick={() => setPage(p)}
                >
                  <div className="text-sm font-medium">{p + 1}</div>
                </div>
              ))}
              <div
                className="w-8 h-8 rounded-md flex justify-center items-center cursor-pointer bg-slate-100 text-slate-500"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              >
                <div className="text-sm font-medium">다음</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};
