import { Fragment, useState, useRef, useEffect } from 'react'
import type { SearchManagerReviews as ManagerReviewType } from '@/features/manager/types/ManagerReviewlType'
import { isValidDateRange } from '@/shared/utils/validation'
import { searchManagerReviews } from '@/features/manager/api/managerReview'
import { REVIEW_PAGE_SIZE } from '@/shared/constants/constants'
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import Pagination from "@/shared/components/Pagination";
import EmptyState from "@/shared/components/EmptyState";
import { SearchForm } from "@/shared/components/SearchForm";

export const ManagerReviews = () => {
  const [fadeKey, setFadeKey] = useState(0)
  const [reviews, setReviews] = useState<ManagerReviewType[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [fromCreatedAt, setFromCreatedAt] = useState<string>('')
  const [toCreatedAt, setToCreatedAt] = useState<string>('')
  const [ratingOption, setRatingOption] = useState(0) // 평점 검색 조건 (0 = 전체, 1~5 = 해당 점수)
  const [customerNameKeyword, setCustomerNameKeyword] = useState('')
  const [contentKeyword, setContentKeyword] = useState('')
  const fromDateRef = useRef<HTMLInputElement>(null)
  const [errorToastMessage, setErrorToastMessage] = useState<string | null>(null)

  const fetchReviews = (
    paramsOverride?: Partial<ReturnType<typeof getCurrentParams>>
  ) => {
    const params = getCurrentParams()
    const finalParams = {
      ...params,
      ...paramsOverride,
      // 여기서 ratingOption 0이면 제거
      ratingOption:
        (paramsOverride?.ratingOption ?? params.ratingOption) === 0
          ? undefined
          : (paramsOverride?.ratingOption ?? params.ratingOption)
    }

    if (!isValidDateRange(finalParams.fromCreatedAt, finalParams.toCreatedAt)) {
      setErrorToastMessage('시작일은 종료일보다 늦을 수 없습니다.')
      fromDateRef.current?.focus()
      return
    }

    searchManagerReviews(finalParams).then(res => {
      setReviews(res.content)
      setTotal(res.page.totalElements)
      setFadeKey(prev => prev + 1)
    })
  }

  const getCurrentParams = () => ({
    fromCreatedAt,
    toCreatedAt,
    ratingOption,
    customerNameKeyword,
    contentKeyword,
    page,
    size: REVIEW_PAGE_SIZE
  })

  useEffect(() => {
    fetchReviews()
  }, [page])

  const handleSearch = () => {
    setPage(0)
    fetchReviews({ page: 0 })
  }

  const handleReset = () => {
    const resetState = {
      fromCreatedAt: '',
      toCreatedAt: '',
      ratingOption: 0,
      customerNameKeyword: '',
      contentKeyword: '',
      page: 0
    }

    setFromCreatedAt(resetState.fromCreatedAt)
    setToCreatedAt(resetState.toCreatedAt)
    setRatingOption(resetState.ratingOption)
    setCustomerNameKeyword(resetState.customerNameKeyword)
    setContentKeyword(resetState.contentKeyword)
    setPage(0)

    fetchReviews(resetState)
  }

  const totalPages = Math.max(Math.ceil(total / REVIEW_PAGE_SIZE), 1)

  const getToday = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };
  const getWeekStart = () => {
    const today = new Date();
    const day = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    return monday.toISOString().slice(0, 10);
  };
  const getMonthStart = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  };
  const getMonthsAgo = (n: number) => {
    const today = new Date();
    today.setMonth(today.getMonth() - n);
    today.setDate(today.getDate() + 1); // inclusive
    return today.toISOString().slice(0, 10);
  };
  const isPreset = (
    from: string,
    to: string,
    type: "all" | "week" | "1month" | "3months" | "6months",
  ) => {
    const today = getToday();
    if (type === "all") return !from && !to;
    if (type === "week") return from === getWeekStart() && to === today;
    if (type === "1month") return from === getMonthsAgo(1) && to === today;
    if (type === "3months") return from === getMonthsAgo(3) && to === today;
    if (type === "6months") return from === getMonthsAgo(6) && to === today;
    return false;
  };
  const handlePreset = (type: "all" | "week" | "1month" | "3months" | "6months") => {
    let from = "";
    let to = getToday();
    if (type === "week") {
      from = getWeekStart();
    } else if (type === "1month") {
      from = getMonthsAgo(1);
    } else if (type === "3months") {
      from = getMonthsAgo(3);
    } else if (type === "6months") {
      from = getMonthsAgo(6);
    } else if (type === "all") {
      from = "";
      to = "";
    }
    setFromCreatedAt(from);
    setToCreatedAt(to);
    setPage(0);
    fetchReviews({ fromCreatedAt: from, toCreatedAt: to, page: 0 });
  };

  return (
    <Fragment>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start justify-start">
        <div className="inline-flex h-16 items-center justify-between self-stretch border-b border-gray-200 bg-white px-6">
          <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
            리뷰 관리
          </div>
        </div>

        <div className="flex flex-col items-start justify-start gap-6 self-stretch p-6">
          <div className="w-full flex justify-end mb-4">
            <SearchForm
              fields={[
                {
                  type: "select",
                  name: "searchType",
                  options: [
                    { value: "customerName", label: "고객명" },
                    { value: "content", label: "리뷰 내용" },
                  ],
                },
                {
                  type: "text",
                  name: "keyword",
                  placeholder: "검색어를 입력하세요",
                },
              ]}
              onSearch={(values) => {
                setCustomerNameKeyword(values.searchType === "customerName" ? values.keyword : "");
                setContentKeyword(values.searchType === "content" ? values.keyword : "");
                setPage(0);
                fetchReviews({
                  customerNameKeyword: values.searchType === "customerName" ? values.keyword : "",
                  contentKeyword: values.searchType === "content" ? values.keyword : "",
                  page: 0,
                });
              }}
              initialValues={{ searchType: "customerName", keyword: "" }}
            />
          </div>

          <div className="inline-flex w-full flex-col items-start justify-start gap-6 rounded-xl bg-white p-6 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
            <div className="inline-flex items-center justify-between self-stretch mb-4">
              <div className="justify-start font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
                리뷰 내역
              </div>
              {/* 필터 바: 기간, 평점 */}
              <div className="bg-slate-50 rounded-lg shadow-sm px-4 py-3 mb-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                {/* 기간 필터 */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 min-w-[220px]">
                  <label className="text-slate-600 font-semibold min-w-[36px]">기간</label>
                  <select
                    value={
                      isPreset(fromCreatedAt, toCreatedAt, "all")
                        ? "all"
                        : isPreset(fromCreatedAt, toCreatedAt, "week")
                        ? "week"
                        : isPreset(fromCreatedAt, toCreatedAt, "1month")
                        ? "1month"
                        : isPreset(fromCreatedAt, toCreatedAt, "3months")
                        ? "3months"
                        : isPreset(fromCreatedAt, toCreatedAt, "6months")
                        ? "6months"
                        : "custom"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (
                        val === "all" ||
                        val === "week" ||
                        val === "1month" ||
                        val === "3months" ||
                        val === "6months"
                      ) {
                        handlePreset(val as any);
                      }
                    }}
                    className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="all">전체</option>
                    <option value="week">이번 주</option>
                    <option value="1month">최근 1개월</option>
                    <option value="3months">최근 3개월</option>
                    <option value="6months">최근 6개월</option>
                    <option value="custom">직접 선택</option>
                  </select>
                  <input
                    type="date"
                    ref={fromDateRef}
                    value={fromCreatedAt}
                    onChange={(e) => {
                      setFromCreatedAt(e.target.value);
                      setPage(0);
                      fetchReviews({ fromCreatedAt: e.target.value, page: 0 });
                    }}
                    className="h-9 w-32 rounded-md border border-slate-300 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-200"
                  />
                  <span className="text-slate-400">~</span>
                  <input
                    type="date"
                    value={toCreatedAt}
                    onChange={(e) => {
                      setToCreatedAt(e.target.value);
                      setPage(0);
                      fetchReviews({ toCreatedAt: e.target.value, page: 0 });
                    }}
                    className="h-9 w-32 rounded-md border border-slate-300 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                {/* 평점 필터 */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 min-w-[120px]">
                  <label className="text-slate-600 font-semibold min-w-[36px]">평점</label>
                  <select
                    value={ratingOption}
                    onChange={(e) => {
                      setRatingOption(Number(e.target.value));
                      setPage(0);
                      fetchReviews({ ratingOption: Number(e.target.value), page: 0 });
                    }}
                    className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value={0}>전체</option>
                    <option value={5}>5점</option>
                    <option value={4}>4점</option>
                    <option value={3}>3점</option>
                    <option value={2}>2점</option>
                    <option value={1}>1점</option>
                  </select>
                </div>
              </div>
            </div>
            <div
              key={fadeKey}
              className="fade-in w-full">
              {reviews.length === 0 ? (
                <EmptyState message="조회된 리뷰가 없습니다." />
              ) : (
                reviews.map(review => (
                  <div
                    key={review.reviewId}
                    className="mb-4 flex flex-col items-start justify-start gap-4 self-stretch rounded-lg bg-slate-50 p-6">
                    {/* 상단: 고객명, 날짜, 서비스명, 별점 */}
                    <div className="inline-flex items-center justify-between self-stretch">
                      <div className="flex items-center justify-start gap-3">
                        <div className="inline-flex flex-col items-start justify-center">
                          <div className="text-base leading-tight font-semibold text-slate-800">
                            {review.authorName}
                          </div>
                          <div className="text-sm leading-none font-normal text-slate-500">
                            {review.createdAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-start gap-1.5">
                        <div className="flex h-7 items-center justify-center rounded-2xl bg-sky-100 px-3">
                          <div className="text-sm leading-none font-medium text-sky-900">
                            {review.serviceName}
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <span
                              key={i}
                              className={`material-icons-outlined text-base ${
                                review.rating >= i
                                  ? 'text-yellow-400'
                                  : 'text-slate-300'
                              }`}>
                              star
                            </span>
                          ))}
                          <div className="ml-1 text-sm leading-none font-semibold text-slate-700">
                            {review.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 하단: 리뷰 내용 */}
                    <div className="self-stretch text-base leading-tight font-normal text-slate-700">
                      {review.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* 페이징 */}
            <div className="flex justify-center mt-4 w-full">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
      {errorToastMessage && (
        <ErrorToast open={!!errorToastMessage} message={errorToastMessage} onClose={() => setErrorToastMessage(null)} />
      )}
    </Fragment>
  )
}
