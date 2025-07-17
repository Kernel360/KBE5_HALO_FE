import { Fragment, useState, useRef, useEffect } from 'react'
import type { SearchManagerReviews as ManagerReviewType } from '@/features/manager/types/ManagerReviewlType'
import { isValidDateRange } from '@/shared/utils/validation'
import { searchManagerReviews } from '@/features/manager/api/managerReview'
import { REVIEW_PAGE_SIZE } from '@/shared/constants/constants'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import { AdminPagination } from '@/features/admin/components/AdminPagination'
import EmptyState from '@/shared/components/EmptyState'
import { SearchForm } from '@/shared/components/SearchForm'
import ManagerReviewCard from '@/features/manager/components/ManagerReviewCard'
import { useState as useLocalState } from 'react'
import { FunnelIcon } from '@heroicons/react/24/solid'
import ManagerReviewDetailModal from '@/features/manager/components/ManagerReviewDetailModal'
import DateRangeCalendar from '@/shared/components/ui/DateRangeCalendar'

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
  const [errorToastMessage, setErrorToastMessage] = useState<string | null>(
    null
  )
  const [showFilterBar, setShowFilterBar] = useLocalState(false)
  const [isFilterBarVisible, setIsFilterBarVisible] = useLocalState(false)
  const filterBarRef = useRef<HTMLDivElement>(null)
  const [filterBarMaxHeight, setFilterBarMaxHeight] = useLocalState('0px')
  const [selectedReview, setSelectedReview] =
    useState<ManagerReviewType | null>(null)

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

  // Handle expand/collapse with smooth transition
  useEffect(() => {
    if (showFilterBar) {
      setIsFilterBarVisible(true)
      setTimeout(() => {
        if (filterBarRef.current) {
          setFilterBarMaxHeight(`${filterBarRef.current.scrollHeight}px`)
        }
      }, 10) // allow DOM to render
    } else {
      if (filterBarRef.current) {
        setFilterBarMaxHeight('0px')
      }
    }
    // eslint-disable-next-line
  }, [showFilterBar, reviews]);

  const totalPages = Math.max(Math.ceil(total / REVIEW_PAGE_SIZE), 1)

  const getToday = () => {
    const today = new Date()
    return today.toISOString().slice(0, 10)
  }
  const getWeekStart = () => {
    const today = new Date()
    const day = today.getDay() || 7
    const monday = new Date(today)
    monday.setDate(today.getDate() - day + 1)
    return monday.toISOString().slice(0, 10)
  }
  const getMonthsAgo = (n: number) => {
    const today = new Date()
    today.setMonth(today.getMonth() - n)
    today.setDate(today.getDate() + 1) // inclusive
    return today.toISOString().slice(0, 10)
  }
  const isPreset = (
    from: string,
    to: string,
    type: 'all' | 'week' | '1month' | '3months' | '6months'
  ) => {
    const today = getToday()
    if (type === 'all') return !from && !to
    if (type === 'week') return from === getWeekStart() && to === today
    if (type === '1month') return from === getMonthsAgo(1) && to === today
    if (type === '3months') return from === getMonthsAgo(3) && to === today
    if (type === '6months') return from === getMonthsAgo(6) && to === today
    return false
  }
  const handlePreset = (
    type: 'all' | 'week' | '1month' | '3months' | '6months'
  ) => {
    let from = ''
    let to = getToday()
    if (type === 'week') {
      from = getWeekStart()
    } else if (type === '1month') {
      from = getMonthsAgo(1)
    } else if (type === '3months') {
      from = getMonthsAgo(3)
    } else if (type === '6months') {
      from = getMonthsAgo(6)
    } else if (type === 'all') {
      from = ''
      to = ''
    }
    setFromCreatedAt(from)
    setToCreatedAt(to)
    setPage(0)
    fetchReviews({ fromCreatedAt: from, toCreatedAt: to, page: 0 })
  }

  return (
    <Fragment>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start justify-start">
        <div className="inline-flex h-16 items-center justify-between self-stretch border-b border-gray-200 bg-white px-6">
          <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
            리뷰 관리
          </div>
        </div>

        <div className="flex flex-col items-start justify-start gap-6 self-stretch p-6">
          {/* 모바일: 검색/필터 헤더 및 토글 버튼 */}
          <div className="w-full bg-slate-50 px-2 py-4 md:hidden">
            <div className="mb-2 text-base font-bold text-slate-800">
              검색/필터
            </div>
            <button
              type="button"
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100"
              onClick={() => setShowFilterBar(prev => !prev)}>
              <FunnelIcon className="h-5 w-5" />
              {showFilterBar ? '검색/필터 닫기' : '검색/필터 열기'}
            </button>
          </div>

          {/* 필터 바: 검색 + 기간 + 평점 (모바일: 토글, 데스크탑: 항상 보임) */}
          {(isFilterBarVisible || window.innerWidth >= 768) && (
            <div
              ref={filterBarRef}
              className={`mb-4 w-full md:pointer-events-auto md:block md:max-h-none md:opacity-100`}
              style={{
                maxHeight:
                  window.innerWidth < 768 ? filterBarMaxHeight : undefined,
                opacity: window.innerWidth < 768 ? (showFilterBar ? 1 : 0) : 1,
                transition:
                  'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
                pointerEvents:
                  window.innerWidth < 768
                    ? showFilterBar
                      ? 'auto'
                      : 'none'
                    : 'auto'
              }}>
              {/* 모바일 카드형 필터/검색 바 */}
              <div className="flex w-full min-w-[25rem] flex-col gap-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 shadow-md md:hidden">
                {/* 기간 필터 */}
                <div className="flex flex-col gap-2">
                  <label className="mb-1 text-xs font-semibold text-indigo-600">
                    기간
                  </label>
                  <select
                    value={
                      isPreset(fromCreatedAt, toCreatedAt, 'all')
                        ? 'all'
                        : isPreset(fromCreatedAt, toCreatedAt, 'week')
                          ? 'week'
                          : isPreset(fromCreatedAt, toCreatedAt, '1month')
                            ? '1month'
                            : isPreset(fromCreatedAt, toCreatedAt, '3months')
                              ? '3months'
                              : isPreset(fromCreatedAt, toCreatedAt, '6months')
                                ? '6months'
                                : 'custom'
                    }
                    onChange={e => {
                      const val = e.target.value
                      if (
                        val === 'all' ||
                        val === 'week' ||
                        val === '1month' ||
                        val === '3months' ||
                        val === '6months'
                      ) {
                        handlePreset(val as any)
                      }
                    }}
                    className="h-10 rounded-md border border-indigo-200 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-300">
                    <option value="all">전체</option>
                    <option value="week">이번 주</option>
                    <option value="1month">최근 1개월</option>
                    <option value="3months">최근 3개월</option>
                    <option value="6months">최근 6개월</option>
                    <option value="custom">직접 선택</option>
                  </select>
                  <div className="mt-1">
                    <DateRangeCalendar
                      startDate={fromCreatedAt}
                      endDate={toCreatedAt}
                      onDateRangeChange={(start, end) => {
                        setFromCreatedAt(start)
                        setToCreatedAt(end)
                        setPage(0)
                        fetchReviews({ fromCreatedAt: start, toCreatedAt: end, page: 0 })
                      }}
                    />
                  </div>
                </div>
                {/* 평점 필터 */}
                <div className="flex flex-col gap-2">
                  <label className="mb-1 text-xs font-semibold text-indigo-600">
                    평점
                  </label>
                  <select
                    value={ratingOption}
                    onChange={e => {
                      setRatingOption(Number(e.target.value))
                      setPage(0)
                      fetchReviews({
                        ratingOption: Number(e.target.value),
                        page: 0
                      })
                    }}
                    className="h-10 rounded-md border border-indigo-200 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-300">
                    <option value={0}>전체</option>
                    <option value={5}>5점</option>
                    <option value={4}>4점</option>
                    <option value={3}>3점</option>
                    <option value={2}>2점</option>
                    <option value={1}>1점</option>
                  </select>
                </div>
                {/* 검색폼 */}
                <div className="mt-2 flex gap-2">
                  <select
                    value={customerNameKeyword ? 'customerName' : 'content'}
                    onChange={e => {
                      const type = e.target.value
                      setCustomerNameKeyword(
                        type === 'customerName'
                          ? customerNameKeyword || contentKeyword
                          : ''
                      )
                      setContentKeyword(
                        type === 'content'
                          ? customerNameKeyword || contentKeyword
                          : ''
                      )
                    }}
                    className="h-10 w-24 rounded-md border border-indigo-200 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-300">
                    <option value="customerName">고객명</option>
                    <option value="content">리뷰 내용</option>
                  </select>
                  <input
                    type="text"
                    value={customerNameKeyword || contentKeyword}
                    onChange={e => {
                      if (customerNameKeyword) {
                        setCustomerNameKeyword(e.target.value)
                        setContentKeyword('')
                      } else {
                        setContentKeyword(e.target.value)
                        setCustomerNameKeyword('')
                      }
                    }}
                    placeholder="검색어를 입력하세요"
                    className="h-10 flex-1 rounded-md border border-indigo-200 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPage(0)
                      fetchReviews({
                        customerNameKeyword,
                        contentKeyword,
                        page: 0
                      })
                    }}
                    className="h-10 rounded-md bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-600">
                    검색
                  </button>
                </div>
              </div>
              {/* 데스크탑(기존) 필터/검색 바 */}
              <div className="hidden min-w-[320px] flex-row items-center justify-between gap-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 shadow-none transition-all md:flex">
                {/* 필터 그룹 (왼쪽) */}
                <div className="flex flex-1 flex-row items-center gap-6">
                  {/* 기간 필터 */}
                  <div className="flex min-w-[180px] flex-row items-center gap-3">
                    <label className="min-w-[32px] text-sm font-semibold text-slate-600">
                      기간
                    </label>
                    <select
                      value={
                        isPreset(fromCreatedAt, toCreatedAt, 'all')
                          ? 'all'
                          : isPreset(fromCreatedAt, toCreatedAt, 'week')
                            ? 'week'
                            : isPreset(fromCreatedAt, toCreatedAt, '1month')
                              ? '1month'
                              : isPreset(fromCreatedAt, toCreatedAt, '3months')
                                ? '3months'
                                : isPreset(
                                      fromCreatedAt,
                                      toCreatedAt,
                                      '6months'
                                    )
                                  ? '6months'
                                  : 'custom'
                      }
                      onChange={e => {
                        const val = e.target.value
                        if (
                          val === 'all' ||
                          val === 'week' ||
                          val === '1month' ||
                          val === '3months' ||
                          val === '6months'
                        ) {
                          handlePreset(val as any)
                        }
                      }}
                      className="h-9 w-32 rounded-md border border-slate-300 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-200">
                      <option value="all">전체</option>
                      <option value="week">이번 주</option>
                      <option value="1month">최근 1개월</option>
                      <option value="3months">최근 3개월</option>
                      <option value="6months">최근 6개월</option>
                      <option value="custom">직접 선택</option>
                    </select>
                    <DateRangeCalendar
                      startDate={fromCreatedAt}
                      endDate={toCreatedAt}
                      onDateRangeChange={(start, end) => {
                        setFromCreatedAt(start)
                        setToCreatedAt(end)
                        setPage(0)
                        fetchReviews({ fromCreatedAt: start, toCreatedAt: end, page: 0 })
                      }}
                    />
                  </div>
                  {/* 평점 필터 */}
                  <div className="flex min-w-[100px] flex-row items-center gap-3">
                    <label className="min-w-[32px] text-sm font-semibold text-slate-600">
                      평점
                    </label>
                    <select
                      value={ratingOption}
                      onChange={e => {
                        setRatingOption(Number(e.target.value))
                        setPage(0)
                        fetchReviews({
                          ratingOption: Number(e.target.value),
                          page: 0
                        })
                      }}
                      className="h-9 w-24 rounded-md border border-slate-300 bg-white px-2 text-sm focus:ring-2 focus:ring-indigo-200">
                      <option value={0}>전체</option>
                      <option value={5}>5점</option>
                      <option value={4}>4점</option>
                      <option value={3}>3점</option>
                      <option value={2}>2점</option>
                      <option value={1}>1점</option>
                    </select>
                  </div>
                </div>
                {/* 검색 영역 (오른쪽) */}
                <div className="ml-auto w-auto flex-shrink-0">
                  <SearchForm
                    fields={[
                      {
                        type: 'select',
                        name: 'searchType',
                        options: [
                          { value: 'customerName', label: '고객명' },
                          { value: 'content', label: '리뷰 내용' }
                        ]
                      },
                      {
                        type: 'text',
                        name: 'keyword',
                        placeholder: '검색어를 입력하세요'
                      }
                    ]}
                    onSearch={values => {
                      setCustomerNameKeyword(
                        values.searchType === 'customerName'
                          ? values.keyword
                          : ''
                      )
                      setContentKeyword(
                        values.searchType === 'content' ? values.keyword : ''
                      )
                      setPage(0)
                      fetchReviews({
                        customerNameKeyword:
                          values.searchType === 'customerName'
                            ? values.keyword
                            : '',
                        contentKeyword:
                          values.searchType === 'content' ? values.keyword : '',
                        page: 0
                      })
                    }}
                    initialValues={{ searchType: 'customerName', keyword: '' }}
                    className="w-auto"
                  />
                </div>
              </div>
            </div>
          )}

          <div
            key={fadeKey}
            className="fade-in w-full min-w-[25rem] rounded-xl bg-white p-4 md:p-8">
            {reviews.length === 0 ? (
              <EmptyState message="조회된 리뷰가 없습니다." />
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {reviews.map(review => (
                  <ManagerReviewCard
                    key={review.reviewId}
                    review={review}
                    onClick={() => setSelectedReview(review)}
                  />
                ))}
              </div>
            )}
            {/* 페이징 */}
            <div className="mt-6 flex w-full justify-center">
              <AdminPagination
                page={page}
                totalPages={totalPages}
                onChange={newPage => {
                  setPage(newPage)
                  fetchReviews({ page: newPage })
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {errorToastMessage && (
        <ErrorToast
          open={!!errorToastMessage}
          message={errorToastMessage}
          onClose={() => setErrorToastMessage(null)}
        />
      )}
      {selectedReview && (
        <ManagerReviewDetailModal
          open={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          review={selectedReview}
        />
      )}
    </Fragment>
  )
}
