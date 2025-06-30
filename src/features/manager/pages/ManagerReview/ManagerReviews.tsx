import { Fragment, useState, useRef, useEffect } from "react";
import type { SearchManagerReviews as ManagerReviewType } from "@/features/manager/types/ManagerReviewlType";
import { isValidDateRange } from "@/shared/utils/validation";
import { searchManagerReviews } from "@/features/manager/api/managerReview";
import { REVIEW_PAGE_SIZE } from "@/shared/constants/constants";

export const ManagerReviews = () => {
  const [fadeKey, setFadeKey] = useState(0);
  const [reviews, setReviews] = useState<ManagerReviewType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [fromCreatedAt, setFromCreatedAt] = useState<string>("");
  const [toCreatedAt, setToCreatedAt] = useState<string>(""); 
  const [ratingOption, setRatingOption] = useState(0); // 평점 검색 조건 (0 = 전체, 1~5 = 해당 점수)
  const [customerNameKeyword, setCustomerNameKeyword] = useState("");
  const [contentKeyword, setContentKeyword] = useState("");
  const fromDateRef = useRef<HTMLInputElement>(null);

  const fetchReviews = (paramsOverride?: Partial<ReturnType<typeof getCurrentParams>>) => {
    const params = getCurrentParams();
    const finalParams = {
      ...params,
      ...paramsOverride,
      ratingOption: // 여기서 ratingOption 0이면 제거
        (paramsOverride?.ratingOption ?? params.ratingOption) === 0
          ? undefined
          : (paramsOverride?.ratingOption ?? params.ratingOption),
    };

    if (!isValidDateRange(finalParams.fromCreatedAt, finalParams.toCreatedAt)) {
      alert("시작일은 종료일보다 늦을 수 없습니다.");
      fromDateRef.current?.focus();
      return;
    }

    searchManagerReviews(finalParams)
      .then((res) => {
        setReviews(res.content);
        setTotal(res.page.totalElements);
        setFadeKey((prev) => prev + 1);
      });
  };

  const getCurrentParams = () => ({
    fromCreatedAt,
    toCreatedAt,
    ratingOption,
    customerNameKeyword,
    contentKeyword,
    page,
    size: REVIEW_PAGE_SIZE,
  });

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchReviews({ page: 0 });
  };

  const handleReset = () => {
    const resetState = {
      fromCreatedAt: "",
      toCreatedAt: "",
      ratingOption: 0,
      customerNameKeyword: "",
      contentKeyword: "",
      page: 0,
    };

    setFromCreatedAt(resetState.fromCreatedAt);
    setToCreatedAt(resetState.toCreatedAt);
    setRatingOption(resetState.ratingOption);
    setCustomerNameKeyword(resetState.customerNameKeyword);
    setContentKeyword(resetState.contentKeyword);
    setPage(0);

    fetchReviews(resetState);
  };

  const totalPages = Math.max(Math.ceil(total / REVIEW_PAGE_SIZE), 1);

  return (
    <Fragment>
      <div className="flex-1 flex flex-col justify-start items-start w-full min-w-0">
        <div className="self-stretch h-16 px-6 bg-white border-b border-gray-200 inline-flex justify-between items-center">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-normal">리뷰 관리</div>
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
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">리뷰 작성일</div>
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
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">평점</div>
                  <select
                    value={ratingOption}
                    onChange={(e) => setRatingOption(Number(e.target.value))}
                    className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-indigo-500"
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
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">고객명</div>
                  <div className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-center">
                    <input
                      value={customerNameKeyword}
                      onChange={(e) => setCustomerNameKeyword(e.target.value)}
                      placeholder="고객명 입력"
                      className="w-full text-sm text-slate-700 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">리뷰 내용</div>
                  <div className="self-stretch h-12 px-4 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-center">
                    <input
                      value={contentKeyword}
                      onChange={(e) => setContentKeyword(e.target.value)}
                      placeholder="리뷰 내용 검색"
                      className="w-full text-sm text-slate-700 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-end items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-28 h-12 bg-slate-100 rounded-lg flex justify-center items-center text-slate-500 text-sm font-medium font-['Inter'] leading-none hover:bg-slate-200 transition"
                >
                  초기화
                </button>
                <button
                  type="submit"
                  className="w-28 h-12 bg-indigo-600 rounded-lg flex justify-center items-center text-white text-sm font-medium font-['Inter'] leading-none hover:bg-indigo-700 transition"
                >
                  검색
                </button>
              </div>
            </div>
          </form>



          <div className="w-full p-6 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-6">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">리뷰 내역</div>
              <div className="justify-start text-slate-500 text-sm font-normal font-['Inter'] leading-none">총 {total}건</div>
            </div>
            <div key={fadeKey} className="w-full fade-in">
              {reviews.length === 0 ? (
                <div className="self-stretch p-6 bg-slate-50 rounded-lg flex justify-center items-center mb-4 h-28">
                  <div className="text-sm text-slate-500 text-center">조회된 리뷰가 없습니다.</div>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.reviewId}
                    className="self-stretch p-6 bg-slate-50 rounded-lg flex flex-col justify-start items-start gap-4 mb-4"
                  >
                    {/* 상단: 고객명, 날짜, 서비스명, 별점 */}
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="flex justify-start items-center gap-3">
                        <div className="inline-flex flex-col justify-center items-start">
                          <div className="text-slate-800 text-base font-semibold leading-tight">
                            {review.authorName}
                          </div>
                          <div className="text-slate-500 text-sm font-normal leading-none">
                            {review.createdAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start items-center gap-1.5">
                        <div className="h-7 px-3 bg-sky-100 rounded-2xl flex justify-center items-center">
                          <div className="text-sky-900 text-sm font-medium leading-none">
                            {review.serviceName}
                          </div>
                        </div>
                        <div className="flex justify-end items-center gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span
                              key={i}
                              className={`material-icons-outlined text-base ${
                                review.rating >= i ? 'text-yellow-400' : 'text-slate-300'
                              }`}
                            >
                              star
                            </span>
                          ))}
                          <div className="text-slate-700 text-sm font-semibold leading-none ml-1">
                            {review.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 하단: 리뷰 내용 */}
                    <div className="self-stretch text-slate-700 text-base font-normal leading-tight">
                      {review.content}
                    </div>
                  </div>
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