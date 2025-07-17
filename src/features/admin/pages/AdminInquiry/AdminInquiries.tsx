import { useEffect, useState, useRef, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import {
  searchAdminInquiries,
  fetchAdminInquiryCategories,
  fetchAdminInquiryAuthorTypes,
} from '@/features/admin/api/adminInquiry'
import type { EnumValue } from '@/features/admin/api/adminInquiry'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'
import Toast from '@/shared/components/ui/toast/Toast'
import type {
  SearchInquiriesRequest,
  InquirySummary
} from '@/features/admin/types/AdminInquiryType'
import { isValidDateRange } from '@/shared/utils/validation'
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/constants'
import TableSection from '../../components/TableSection'
import AdminPagination from '@/features/admin/components/AdminPagination'
import { ResetButton } from '@/shared/components/ui/ResetButton'

import { SearchButton } from '@/shared/components/ui/SearchButton'

export const AdminInquiries = () => {
  const [fadeKey, setFadeKey] = useState(0);
  const [inquiries, setInquiries] = useState<InquirySummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [fromCreatedAt, setFromCreatedAt] = useState<string>("");
  const [toCreatedAt, setToCreatedAt] = useState<string>("");
  const [replyStatus, setReplyStatus] = useState("");
  const [titleKeyword, setTitleKeyword] = useState("");
  const [contentKeyword, setContentKeyword] = useState("");
  const [userName, setUserName] = useState("");
  const [authorType, setAuthorType] = useState<"customer" | "manager" | "">("");
  const [categories, setCategories] = useState<EnumValue[]>([]);
  const [, setAuthorTypes] = useState<EnumValue[]>([]);
  const [showAuthorTypeSelect, setShowAuthorTypeSelect] = useState(false);
  const [showReplyStatusSelect, setShowReplyStatusSelect] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const fromDateRef = useRef<HTMLInputElement>(null);
  
  // Toast 상태 관리
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  const fetchInquiries = (
    paramsOverride?: Partial<SearchInquiriesRequest>,
  ) => {
    const params = getCurrentParams();
    const finalParams = { ...params, ...paramsOverride };

    if (!isValidDateRange(finalParams.fromCreatedAt || "", finalParams.toCreatedAt || "")) {
      alert("시작일은 종료일보다 늦을 수 없습니다.");
      fromDateRef.current?.focus();
      return;
    }

    searchAdminInquiries(finalParams)
      .then((res) => {
        setInquiries(res.content);
        setTotal(res.page.totalElements);
        setTotalPages(res.page.totalPages);
        setFadeKey((prev) => prev + 1);
      })
      .catch((err) => {
        console.error("문의사항 목록 조회 실패:", err);
        setErrorToastMsg(err.message || "문의사항 목록 조회에 실패했습니다.");
      });
  };

  const getCurrentParams = (): SearchInquiriesRequest => ({
    fromCreatedAt,
    toCreatedAt,
    replyStatus: replyStatus === "PENDING" ? false : replyStatus === "ANSWERED" ? true : undefined,
    titleKeyword,
    contentKeyword,
    userName,
    authorType: authorType as any,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    page,
    size: DEFAULT_PAGE_SIZE,
  });

  // 페이지 로드 시 카테고리와 작성자 타입 조회
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesData, authorTypesData] = await Promise.all([
          fetchAdminInquiryCategories(),
          fetchAdminInquiryAuthorTypes()
        ]);
        
        // categoriesData는 객체 형태이므로 값들을 배열로 변환
        const categoryList = Object.values(categoriesData).flat();
        setCategories(categoryList);
        setAuthorTypes(authorTypesData);
      } catch (error) {
        console.error("초기 데이터 로드 실패:", error);
        setErrorToastMsg("초기 데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [page]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.author-type-dropdown') && !target.closest('.reply-status-dropdown') && !target.closest('.category-dropdown')) {
        setShowAuthorTypeSelect(false);
        setShowReplyStatusSelect(false);
        setShowCategorySelect(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleSearch = () => {
    setPage(0);
    fetchInquiries({ page: 0 });
  };

  const handleReset = () => {
    setFromCreatedAt("");
    setToCreatedAt("");
    setReplyStatus("");
    setTitleKeyword("");
    setContentKeyword("");
    setUserName("");
    setAuthorType("");
    setSelectedCategories([]);
    setPage(0);

    fetchInquiries({ 
      page: 0,
      fromCreatedAt: "",
      toCreatedAt: "",
      replyStatus: undefined,
      titleKeyword: "",
      contentKeyword: "",
      userName: "",
      authorType: "",
      categories: undefined
    });
    
    setToastMsg("검색 조건이 초기화되었습니다.");
  };

  const handleAuthorTypeHeaderClick = () => {
    setShowAuthorTypeSelect(true);
  };

  const handleAuthorTypeChange = (value: string) => {
    setAuthorType(value as "customer" | "manager" | "");
    setShowAuthorTypeSelect(false);
    setPage(0);
    fetchInquiries({ page: 0, authorType: value as "customer" | "manager" | "" });
  };

  const handleReplyStatusHeaderClick = () => {
    setShowReplyStatusSelect(true);
  };

  const handleReplyStatusChange = (value: string) => {
    setReplyStatus(value);
    setShowReplyStatusSelect(false);
    setPage(0);
    fetchInquiries({ page: 0, replyStatus: value === "PENDING" ? false : value === "ANSWERED" ? true : undefined });
  };

  const handleCategoryHeaderClick = () => {
    setShowCategorySelect(true);
  };

  const handleCategoryChange = (categoryCode: string) => {
    let newCategories;
    if (selectedCategories.includes(categoryCode)) {
      newCategories = selectedCategories.filter(cat => cat !== categoryCode);
    } else {
      newCategories = [...selectedCategories, categoryCode];
    }
    setSelectedCategories(newCategories);
    setPage(0);
    fetchInquiries({ 
      page: 0, 
      categories: newCategories.length > 0 ? newCategories : undefined 
    });
  };

  return (
    <Fragment>
      <div className="w-full flex flex-col">
        <div className="self-stretch h-16 px-4 sm:px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="justify-start text-gray-900 text-lg sm:text-xl font-bold font-['Inter'] leading-normal">
            문의사항
          </div>
        </div>

        {/* 내용 */}
        <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
          {/* 검색 폼 */}
          <div className="w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="space-y-4"
            >
              {/* 검색 조건들과 버튼들을 한 줄에 배치 */}
              <div className="flex flex-wrap items-center gap-2">
                {/* 날짜 범위 */}
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    ref={fromDateRef}
                    value={fromCreatedAt}
                    onChange={(e) => setFromCreatedAt(e.target.value)}
                    className="h-9 px-2.5 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[125px]"
                  />
                  <span className="text-slate-500 text-sm flex items-center">~</span>
                  <input
                    type="date"
                    value={toCreatedAt}
                    onChange={(e) => setToCreatedAt(e.target.value)}
                    className="h-9 px-2.5 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[125px]"
                  />
                </div>
                
                {/* 제목 검색 */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
                  <input
                    type="text"
                    value={titleKeyword}
                    onChange={(e) => setTitleKeyword(e.target.value)}
                    placeholder="제목"
                    className="h-9 pl-8 pr-2.5 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[120px]"
                  />
                </div>
                
                {/* 내용 검색 */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
                  <input
                    type="text"
                    value={contentKeyword}
                    onChange={(e) => setContentKeyword(e.target.value)}
                    placeholder="내용"
                    className="h-9 pl-8 pr-2.5 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[120px]"
                  />
                </div>
                
                {/* 작성자 이름 */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="작성자"
                    className="h-9 pl-8 pr-2.5 bg-white rounded border border-gray-200 text-sm text-slate-700 min-w-[120px]"
                  />
                </div>
                
                {/* 버튼들 */}
                <div className="flex gap-2">
                  <ResetButton onClick={handleReset} />
                  <SearchButton type="submit" />
                </div>
              </div>
            </form>
          </div>

          <TableSection
            title="문의사항 내역"
            total={total}
            className="min-h-[70vh] flex-1"
            authorType={authorType as string}
            replyStatus={replyStatus}
            selectedCategories={selectedCategories}
            categories={categories}
          >
            {/* 데스크톱 테이블 헤더 */}
            <div className="hidden lg:block self-stretch h-12 px-4 bg-slate-50 border-b border-slate-200">
              <div className="h-full flex items-center gap-4">
                <div className="w-[5%] text-center text-sm font-semibold text-slate-700">번호</div>
                <div className="w-[8%] text-center text-sm font-semibold text-slate-700 relative author-type-dropdown">
                  <div className="flex items-center justify-center gap-1">
                    <span className="cursor-pointer hover:text-indigo-600" onClick={handleAuthorTypeHeaderClick}>작성자 타입</span>
                    <span className="ml-1 text-xs cursor-pointer hover:text-indigo-600" onClick={handleAuthorTypeHeaderClick}>▼</span>
                  </div>
                  {showAuthorTypeSelect && (
                    <div className="absolute top-6 left-0 w-full bg-white rounded border border-indigo-500 z-10 shadow-lg">
                      <div className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center" onClick={() => handleAuthorTypeChange("")}>전체</div>
                      <div className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center border-t border-gray-100" onClick={() => handleAuthorTypeChange("customer")}>수요자</div>
                      <div className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center border-t border-gray-100" onClick={() => handleAuthorTypeChange("manager")}>매니저</div>
                    </div>
                  )}
                </div>
                <div className="w-[18%] text-center text-sm font-semibold text-slate-700 relative category-dropdown">
                  <div className="flex items-center justify-center gap-1">
                    <span className="cursor-pointer hover:text-indigo-600" onClick={handleCategoryHeaderClick}>문의유형</span>
                    <span className="ml-1 text-xs cursor-pointer hover:text-indigo-600" onClick={handleCategoryHeaderClick}>▼</span>
                  </div>
                  {showCategorySelect && (
                    <div className="absolute top-6 left-0 w-full bg-white rounded border border-indigo-500 z-10 shadow-lg max-h-48 overflow-y-auto">
                      <div className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center border-b border-gray-100" onClick={() => { setSelectedCategories([]); setPage(0); fetchInquiries({ page: 0 }); }}>전체 선택 해제</div>
                      {categories.map((category) => (
                        <div key={category.code} className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center border-t border-gray-100 flex items-center gap-2" onClick={() => handleCategoryChange(category.code)}>
                          <input type="checkbox" checked={selectedCategories.includes(category.code)} onChange={() => {}} className="w-3 h-3" />
                          <span className="flex-1">{category.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-[44%] text-center text-sm font-semibold text-slate-700">제목</div>
                <div className="w-[12%] text-center text-sm font-semibold text-slate-700">작성자</div>
                <div className="w-[15%] text-center text-sm font-semibold text-slate-700">작성일시</div>
                <div className="w-[8%] text-center text-sm font-semibold text-slate-700 relative reply-status-dropdown">
                  <div className="flex items-center justify-center gap-1">
                    <span className="cursor-pointer hover:text-indigo-600" onClick={handleReplyStatusHeaderClick}>답변 상태</span>
                    <span className="ml-1 text-xs cursor-pointer hover:text-indigo-600" onClick={handleReplyStatusHeaderClick}>▼</span>
                  </div>
                  {showReplyStatusSelect && (
                    <div className="absolute top-6 left-0 w-full bg-white rounded border border-indigo-500 z-10 shadow-lg">
                      <div className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center" onClick={() => handleReplyStatusChange("")}>전체</div>
                      <div className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center border-t border-gray-100" onClick={() => handleReplyStatusChange("PENDING")}>답변 대기</div>
                      <div className="px-2 py-1 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer text-center border-t border-gray-100" onClick={() => handleReplyStatusChange("ANSWERED")}>답변 완료</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div key={fadeKey} className="w-full fade-in h-[400px] sm:h-[500px] lg:h-[640px] overflow-y-auto">
              {inquiries.length === 0 ? (
                <div className="self-stretch h-16 px-4 border-b border-slate-200 flex items-center justify-center text-center">
                  <div className="w-full text-sm text-slate-500">조회된 문의사항이 없습니다.</div>
                </div>
              ) : (
                inquiries.map((inquiry, index) => (
                  <Link
                    key={inquiry.inquiryId}
                    to={`/admin/inquiries/${inquiry.inquiryId}`}
                    state={{ authorId: inquiry.userName ? undefined : inquiry.inquiryId }}
                    className="block"
                  >
                    {/* 데스크톱 뷰 */}
                    <div className="hidden lg:flex self-stretch h-16 px-4 border-b border-slate-200 items-center gap-4 hover:bg-gray-50">
                      <div className="w-[5%] text-center text-sm text-slate-700 font-medium">{page * DEFAULT_PAGE_SIZE + index + 1}</div>
                      <div className="w-[8%] text-center text-sm text-slate-700 font-medium">{inquiry.authorType}</div>
                      <div className="w-[18%] flex justify-center">
                        <div className={`h-7 px-3 rounded-2xl flex items-center font-medium ${
                          inquiry.categoryName === "일반문의" ? "bg-blue-100 text-blue-800" :
                          inquiry.categoryName === "불만 및 불편사항" ? "bg-red-100 text-red-800" :
                          inquiry.categoryName === "기타" ? "bg-gray-200 text-gray-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          <div className="text-sm font-medium">{inquiry.categoryName || "-"}</div>
                        </div>
                      </div>
                      <div className="w-[44%] flex items-center text-sm text-slate-700 text-left font-medium truncate">{inquiry.title}</div>
                      <div className="w-[12%] text-center text-sm text-slate-700 font-medium">{inquiry.userName}</div>
                      <div className="w-[15%] text-center text-sm text-slate-700 font-medium">
                        <div className="flex flex-col">
                          <div>{inquiry.createdAt.split(' ')[0]}</div>
                          <div>{inquiry.createdAt.split(' ')[1]}</div>
                        </div>
                      </div>
                      <div className="w-[8%] text-center flex justify-center">
                        <div className={`h-7 px-3 rounded-2xl flex items-center font-medium ${inquiry.isReplied ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-800"}`}>
                          <div className="text-sm font-medium">{inquiry.isReplied ? "답변 완료" : "답변 대기"}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 모바일/태블릿 뷰 */}
                    <div className="lg:hidden p-4 border-b border-slate-200 space-y-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">#{page * DEFAULT_PAGE_SIZE + index + 1}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{inquiry.authorType}</span>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${inquiry.isReplied ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-800"}`}>
                          {inquiry.isReplied ? "답변완료" : "답변대기"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className={`inline-block px-2 py-1 rounded text-xs ${
                          inquiry.categoryName === "일반문의" ? "bg-blue-100 text-blue-800" :
                          inquiry.categoryName === "불만 및 불편사항" ? "bg-red-100 text-red-800" :
                          inquiry.categoryName === "기타" ? "bg-gray-200 text-gray-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {inquiry.categoryName || "미지정"}
                        </div>
                        <h3 className="font-medium text-gray-900 line-clamp-2">{inquiry.title}</h3>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>작성자: {inquiry.userName || "익명"}</span>
                          <span>{inquiry.createdAt.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* 페이징 */}
            <AdminPagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </TableSection>
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
