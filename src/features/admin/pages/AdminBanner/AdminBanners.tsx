import { Fragment, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import type { SearchAdminBanners as AdminBannerType } from "@/features/admin/types/AdminBannerType"
import { isValidDateRange } from "@/shared/utils/validation";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/constants";
import { searchAdminBanners } from "@/features/admin/api/adminBanners";

export const AdminBanners = () => {
  const [fadeKey, setFadeKey] = useState(0);
  const [banners, setBanners] = useState<AdminBannerType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [fromCreatedAt, setFromCreatedAt] = useState<string>("");
  const [toCreatedAt, setToCreatedAt] = useState<string>(""); 
  const [titleKeyword, setTitleKeyword] = useState("");
  const fromDateRef = useRef<HTMLInputElement>(null);

  const fetchBanners = (paramsOverride?: Partial<ReturnType<typeof getCurrentParams>>) => {
    const params = getCurrentParams();
    const finalParams = { ...params, ...paramsOverride };

    if (!isValidDateRange(finalParams.fromCreatedAt, finalParams.toCreatedAt)) {
      alert("시작일은 종료일보다 늦을 수 없습니다.");
      fromDateRef.current?.focus();
      return;
    }

    searchAdminBanners(finalParams)
      .then((res) => {
        setBanners(res.content);
        setTotal(res.page.totalElements);
        setFadeKey((prev) => prev + 1);
      });
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

  return (
    <Fragment>
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


          <div className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start">
            <div className="self-stretch inline-flex justify-between items-center pb-4">
              <div className="justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">배너 목록</div>
              <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">총 {total}건</div>
            </div>
            <div className="self-stretch h-12 px-4 bg-slate-50 border-b border-slate-200 inline-flex justify-start items-center">
              <div className="flex-1 flex justify-center items-center">
                <div className="flex-1 flex justify-center items-center">
                  <div className="flex-1 flex justify-center items-center gap-4">
                    <div className="w-[15%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">번호</div>
                    <div className="w-[30%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">배너 제목</div>
                    <div className="w-[15%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">상태</div>
                    <div className="w-[20%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">게시 기간</div>
                    <div className="w-[20%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">조회수</div>
                    {/* <div className="w-[15%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">작성일시</div> */}
                    {/* <div className="w-[20%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">관리</div> */}
                  </div>
                </div>
              </div>
            </div>


            <div key={fadeKey} className="w-full fade-in">
              { banners.length === 0 ? (
                <div className="self-stretch h-16 px-4 border-b border-slate-200 flex items-center text-center">
                  <div className="w-full text-sm text-slate-500">조회된 배너가 없습니다.</div>
                </div>
              ) : (
                banners.map((banner) => (
                  <Fragment>
                      <Link 
                        key={banner.bannerId}
                        to={`/admin/banners/${banner.bannerId}`}
                        className="self-stretch h-16 px-4 border-b border-slate-200 flex items-center text-center gap-4">
                        <div className="w-[15%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{banner.bannerId}</div>
                        <div className="w-[30%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{banner.title}</div>
                        <div className="w-[15%] text-center flex justify-center">
                          <div className={`h-7 px-3 rounded-2xl flex items-center font-medium font-['Inter'] leading-none ${
                                  banner.bannerStatus === "PENDING"
                                  ? "bg-yellow-100"
                                  : banner.bannerStatus === "ACTIVE"
                                  ? "bg-green-100"
                                  : "bg-gray-100" // EXPIRED
                            }`}>
                            <div className="text-sm font-medium">
                              { banner.bannerStatus === "PENDING"
                                  ? "대기"
                                  : banner.bannerStatus === "ACTIVE"
                                  ? "활성"
                                  : "만료"}
                            </div>
                          </div>
                        </div>
                        <div className="w-[20%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{banner.startAt} ~ {banner.endAt}</div>
                        <div className="w-[20%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{banner.views}</div>
                        {/* <div className="w-[15%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{banner.createdAt}</div> */}
                        {/* <div className="w-[20%] flex justify-center items-center gap-2 text-sm text-slate-700 font-medium font-['Inter'] leading-none">
                          <Link 
                            to={`/admin/banners/${banner.bannerId}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 rounded border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 cursor-pointer"
                          >
                            수정
                          </Link>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(banner.bannerId);
                            }}
                            className="px-2 py-1 rounded border border-red-600 text-red-600 text-sm font-medium hover:bg-red-50 cursor-pointer"
                          >
                            삭제
                          </button>
                        </div> */}
                      </Link>
                  </Fragment>
                ))
              )}
            </div>

            {/* 페이징 */}
            <div className="self-stretch flex justify-center gap-1 pt-4">
              <div
                className="w-8 h-8 rounded-md flex justify-center items-center cursor-pointer bg-slate-100 text-slate-500"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                <div className="text-sm font-medium font-['Inter'] leading-none">이전</div>
              </div>
              {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                <div
                  key={p}
                  className={`w-8 h-8 rounded-md flex justify-center items-center cursor-pointer ${
                    page === p ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                  onClick={() => setPage(p)}
                >
                  <div className="text-sm font-medium font-['Inter'] leading-none">{p + 1}</div>
                </div>
              ))}
              <div
                className="w-8 h-8 rounded-md flex justify-center items-center cursor-pointer bg-slate-100 text-slate-500"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              >
                <div className="text-sm font-medium font-['Inter'] leading-none">다음</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  );
};