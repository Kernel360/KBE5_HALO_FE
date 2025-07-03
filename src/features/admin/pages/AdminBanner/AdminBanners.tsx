import { Fragment, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import type { SearchAdminBanners as AdminBannerType } from "@/features/admin/types/AdminBannerType"
import { isValidDateRange } from "@/shared/utils/validation";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/constants";
import { searchAdminBanners } from "@/features/admin/api/adminBanners";
import { TableSection } from '../../components/TableSection';
import { AdminTable } from '../../components/AdminTable';
import { AdminPagination } from '../../components/AdminPagination';
import Toast from "@/shared/components/ui/toast/Toast";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import SuccessToast from "@/shared/components/ui/toast/SuccessToast";

export const AdminBanners = () => {
  const [banners, setBanners] = useState<AdminBannerType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [fromCreatedAt, setFromCreatedAt] = useState<string>("");
  const [toCreatedAt, setToCreatedAt] = useState<string>(""); 
  const [titleKeyword, setTitleKeyword] = useState("");
  const fromDateRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  const fetchBanners = (paramsOverride?: Partial<ReturnType<typeof getCurrentParams>>) => {
    const params = getCurrentParams();
    const finalParams = { ...params, ...paramsOverride };

    if (!isValidDateRange(finalParams.fromCreatedAt, finalParams.toCreatedAt)) {
      alert("시작일은 종료일보다 늦을 수 없습니다.");
      fromDateRef.current?.focus();
      return;
    }
    setLoading(true);
    searchAdminBanners(finalParams)
      .then((res) => {
        setBanners(res.content);
        setTotal(res.page.totalElements);
      })
      .catch((err) => {
        const backendMsg = err?.response?.data?.message;
        setErrorToastMsg(backendMsg || '배너 목록 조회 실패');
      })
      .finally(() => setLoading(false));
  };

  const getCurrentParams = () => ({
    fromCreatedAt,
    toCreatedAt,
    titleKeyword,
    page,
    size: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    fetchBanners();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchBanners({ page: 0 });
  };

  const handleReset = () => {
    const resetState = {
      fromCreatedAt: "",
      toCreatedAt: "",
      replyStatus: "",
      titleKeyword: "",
      contentKeyword: "",
      page: 0,
    };

    setFromCreatedAt(resetState.fromCreatedAt);
    setToCreatedAt(resetState.toCreatedAt);
    setTitleKeyword(resetState.titleKeyword);
    setPage(0);

    fetchBanners(resetState);
  };

  // const handleDelete = async (bannerId: number) => {
  //   if (!bannerId) return;
  //   const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
  //   if (!confirmDelete) return;

  //   try {
  //     await deleteAdminBanner(Number(bannerId));
  //     alert("삭제가 완료되었습니다.");
  //     fetchBanners();
  //   } catch (error) {
  //     alert("삭제 중 오류가 발생했습니다.");
  //   }
  // };

  const totalPages = Math.max(Math.ceil(total / DEFAULT_PAGE_SIZE), 1);

  const columns = [
    { key: 'bannerId', header: '번호', render: (row: any) => row.bannerId },
    { key: 'title', header: '배너 제목', render: (row: any) => row.title },
    { key: 'bannerStatus', header: '상태', render: (row: any) => row.bannerStatus },
    { key: 'startAt', header: '게시 기간', render: (row: any) => row.startAt },
    { key: 'views', header: '조회수', render: (row: any) => row.views },
  ];

  const filteredBanners = banners.map((banner) => ({
    ...banner,
    bannerStatus: banner.bannerStatus === "PENDING"
      ? "대기"
      : banner.bannerStatus === "ACTIVE"
      ? "활성"
      : "만료"
  }));

  return (
    <Fragment>
      <SuccessToast open={!!successToastMsg} message={successToastMsg || ""} onClose={() => setSuccessToastMsg(null)} />
      <ErrorToast open={!!errorToastMsg} message={errorToastMsg || ""} onClose={() => setErrorToastMsg(null)} />
      <Toast open={!!toastMsg} message={toastMsg || ""} onClose={() => setToastMsg(null)} />
      <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">배너 관리</div>
          <Link
            to="/admin/banners/new"
            className="h-10 px-4 bg-indigo-600 rounded-md flex justify-center items-center gap-2 cursor-pointer hover:bg-indigo-700 transition"
          >
            <span className="material-symbols-outlined text-white">add</span>
            <span className="text-white text-sm font-semibold font-['Inter'] leading-none">배너 등록</span>
          </Link>
        </div>
        
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4"
          >
            <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">검색 조건</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">노출기간</div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <input
                        type="date"
                        ref={fromDateRef}
                        value={fromCreatedAt}
                        onChange={(e) => setFromCreatedAt(e.target.value)}
                        className="flex-1 h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm placeholder:text-slate-400 focus:outline-indigo-500 "
                      />
                      <span className="text-slate-500 text-sm">~</span>
                      <input
                        type="date"
                        value={toCreatedAt}
                        onChange={(e) => setToCreatedAt(e.target.value)}
                        className="flex-1 h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm placeholder:text-slate-400 focus:outline-indigo-500"
                      />
                    </div>
                  </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">배너명</div>
                  <div className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-center">
                    <input
                      value={titleKeyword}
                      onChange={(e) => setTitleKeyword(e.target.value)}
                      placeholder="배너명 검색"
                      className="w-full text-sm text-slate-700 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-end items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-28 h-12 bg-slate-100 rounded-lg flex justify-center items-center text-slate-500 text-sm font-medium font-['Inter'] leading-none hover:bg-slate-200 transition cursor-pointer"
                >
                  초기화
                </button>
                <button
                  type="submit"
                  className="w-28 h-12 bg-indigo-600 rounded-lg flex justify-center items-center text-white text-sm font-medium font-['Inter'] leading-none hover:bg-indigo-700 transition cursor-pointer"
                >
                  검색
                </button>
              </div>
            </div>
          </form>

          <TableSection title="배너 정보" total={filteredBanners.length}>
            {/* 데스크탑: 테이블 */}
            <div className="hidden md:block">
              <AdminTable
                loading={loading}
                columns={columns}
                data={filteredBanners}
                rowKey={row => row.bannerId}
                emptyMessage={"조회된 배너가 없습니다."}
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
              {filteredBanners.length === 0 ? (
                <div className="text-center text-gray-400 py-8">조회된 배너가 없습니다.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredBanners.map(row => (
                    <div
                      key={row.bannerId}
                      className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2 cursor-pointer"
                      // onClick 등 필요시 추가
                    >
                      <div className="font-semibold text-base text-gray-900">{row.title}</div>
                      <div className="text-sm text-gray-700 break-all">ID: {row.bannerId}</div>
                      <div className="text-sm text-gray-700 break-all">상태: {row.bannerStatus}</div>
                      <div className="text-sm text-gray-700 break-all">등록일: {row.createdAt}</div>
                      {/* 필요시 더 많은 필드 추가 */}
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