import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAdminAccounts, deleteAdminAccount } from "@/features/admin/api/adminAuth";
import { TableSection } from '../../components/TableSection';
import { AdminTable } from '../../components/AdminTable';
import { AdminPagination } from '../../components/AdminPagination';

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
          <TableSection title="계정 정보" total={adminData.length}>
            <AdminTable
              columns={columns}
              data={adminData}
              rowKey={row => row.adminId}
              emptyMessage={"등록된 관리자가 없습니다."}
            />
            <div className="w-full flex justify-center py-4">
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
