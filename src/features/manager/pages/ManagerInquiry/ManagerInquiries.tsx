import { Fragment, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import type {
  InquirySummary,
  InquiryCategory
} from '@/shared/types/InquiryType'
import { isValidDateRange } from '@/shared/utils/validation'
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/constants'
import {
  searchManagerInquiries,
  getCustomerInquiryCategories
} from '@/features/manager/api/managerInquiry'
import { ResetButton } from '@/shared/components/ui/ResetButton'
import { SearchButton } from '@/shared/components/ui/SearchButton'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'
import Toast from '@/shared/components/ui/toast/Toast'
import DateRangeCalendar from '@/shared/components/ui/DateRangeCalendar'
import { AdminPagination } from '@/features/admin/components/AdminPagination'

export const ManagerInquiries = () => {
  const [fadeKey, setFadeKey] = useState(0)
  const [inquiries, setInquiries] = useState<InquirySummary[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [fromCreatedAt, setFromCreatedAt] = useState<string>('')
  const [toCreatedAt, setToCreatedAt] = useState<string>('')
  const [replyStatus, setReplyStatus] = useState('')
  const [titleKeyword, setTitleKeyword] = useState('')
  const [contentKeyword, setContentKeyword] = useState('')
  const [, setCategories] = useState<InquiryCategory[]>([])
  const [showReplyStatusSelect, setShowReplyStatusSelect] = useState(false)
  const fromDateRef = useRef<HTMLInputElement>(null)

  // Toast 상태 관리
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null)
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null)

  const fetchInquiries = (
    paramsOverride?: Partial<ReturnType<typeof getCurrentParams>>
  ) => {
    const params = getCurrentParams()
    const finalParams = { ...params, ...paramsOverride }

    if (!isValidDateRange(finalParams.fromCreatedAt, finalParams.toCreatedAt)) {
      alert('시작일은 종료일보다 늦을 수 없습니다.')
      fromDateRef.current?.focus()
      return
    }

    searchManagerInquiries(finalParams)
      .then(res => {
        setInquiries(res.body?.content || [])
        setTotal(res.body?.page?.totalElements || 0)
        setFadeKey(prev => prev + 1)
      })
      .catch(error => {
        setErrorToastMsg(
          error.message || '문의사항 조회 중 오류가 발생했습니다.'
        )
      })
  }

  const getCurrentParams = () => ({
    fromCreatedAt,
    toCreatedAt,
    replyStatus: replyStatus === '' ? undefined : replyStatus === 'ANSWERED',
    titleKeyword,
    contentKeyword,
    page,
    size: DEFAULT_PAGE_SIZE
  })

  useEffect(() => {
    fetchInquiries()
    fetchCategories()
  }, [page])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.reply-status-dropdown')) {
        setShowReplyStatusSelect(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await getCustomerInquiryCategories()
      setCategories(res.body || [])
    } catch {
      setErrorToastMsg('카테고리를 불러오는 중 오류가 발생했습니다.')
    }
  }

  const handleSearch = () => {
    setPage(0)
    fetchInquiries({ page: 0 })
  }

  const handleReset = () => {
    const resetState = {
      fromCreatedAt: '',
      toCreatedAt: '',
      replyStatus: undefined,
      titleKeyword: '',
      contentKeyword: '',
      page: 0
    }

    setFromCreatedAt('')
    setToCreatedAt('')
    setReplyStatus('')
    setTitleKeyword('')
    setContentKeyword('')
    setPage(0)

    fetchInquiries(resetState)
    setToastMsg('검색 조건이 초기화되었습니다.')
  }

  const totalPages = Math.max(Math.ceil(total / DEFAULT_PAGE_SIZE), 1)

  return (
    <Fragment>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start justify-start">
        <div className="inline-flex h-16 items-center justify-between self-stretch border-b border-gray-200 bg-white px-6">
          <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
            문의사항 내역
          </div>
          <Link
            to="/managers/inquiries/new"
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 transition hover:bg-indigo-700">
            <span className="material-symbols-outlined text-white">add</span>
            <span className="font-['Inter'] text-sm leading-none font-semibold text-white">
              문의사항 등록
            </span>
          </Link>
        </div>

        <div className="flex flex-col items-start justify-start gap-6 self-stretch p-6">
          <div className="flex flex-col items-start justify-start gap-4 self-stretch rounded-xl bg-white p-6 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-start self-stretch">
              {/* 인라인 compact 검색 폼 */}
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleSearch()
                }}
                className="flex flex-row items-center gap-2 bg-transparent p-0">
                <div className="min-w-[280px]">
                  <DateRangeCalendar
                    startDate={fromCreatedAt}
                    endDate={toCreatedAt}
                    onDateRangeChange={(start, end) => {
                      setFromCreatedAt(start)
                      setToCreatedAt(end)
                      setPage(0)
                      fetchInquiries({ fromCreatedAt: start, toCreatedAt: end, page: 0 })
                    }}
                  />
                </div>
                <select
                  value={replyStatus}
                  onChange={e => setReplyStatus(e.target.value)}
                  className="h-8 min-w-[100px] rounded border border-gray-200 bg-white px-2 text-sm text-slate-700">
                  <option value="">전체</option>
                  <option value="PENDING">답변 대기</option>
                  <option value="ANSWERED">답변 완료</option>
                </select>
                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-2 -translate-y-1/2 transform text-gray-400"
                    size={14}
                  />
                  <input
                    type="text"
                    value={titleKeyword}
                    onChange={e => setTitleKeyword(e.target.value)}
                    placeholder="제목 검색"
                    className="h-8 min-w-[120px] rounded border border-gray-200 bg-white pr-2 pl-8 text-sm text-slate-700"
                  />
                </div>
                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-2 -translate-y-1/2 transform text-gray-400"
                    size={14}
                  />
                  <input
                    type="text"
                    value={contentKeyword}
                    onChange={e => setContentKeyword(e.target.value)}
                    placeholder="내용 검색"
                    className="h-8 min-w-[120px] rounded border border-gray-200 bg-white pr-2 pl-8 text-sm text-slate-700"
                  />
                </div>
                <ResetButton
                  onClick={handleReset}
                  className="h-8 px-4 text-xs"
                />
                <SearchButton
                  type="submit"
                  className="h-8 px-4 text-xs"
                />
              </form>
            </div>
            <div className="inline-flex items-center justify-end self-stretch">
              <div className="justify-start font-['Inter'] text-sm leading-none font-normal text-slate-500">
                총 {total}건
              </div>
            </div>
            <div className="inline-flex h-12 items-center justify-start self-stretch border-b border-slate-200 bg-slate-50 px-4">
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex flex-1 items-center justify-center gap-4">
                    <div className="w-[5%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      번호
                    </div>
                    <div className="w-[15%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      카테고리
                    </div>
                    <div className="w-[35%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      제목
                    </div>
                    <div className="w-[15%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      작성일시
                    </div>
                    <div className="reply-status-dropdown relative w-[30%] text-center font-['Inter'] text-sm leading-none font-semibold text-slate-700">
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className="cursor-pointer hover:text-indigo-600"
                          onClick={() =>
                            setShowReplyStatusSelect(!showReplyStatusSelect)
                          }>
                          답변 상태
                        </span>
                        <span
                          className="ml-1 cursor-pointer text-xs hover:text-indigo-600"
                          onClick={() =>
                            setShowReplyStatusSelect(!showReplyStatusSelect)
                          }>
                          ▼
                        </span>
                      </div>
                      {showReplyStatusSelect && (
                        <div className="absolute top-6 left-0 z-10 w-full rounded border border-indigo-500 bg-white shadow-lg">
                          <div
                            className="cursor-pointer px-2 py-1 text-center text-sm text-slate-700 hover:bg-indigo-50"
                            onClick={() => {
                              setReplyStatus('')
                              setShowReplyStatusSelect(false)
                              setPage(0)
                              fetchInquiries({ page: 0 })
                            }}>
                            전체
                          </div>
                          <div
                            className="cursor-pointer border-t border-gray-100 px-2 py-1 text-center text-sm text-slate-700 hover:bg-indigo-50"
                            onClick={() => {
                              setReplyStatus('PENDING')
                              setShowReplyStatusSelect(false)
                              setPage(0)
                              fetchInquiries({ page: 0 })
                            }}>
                            답변 대기
                          </div>
                          <div
                            className="cursor-pointer border-t border-gray-100 px-2 py-1 text-center text-sm text-slate-700 hover:bg-indigo-50"
                            onClick={() => {
                              setReplyStatus('ANSWERED')
                              setShowReplyStatusSelect(false)
                              setPage(0)
                              fetchInquiries({ page: 0 })
                            }}>
                            답변 완료
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              key={fadeKey}
              className="fade-in w-full">
              {inquiries.length === 0 ? (
                <div className="flex h-16 items-center self-stretch border-b border-slate-200 px-4 text-center">
                  <div className="w-full text-sm text-slate-500">
                    조회된 문의사항이 없습니다.
                  </div>
                </div>
              ) : (
                inquiries.map((inquiry, index) => (
                  <Link
                    key={inquiry.inquiryId}
                    to={`/managers/inquiries/${inquiry.inquiryId}`}
                    className="flex h-16 items-center gap-4 self-stretch border-b border-slate-200 px-4 text-center">
                    <div className="w-[5%] text-center font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      {page * DEFAULT_PAGE_SIZE + index + 1}
                    </div>
                    <div className="w-[15%] text-center font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      {inquiry.categoryName}
                    </div>
                    <div className="flex w-[35%] items-center text-left font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      {inquiry.title}
                    </div>
                    <div className="w-[15%] text-center font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      {inquiry.createdAt.split(' ')[0]}
                    </div>
                    <div className="flex w-[30%] justify-center text-center">
                      <div
                        className={`flex h-7 items-center rounded-2xl px-3 font-['Inter'] leading-none font-medium ${inquiry.isReplied ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <div
                          className={`text-sm font-medium ${inquiry.isReplied ? 'text-green-800' : 'text-yellow-800'}`}>
                          {inquiry.isReplied ? '답변 완료' : '답변 대기'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-6 flex w-full justify-center">
              <AdminPagination
                page={page}
                totalPages={totalPages}
                onChange={newPage => {
                  setPage(newPage)
                  fetchInquiries({ page: newPage })
                }}
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast 컴포넌트들 */}
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ''}
        onClose={() => setSuccessToastMsg(null)}
      />
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ''}
        onClose={() => setErrorToastMsg(null)}
      />
      <Toast
        open={!!toastMsg}
        message={toastMsg || ''}
        onClose={() => setToastMsg(null)}
      />
    </Fragment>
  )
}
