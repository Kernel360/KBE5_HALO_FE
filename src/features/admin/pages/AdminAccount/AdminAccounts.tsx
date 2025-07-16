import { Fragment, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAdminAccounts,
  deleteAdminAccount,
} from "@/features/admin/api/adminAuth";
import { TableSection } from "../../components/TableSection";
import { AdminTable } from "../../components/AdminTable";
import { AdminPagination } from "../../components/AdminPagination";
import Toast from "@/shared/components/ui/toast/Toast";
import Card from "@/shared/components/ui/Card";
import CardContent from "@/shared/components/ui/CardContent";
import Button from "@/shared/components/ui/Button";
import AdminSearchForm from "../../components/AdminSearchForm";
import AccountStatusBadge from "@/shared/components/ui/AccountStatusBadge";
import { ConfirmModal } from "@/shared/components/ui/modal";
import { useUserStore } from "@/store/useUserStore";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import SuccessToast from "@/shared/components/ui/toast/SuccessToast";

export const AdminAccounts = () => {
  // 검색 조건을 하나의 키워드와 타입으로 관리
  const [searchType, setSearchType] = useState("name");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusKeyword, setStatusKeyword] = useState<string[]>(["활성"]);
  const [page, setPage] = useState(0);
  const [adminData, setAdminData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetAdminId, setTargetAdminId] = useState<string | number | null>(
    null,
  );
  const [targetAdminName, setTargetAdminName] = useState<string>("");
  const myPhone = useUserStore((state) => state.email);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  const STATUS_OPTIONS = [
    { value: "활성", label: "활성" },
    { value: "비활성", label: "비활성" },
  ];

  // 검색 조건을 fetch에 맞게 변환
  const getSearchParams = () => {
    return {
      name: searchType === "name" ? searchKeyword : "",
      phone: searchType === "phone" ? searchKeyword : "",
      email: searchType === "email" ? searchKeyword : "",
      status: statusKeyword,
      page,
    };
  };

  const fetchData = async (
    paramsOverride?: Partial<ReturnType<typeof getSearchParams>>,
  ) => {
    setLoading(true);
    try {
      const params = { ...getSearchParams(), ...paramsOverride };
      const res = await fetchAdminAccounts({
        ...params,
        size: 10,
      });
      setAdminData(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message;
      setErrorToastMsg(backendMsg || "관리자 계정 목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusKeyword]);

  // AdminSearchForm에서 검색
  const handleSearch = (values: Record<string, string>) => {
    const { type = "", keyword = "" } = values;
    setSearchType(type);
    setSearchKeyword(keyword);
    setPage(0);
    fetchData({
      name: type === "name" ? keyword : "",
      phone: type === "phone" ? keyword : "",
      email: type === "email" ? keyword : "",
      page: 0,
    });
  };

  // 상태 체크박스 핸들러 (다중 선택)
  const handleStatusCheckbox = (value: string) => {
    setStatusKeyword((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
    setPage(0);
  };

  // 삭제 핸들러 (ConfirmModal 연동)
  const handleDeleteClick = (adminId: string | number) => {
    const admin = adminData.find((a) => a.adminId === adminId);
    setTargetAdminId(adminId);
    setTargetAdminName(admin?.userName || "");
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!targetAdminId) return;
    try {
      await deleteAdminAccount(targetAdminId);
      setSuccessToastMsg("삭제되었습니다.");
      setConfirmOpen(false);
      setTargetAdminId(null);
      setTargetAdminName("");
      fetchData();
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message;
      setErrorToastMsg(backendMsg || "삭제 실패");
      setConfirmOpen(false);
      setTargetAdminId(null);
      setTargetAdminName("");
    }
  };
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setTargetAdminId(null);
    setTargetAdminName("");
  };

  // columns 정의 (handleDelete 접근 가능)
  const columns = [
    {
      key: "name",
      header: "이름",
      render: (row: any) => <span>{row.userName}</span>,
    },
    {
      key: "email",
      header: "이메일",
      render: (row: any) => <span>{row.email}</span>,
    },
    {
      key: "phone",
      header: "연락처",
      render: (row: any) => <span>{row.phone}</span>,
    },
    {
      key: "status",
      header: (
        <div className="relative select-none">
          <div
            className={`flex items-center justify-center gap-1 cursor-pointer text-sm font-semibold ${statusKeyword.length > 0 ? "text-indigo-600" : "text-gray-700"}`}
            onClick={() => setStatusDropdownOpen((open) => !open)}
          >
            상태
            <span className="ml-1 text-xs">▼</span>
          </div>
          {statusDropdownOpen && (
            <div
              ref={statusDropdownRef}
              className="absolute z-10 bg-white border rounded shadow-md mt-2 left-1/2 -translate-x-1/2 min-w-[100px] p-2"
            >
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 py-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={statusKeyword.includes(opt.value)}
                    onChange={() => handleStatusCheckbox(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ),
      render: (row: any) => (
        <AccountStatusBadge
          status={
            row.status === "활성"
              ? "ACTIVE"
              : row.status === "비활성"
                ? "SUSPENDED"
                : row.status
          }
        />
      ),
    },
    {
      key: "action",
      header: "삭제",
      render: (row: any) => (
        <Button
          className="h-8 px-5 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-semibold disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed shadow"
          disabled={row.phone === myPhone}
          onClick={(e) => {
            e.stopPropagation();
            if (row.phone === myPhone) {
              setErrorToastMsg("본인 계정은 삭제할 수 없습니다.");
              return;
            }
            handleDeleteClick(row.adminId);
          }}
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <Fragment>
      <ConfirmModal
        open={confirmOpen}
        message={`관리자: ${targetAdminName}을 삭제하시겠습니까?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel="삭제"
        cancelLabel="취소"
      />
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ""}
        onClose={() => setSuccessToastMsg(null)}
      />
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ""}
        onClose={() => setErrorToastMsg(null)}
      />
      <Toast
        open={!!toastMsg}
        message={toastMsg || ""}
        onClose={() => setToastMsg(null)}
      />
      <div className="w-full self-stretch flex flex-col">
        <div className="h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold">
            관리자 계정 관리
          </div>
          <Link to="/admin/accounts/new">
            <Button className="h-10 px-4 bg-indigo-600 rounded-md flex justify-center items-center gap-2 hover:bg-indigo-700 transition">
              <span className="material-symbols-outlined text-white">add</span>
              <span className="text-white text-sm font-semibold font-['Inter'] leading-none">
                관리자 계정 추가
              </span>
            </Button>
          </Link>
        </div>
        <div className="p-6 flex flex-col gap-6">
          {/* 검색 폼 */}
          <Card className="w-full">
            <CardContent className="flex flex-row items-center gap-4 justify-between">
              <div className="flex-1 min-w-0">
                <AdminSearchForm
                  fields={[
                    {
                      type: "select",
                      name: "type",
                      options: [
                        { value: "name", label: "이름" },
                        { value: "phone", label: "연락처" },
                        { value: "email", label: "이메일" },
                      ],
                    },
                    {
                      type: "text",
                      name: "keyword",
                      placeholder: "검색어 입력",
                    },
                  ]}
                  initialValues={{ type: searchType, keyword: searchKeyword }}
                  onSearch={handleSearch}
                />
              </div>
            </CardContent>
          </Card>
          {/* 테이블 */}
          <TableSection title="계정 정보" total={adminData.length}>
            {/* 데스크탑: 테이블 */}
            <div className="hidden md:block">
              <AdminTable
                loading={loading}
                columns={columns}
                data={adminData}
                rowKey={(row) => row.adminId}
                emptyMessage={"등록된 관리자가 없습니다."}
                onRowClick={(row) =>
                  navigate(`/admin/accounts/${row.adminId}/edit`)
                }
              />
              <div className="w-full flex justify-center py-4">
                <AdminPagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              </div>
            </div>
            {/* 모바일: 카드형 리스트 */}
            <div className="block md:hidden">
              {adminData.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  등록된 관리자가 없습니다.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {adminData.map((row) => (
                    <div
                      key={row.adminId}
                      className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2 cursor-pointer"
                      onClick={() =>
                        navigate(`/admin/accounts/${row.adminId}/edit`)
                      }
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-base text-gray-900">
                          {row.userName}
                        </div>
                        <AccountStatusBadge
                          status={
                            row.status === "활성"
                              ? "ACTIVE"
                              : row.status === "비활성"
                                ? "SUSPENDED"
                                : row.status
                          }
                        />
                      </div>
                      <div className="text-sm text-gray-700 break-all">
                        이메일: {row.email}
                      </div>
                      <div className="text-sm text-gray-700 break-all">
                        연락처: {row.phone}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          className="h-8 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 text-xs font-semibold disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed shadow"
                          disabled={row.phone === myPhone}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (row.phone === myPhone) {
                              setErrorToastMsg(
                                "본인 계정은 삭제할 수 없습니다.",
                              );
                              return;
                            }
                            handleDeleteClick(row.adminId);
                          }}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="w-full flex justify-center py-4">
                <AdminPagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              </div>
            </div>
          </TableSection>
        </div>
      </div>
    </Fragment>
  );
};
