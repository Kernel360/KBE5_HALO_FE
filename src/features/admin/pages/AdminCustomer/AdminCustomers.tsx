import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { fetchAdminCustomers } from "../../api/adminCustomer";
import type { AdminCustomer } from "../../types/AdminCustomerType";
import { AdminSearchForm } from "../../components/AdminSearchForm";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import { AdminTable } from "../../components/AdminTable";
import type { AdminTableColumn } from "../../components/AdminTable";
import AccountStatusBadge from "@/shared/components/ui/AccountStatusBadge";
import { AdminPagination } from "../../components/AdminPagination";
import { AdminTabs } from "../../components/AdminTabs";
import { TableSection } from "../../components/TableSection";
import Toast from "@/shared/components/ui/toast/Toast";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import SuccessToast from "@/shared/components/ui/toast/SuccessToast";

export const AdminCustomers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "reported">(
    "all",
  );
  const [nameKeyword, setNameKeyword] = useState("");
  const [phoneKeyword, setPhoneKeyword] = useState("");
  const [emailKeyword, setEmailKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc" | null>(null);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string[]>(["활성"]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  // Spring API에서 고객 목록 불러오기
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // 탭에 따른 상태 필터 설정
        let currentStatusFilter = statusFilter;
        if (activeTab === "reported") {
          currentStatusFilter = ["SUSPENDED"];
        }

        const searchParams = {
          userName: nameKeyword || undefined,
          phone: phoneKeyword || undefined,
          email: emailKeyword || undefined,
          status: currentStatusFilter.length > 0 ? currentStatusFilter : undefined,
          page,
          size: 10,
          sort: sortOrder ? `point,${sortOrder}` : undefined,
        };
        console.log("API 호출 파라미터:", searchParams);
        console.log("현재 검색어 상태:", {
          nameKeyword,
          phoneKeyword,
          emailKeyword,
        });

        const data = await fetchAdminCustomers(searchParams);
        console.log("고객 목록 응답 데이터:", data);
        // API 응답 데이터를 AdminCustomer 타입에 맞게 매핑
        const mappedCustomers: AdminCustomer[] = (data.content || []).map(
          (customer) => ({
            id: customer.customerId,
            name: customer.userName,
            phone: customer.phone,
            email: customer.email,
            status:
              customer.accountStatus === "ACTIVE"
                ? "활성"
                : customer.accountStatus === "DELETED"
                  ? "비활성"
                  : customer.accountStatus === "REPORTED"
                    ? "신고됨"
                    : "활성",
            count: customer.count,
            gender: customer.gender,
            birthDate: customer.birthDate,
            roadAddress: customer.roadAddress,
            detailAddress: customer.detailAddress,
            latitude: customer.latitude,
            longitude: customer.longitude,
            point: customer.point,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
          }),
        );
        setCustomers(mappedCustomers);
        setTotalPages(data.totalPages || 1);
      } catch (error: unknown) {
        const backendMsg =
          error && typeof error === "object" && "response" in error
            ? (
                error as {
                  response?: { data?: { message?: string } };
                  message?: string;
                }
              )?.response?.data?.message ||
              (error as { message?: string })?.message
            : error && typeof error === "object" && "message" in error
              ? (error as { message?: string })?.message
              : null;
        setErrorToastMsg(backendMsg || "고객 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [
    activeTab,
    nameKeyword,
    phoneKeyword,
    emailKeyword,
    page,
    sortOrder,
    statusFilter,
    searchTrigger,
  ]);

  // 상세 페이지로 이동
  const handleRowClick = (customer: AdminCustomer) => {
    navigate(`/admin/customers/${customer.id}`);
  };

  // 테이블 컬럼 정의
  const columns: AdminTableColumn<AdminCustomer>[] = [
    { key: "name", header: "고객명", className: "w-[20%] text-center" },
    { key: "phone", header: "연락처", className: "w-[25%] text-center" },
    { key: "email", header: "이메일", className: "w-[25%] text-center" },
    {
      key: "status",
      header: (
        <div className="relative select-none">
          <div
            className={`flex items-center justify-center gap-1 ${
              activeTab === "reported"
                ? "cursor-default text-gray-700"
                : "cursor-pointer " +
                  (statusFilter.length > 0
                    ? "text-indigo-600"
                    : "text-gray-700")
            } text-sm font-semibold`}
            onClick={() => {
              if (activeTab !== "reported") {
                setStatusDropdownOpen((open) => !open);
              }
            }}
          >
            상태
            {activeTab !== "reported" && (
              <span className="ml-1 text-xs">▼</span>
            )}
          </div>
          {statusDropdownOpen && activeTab !== "reported" && (
            <div
              ref={statusDropdownRef}
              className="absolute z-10 bg-white border rounded shadow-md mt-2 left-1/2 -translate-x-1/2 min-w-[100px] p-2"
            >
              {[
                { value: "활성", label: "활성" },
                { value: "비활성", label: "비활성" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 py-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={statusFilter.includes(opt.value)}
                    onChange={() => {
                      setStatusFilter((prev) =>
                        prev.includes(opt.value)
                          ? prev.filter((v) => v !== opt.value)
                          : [...prev, opt.value],
                      );
                      setPage(0); // 상태 필터 변경 시 첫 페이지로 리셋
                      setSearchTrigger((prev) => prev + 1); // 검색 실행 트리거
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ),
      className: "w-[15%] text-center",
      render: (row) => (
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
      key: "point",
      header: (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer select-none"
          onClick={() =>
            setSortOrder((o) =>
              o === "desc" ? "asc" : o === "asc" ? null : "desc",
            )
          }
        >
          포인트
          <span className="text-xs flex flex-col ml-1">
            <span
              style={{
                color: sortOrder === "desc" ? "#6366f1" : "#cbd5e1",
                fontWeight: sortOrder === "desc" ? "bold" : "normal",
                lineHeight: "0.9",
              }}
            >
              ▲
            </span>
            <span
              style={{
                color: sortOrder === "asc" ? "#6366f1" : "#cbd5e1",
                fontWeight: sortOrder === "asc" ? "bold" : "normal",
                lineHeight: "0.9",
              }}
            >
              ▼
            </span>
          </span>
        </div>
      ),
      className: "w-[15%] text-center",
    },
  ];

  // 백엔드에서 이미 필터링된 데이터를 받으므로 추가 필터링 불필요
  const filteredCustomers = customers;

  // 상태 드롭다운 외부 클릭 시 닫힘 처리
  useEffect(() => {
    if (!statusDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [statusDropdownOpen]);

  return (
    <Fragment>
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
      <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
        <AdminPageHeader title="고객 정보 관리" />
        <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
          {/* 탭 + 검색 폼: 한 줄에 배치 */}
          <div className="w-full flex flex-row items-center justify-between mb-2 gap-2">
            <div className="flex-1 min-w-0">
              <AdminTabs
                tabs={[
                  { key: "all", label: "전체 고객" },
                  { key: "reported", label: "신고 고객" },
                ]}
                activeKey={activeTab}
                onTabChange={(key) => {
                  setActiveTab(key as typeof activeTab);
                  // 탭 변경 시 상태 필터 자동 조정
                  if (key === "reported") {
                    setStatusFilter(["SUSPENDED"]);
                  } else {
                    setStatusFilter(["활성"]);
                  }
                  setPage(0);
                  setSearchTrigger((prev) => prev + 1);
                }}
                className="w-fit min-w-0"
              />
            </div>
            <div className="flex-shrink-0">
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
                  { type: "text", name: "keyword", placeholder: "검색어 입력" },
                ]}
                initialValues={{ type: "name", keyword: "" }}
                onSearch={({ type, keyword }) => {
                  console.log("검색 실행:", { type, keyword });

                  // 모든 검색어 초기화
                  setNameKeyword("");
                  setPhoneKeyword("");
                  setEmailKeyword("");

                  // 선택한 타입에 따라 검색어 설정
                  if (keyword.trim()) {
                    if (type === "name") {
                      setNameKeyword(keyword.trim());
                    } else if (type === "phone") {
                      setPhoneKeyword(keyword.trim());
                    } else if (type === "email") {
                      setEmailKeyword(keyword.trim());
                    }
                  }

                  // 탭에 따른 상태 필터 설정
                  if (activeTab === "reported") {
                    setStatusFilter(["SUSPENDED"]);
                  } else {
                    // 전체 고객 탭일 때는 기본적으로 활성 상태만 보여주거나 현재 필터 유지
                    if (statusFilter.length === 0) {
                      setStatusFilter(["활성"]);
                    }
                  }

                  setPage(0);
                  setSearchTrigger((prev) => prev + 1); // 검색 실행 트리거
                }}
              />
            </div>
          </div>

          {/* 목록 테이블 + 페이지네이션을 하나의 영역(Card)으로 묶음 */}
          <TableSection title="고객 정보" total={filteredCustomers.length}>
            {/* 데스크탑: 테이블 */}
            <div className="hidden md:block">
              <AdminTable
                loading={loading}
                columns={columns}
                data={filteredCustomers}
                rowKey={(row) => row.id}
                onRowClick={handleRowClick}
                emptyMessage={"조회된 고객이 없습니다."}
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
              {filteredCustomers.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  조회된 고객이 없습니다.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredCustomers.map((row) => (
                    <div
                      key={row.id}
                      className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleRowClick(row)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-base text-gray-900">
                          {row.name}
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
                        연락처: {row.phone}
                      </div>
                      <div className="text-sm text-gray-700 break-all">
                        이메일: {row.email}
                      </div>
                      <div className="text-sm text-gray-700 break-all">
                        포인트: {row.point}
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
