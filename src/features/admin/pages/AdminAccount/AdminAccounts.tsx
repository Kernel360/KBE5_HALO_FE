import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAdminAccounts, deleteAdminAccount } from "@/features/admin/api/adminAuth";

export const AdminAccounts = () => {
  const [nameKeyword, setNameKeyword] = useState('');
  const [phoneKeyword, setPhoneKeyword] = useState('');
  const [emailKeyword, setEmailKeyword] = useState('');
  const [statusKeyword, setStatusKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [adminData, setAdminData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (params?: { name?: string; phone?: string; email?: string; status?: string; page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminAccounts({
        name: params?.name,
        phone: params?.phone,
        email: params?.email,
        status: params?.status,
        page: params?.page ?? 0,
        size: 10,
      });
      setAdminData(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      setError(err.message || '관리자 계정 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ name: nameKeyword, phone: phoneKeyword, email: emailKeyword, status: statusKeyword, page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchData({ name: nameKeyword, phone: phoneKeyword, email: emailKeyword, status: statusKeyword, page: 0 });
  };

  const handleReset = () => {
    setNameKeyword('');
    setPhoneKeyword('');
    setEmailKeyword('');
    setStatusKeyword('');
    setPage(0);
    fetchData({ name: '', phone: '', email: '', status: '', page: 0 });
  };

  // 삭제 핸들러
  const handleDelete = async (adminId: string | number) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await deleteAdminAccount(adminId);
      alert("삭제되었습니다.");
      // 삭제 후 목록 새로고침
      fetchData({ name: nameKeyword, phone: phoneKeyword, email: emailKeyword, status: statusKeyword, page });
    } catch (err: any) {
      alert(err.message || "삭제 실패");
    }
  };

  return (
    <Fragment>
      <div className="w-full self-stretch flex flex-col">
        <div className="h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold">관리자 계정 관리</div>
          <Link
            to="/admin/accounts/new"
            className="h-10 px-4 bg-indigo-600 rounded-md flex justify-center items-center gap-2 cursor-pointer hover:bg-indigo-700 transition"
          >
            <span className="material-symbols-outlined text-white">add</span>
            <span className="text-white text-sm font-semibold font-['Inter'] leading-none">관리자 계정 추가</span>
          </Link>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* 검색 폼 */}
          <form
            onSubmit={handleSearch}
            className="w-full p-6 bg-white rounded-xl shadow flex flex-col gap-4"
          >
            <div className="text-slate-800 text-lg font-semibold">검색 조건</div>
            <div className="flex flex-col gap-2 w-full items-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-2 w-full">
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
                <div className="flex flex-col gap-2 w-full">
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
                <div className="flex flex-col gap-2 w-full">
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
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-slate-700 text-sm font-medium">상태</label>
                  <div className="h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-slate-200 flex items-center">
                    <select
                      value={statusKeyword}
                      onChange={(e) => setStatusKeyword(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-slate-700"
                    >
                      <option value="">전체</option>
                      <option value="활성">활성</option>
                      <option value="비활성">비활성</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="w-28 h-12 bg-slate-100 rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-200 cursor-pointer"
                onClick={handleReset}
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
          <div className="w-full bg-white rounded-lg shadow">
            <div className="w-full px-6 h-12 bg-gray-50 border-b border-gray-200 flex items-center text-sm font-semibold text-gray-700 space-x-4">
              <div className="w-[10%] flex justify-center">이름</div>
              <div className="w-[25%] flex justify-center">연락처</div>
              <div className="w-[25%] flex justify-center">이메일</div>
              <div className="w-[10%] flex justify-center">상태</div>
              <div className="w-[15%] flex justify-center">생성일</div>
              <div className="w-[15%] flex justify-center">관리</div>
            </div>

            {loading ? (
              <div className="w-full h-32 flex items-center justify-center text-gray-400">로딩 중...</div>
            ) : error ? (
              <div className="w-full h-32 flex items-center justify-center text-red-400">{error}</div>
            ) : adminData.length === 0 ? (
              <div className="w-full h-32 flex items-center justify-center text-gray-400">등록된 관리자가 없습니다.</div>
            ) : (
              adminData.map((admin, index) => (
                <div key={admin.adminId || index} className="w-full px-6 h-16 border-b border-gray-200 flex items-center text-sm space-x-4">
                  <div className="w-[10%] text-gray-900 font-medium flex justify-center">{admin.userName}</div>
                  <div className="w-[25%] text-gray-500 flex justify-center">{admin.phone}</div>
                  <div className="w-[25%] text-gray-500 flex justify-center">{admin.email}</div>
                  <div className="w-[10%] flex justify-center">
                    <div className={`px-2 py-0.5 rounded-xl text-xs font-medium inline-block ${admin.status === '활성' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>{admin.status}</div>
                  </div>
                  <div className="w-[15%] text-gray-500 flex justify-center">{admin.createdAt || admin.date}</div>
                  <div className="w-[15%] flex justify-center gap-2">
                    <Link 
                      key={admin.adminId || index}
                      to={`/admin/accounts/${admin.adminId || index}/edit`}
                      state={admin}
                      className="px-2 py-1 rounded border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 cursor-pointer">
                      수정
                    </Link>
                    <button
                      className="px-2 py-1 rounded border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 cursor-pointer"
                      onClick={() => handleDelete(admin.adminId)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 페이지네이션 - ManagerInquiries에 있는거 가져다가 쓰기... 묘하게 다르네요... */}
          <div className="self-stretch flex justify-center gap-1 pt-4">
            <div
              className="w-8 h-8 rounded-md flex justify-center items-center cursor-pointer bg-slate-100 text-slate-500"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              <div className="text-sm font-medium leading-none">이전</div>
            </div>
            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <div
                key={p}
                className={`w-8 h-8 rounded-md flex justify-center items-center cursor-pointer ${
                  page === p ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                }`}
                onClick={() => setPage(p)}
              >
                <div className="text-sm font-medium leading-none">{p + 1}</div>
              </div>
            ))}
            <div
              className="w-8 h-8 rounded-md flex justify-center items-center cursor-pointer bg-slate-100 text-slate-500"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            >
              <div className="text-sm font-medium leading-none">다음</div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
