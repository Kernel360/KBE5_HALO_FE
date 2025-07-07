import { Fragment, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import type { InquirySummary, InquiryCategory } from "@/shared/types/InquiryType";
import { isValidDateRange } from "@/shared/utils/validation";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/constants";
import { searchManagerInquiries, getCustomerInquiryCategories } from "@/features/manager/api/managerInquiry";
import { ResetButton } from "@/shared/components/ui/ResetButton";
import { SearchButton } from "@/shared/components/ui/SearchButton";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import SuccessToast from "@/shared/components/ui/toast/SuccessToast";
import Toast from "@/shared/components/ui/toast/Toast";

export const ManagerInquiries = () => {
  const [fadeKey, setFadeKey] = useState(0);
  const [inquiries, setInquiries] = useState<InquirySummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [fromCreatedAt, setFromCreatedAt] = useState<string>("");
  const [toCreatedAt, setToCreatedAt] = useState<string>(""); 
  const [replyStatus, setReplyStatus] = useState("");
  const [titleKeyword, setTitleKeyword] = useState("");
  const [contentKeyword, setContentKeyword] = useState("");
  const [, setCategories] = useState<InquiryCategory[]>([]);
  const [showReplyStatusSelect, setShowReplyStatusSelect] = useState(false);
  const fromDateRef = useRef<HTMLInputElement>(null);
  
  // Toast 상태 관리
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  const fetchInquiries = (paramsOverride?: Partial<ReturnType<typeof getCurrentParams>>) => {
    const params = getCurrentParams();
    const finalParams = { ...params, ...paramsOverride };

    if (!isValidDateRange(finalParams.fromCreatedAt, finalParams.toCreatedAt)) {
      alert("시작일은 종료일보다 늦을 수 없습니다.");
      fromDateRef.current?.focus();
      return;
    }

    searchManagerInquiries(finalParams)
      .then((res) => {
        setInquiries(res.body?.content || []);
        setTotal(res.body?.page?.totalElements || 0);
        setFadeKey((prev) => prev + 1);
      })
      .catch((error) => {
        setErrorToastMsg(error.message || "문의사항 조회 중 오류가 발생했습니다.");
      });
  };

  const getCurrentParams = () => ({
    fromCreatedAt,
    toCreatedAt,
    replyStatus: replyStatus === "" ? undefined : replyStatus === "ANSWERED",
    titleKeyword,
    contentKeyword,
    page,
    size: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    fetchInquiries();
    fetchCategories();
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.reply-status-dropdown')) {
        setShowReplyStatusSelect(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCustomerInquiryCategories();
      setCategories(res.body || []);
    } catch (error) {
      setErrorToastMsg('카테고리를 불러오는 중 오류가 발생했습니다.');}
  };

  const handleSearch = () => {
    setPage(0);
    fetchInquiries({ page: 0 });
  };

  const handleReset = () => {
    const resetState = {
      fromCreatedAt: "",
      toCreatedAt: "",
      replyStatus: undefined,
      titleKeyword: "",
      contentKeyword: "",
      page: 0,
    };

    setFromCreatedAt("");
    setToCreatedAt("");
    setReplyStatus("");
    setTitleKeyword("");
    setContentKeyword("");
    setPage(0);

    fetchInquiries(resetState);
    setToastMsg("검색 조건이 초기화되었습니다.");
  };

  const totalPages = Math.max(Math.ceil(total / DEFAULT_PAGE_SIZE), 1);

  return (
    <Fragment>
      <div className="flex-1 flex flex-col justify-start items-start w-full min-w-0">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">문의사항 내역</div>
          <Link
            to="/managers/inquiries/new"
            className="h-10 px-4 bg-indigo-600 rounded-md flex justify-center items-center gap-2 cursor-pointer hover:bg-indigo-700 transition"
          >
            <span className="material-symbols-outlined text-white">add</span>
            <span className="text-white text-sm font-semibold font-['Inter'] leading-none">문의사항 등록</span>
          </Link>
        </div>
        
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
          <div className="self-stretch p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex justify-start items-center">
              {/* 인라인 compact 검색 폼 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex flex-row items-center gap-2 bg-transparent p-0"
              >
                <input
                  type="date"
                  ref={fromDateRef}
                  value={fromCreatedAt}
                  onChange={(e) => setFromCreatedAt(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="h-8 px-2 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[120px]"
                />
                <span className="text-slate-500 text-xs">~</span>
                <input
                  type="date"
                  value={toCreatedAt}
                  onChange={(e) => setToCreatedAt(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="h-8 px-2 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[120px]"
                />
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                  className="h-8 px-2 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[100px]"
                >
                  <option value="">전체</option>
                  <option value="PENDING">답변 대기</option>
                  <option value="ANSWERED">답변 완료</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    value={titleKeyword}
                    onChange={(e) => setTitleKeyword(e.target.value)}
                    placeholder="제목 검색"
                    className="h-8 pl-8 pr-2 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[120px]"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    value={contentKeyword}
                    onChange={(e) => setContentKeyword(e.target.value)}
                    placeholder="내용 검색"
                    className="h-8 pl-8 pr-2 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[120px]"
                  />
                </div>
                <ResetButton onClick={handleReset} className="h-8 px-4 text-xs" />
                <SearchButton type="submit" className="h-8 px-4 text-xs" />
              </form>
            </div>
            <div className="self-stretch inline-flex justify-end items-center">
              <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">총 {total}건</div>
            </div>
            <div className="self-stretch h-12 px-4 bg-slate-50 border-b border-slate-200 inline-flex justify-start items-center">
              <div className="flex-1 flex justify-center items-center">
                <div className="flex-1 flex justify-center items-center">
                  <div className="flex-1 flex justify-center items-center gap-4">
                    <div className="w-[5%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">번호</div>
                    <div className="w-[15%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">카테고리</div>
                    <div className="w-[35%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">제목</div>
                    <div className="w-[15%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none">작성일시</div>
                    <div className="w-[30%] text-center text-sm font-semibold text-slate-700 font-semibold font-['Inter'] leading-none relative reply-status-dropdown">
                      <div className="flex items-center justify-center gap-1">
                        <span className="cursor-pointer hover:text-indigo-600" onClick={() => setShowReplyStatusSelect(!showReplyStatusSelect)}>
                          답변 상태
                        </span>
                        <span 
                          className="ml-1 text-xs cursor-pointer hover:text-indigo-600" 
                          onClick={() => setShowReplyStatusSelect(!showReplyStatusSelect)}
                        >
                          ▼
                        </span>
                      </div>
                      {showReplyStatusSelect && (
                        <div className="absolute top-6 left-0 w-full bg-white rounded border border-indigo-500 z-10 shadow-lg">
                          <div 
                            className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center"
                            onClick={() => {
                              setReplyStatus("");
                              setShowReplyStatusSelect(false);
                              setPage(0);
                              fetchInquiries({ page: 0 });
                            }}
                          >
                            전체
                          </div>
                          <div 
                            className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center border-t border-gray-100"
                            onClick={() => {
                              setReplyStatus("PENDING");
                              setShowReplyStatusSelect(false);
                              setPage(0);
                              fetchInquiries({ page: 0 });
                            }}
                          >
                            답변 대기
                          </div>
                          <div 
                            className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center border-t border-gray-100"
                            onClick={() => {
                              setReplyStatus("ANSWERED");
                              setShowReplyStatusSelect(false);
                              setPage(0);
                              fetchInquiries({ page: 0 });
                            }}
                          >
                            답변 완료
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div key={fadeKey} className="w-full fade-in">
              { inquiries.length === 0 ? (
                <div className="self-stretch h-16 px-4 border-b border-slate-200 flex items-center text-center">
                  <div className="w-full text-sm text-slate-500">조회된 문의사항이 없습니다.</div>
                </div>
              ) : (
                inquiries.map((inquiry, index) => (
                  <Link 
                    key={inquiry.inquiryId}
                    to={`/managers/inquiries/${inquiry.inquiryId}`}
                    className="self-stretch h-16 px-4 border-b border-slate-200 flex items-center text-center gap-4">
                    <div className="w-[5%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{page * DEFAULT_PAGE_SIZE + index + 1}</div>
                    <div className="w-[15%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{inquiry.categoryName}</div>
                    <div className="w-[35%] flex items-center text-sm text-slate-700 text-left font-medium font-['Inter'] leading-none">{inquiry.title}</div>
                    <div className="w-[15%] text-center text-sm text-slate-700 font-medium font-['Inter'] leading-none">{inquiry.createdAt.split(' ')[0]}</div>
                    <div className="w-[30%] text-center flex justify-center">
                      <div className={`h-7 px-3 rounded-2xl flex items-center font-medium font-['Inter'] leading-none ${inquiry.isReplied ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <div className={`text-sm font-medium ${inquiry.isReplied ? 'text-green-800' : 'text-yellow-800'}`}>
                          {inquiry.isReplied ? '답변 완료' : '답변 대기'}
                        </div>
                      </div>
                    </div>
                  </Link>
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
      
      {/* Toast 컴포넌트들 */}
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
    </Fragment>
  );
};