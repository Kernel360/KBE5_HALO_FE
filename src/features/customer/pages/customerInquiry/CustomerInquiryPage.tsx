// CustomerInquiryPage.tsx
import React, {
  Fragment,
  useEffect,
  useState,
  useCallback
} from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/constants"
import { Plus } from "lucide-react"
import { searchCustomerInquiries } from "@/features/customer/api/CustomerInquiries"
import type {
  InquirySummary,
  SearchInquiriesRequest
} from "@/shared/types/InquiryType"
import Pagination from "@/shared/components/Pagination"
import { useAuthStore } from "@/store/useAuthStore"

export const CustomerInquiryPage: React.FC = () => {
  const navigate = useNavigate()
  const [urlParams] = useSearchParams()
  const [fadeKey, setFadeKey] = useState(0)
  const [inquiries, setInquiries] = useState<InquirySummary[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const [searchParams, setSearchParams] = useState<SearchInquiriesRequest>({
    fromCreatedAt: undefined,
    toCreatedAt: undefined,
    replyStatus: undefined,
    titleKeyword: undefined,
    contentKeyword: undefined,
    page: 0,
    size: DEFAULT_PAGE_SIZE
  })

  // URL 파라미터에서 검색 조건 추출
  useEffect(() => {
    const startDate = urlParams.get("startDate")
    const endDate = urlParams.get("endDate")
    const replyStatus = urlParams.get("replyStatus")
    const titleKeyword = urlParams.get("titleKeyword")
    const contentKeyword = urlParams.get("contentKeyword")

    setSearchParams(prev => ({
      ...prev,
      fromCreatedAt: startDate || undefined,
      toCreatedAt: endDate || undefined,
      replyStatus: replyStatus ? replyStatus === "true" : undefined,
      titleKeyword: titleKeyword || undefined,
      contentKeyword: contentKeyword || undefined,
      page: 0
    }))
  }, [urlParams])

  // Helper function to format ISO date string to 'YYYY-MM-DD'
  const formatDateToYMD = (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().slice(0, 10)
  }

  // 문의사항 조회 함수
  const loadInquiries = useCallback(
    async (paramsToSearch: SearchInquiriesRequest) => {
      const { accessToken } = useAuthStore.getState()
      if (!accessToken) {
        alert("로그인이 필요합니다.")
        navigate("/auth/login")
        return
      }

      setLoading(true)
      try {
        const res = await searchCustomerInquiries(paramsToSearch)

        if (res?.body) {
          setInquiries(res.body.content)
          setTotal(res.body.page.totalElements)
          setFadeKey(prev => prev + 1)
        } else {
          setInquiries([])
          setTotal(0)
        }
      } catch (error: unknown) {
        const errorMessage =
          (error as {
            response?: { data?: { message?: string } }
            message?: string
          }).response?.data?.message ||
          (error as { message?: string }).message ||
          "문의사항 목록을 조회하는데 실패하였습니다."
        alert(errorMessage)
        setInquiries([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  // searchParams 변경 시 문의사항 조회
  useEffect(() => {
    loadInquiries(searchParams)
  }, [searchParams, loadInquiries])

  // Helper to update specific search parameter
  const updateSearchParam = (
    key: keyof SearchInquiriesRequest,
    value: unknown
  ) => {
    setSearchParams(prev => ({ ...prev, [key]: value }))
  }

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    updateSearchParam("page", pageNumber)
  }

  return (
    <Fragment>
      <div className="flex self-stretch">
        <div className="inline-flex flex-1 flex-col self-stretch">
          {/* Header Section */}
          <div className="inline-flex h-16 items-center justify-between self-stretch border-b border-gray-200 bg-white px-6">
            <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
              문의사항
            </div>
            <Link
              to="/my/inquiries/new"
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 transition hover:bg-indigo-700">
              <Plus className="h-4 w-4 text-white" />
              <span className="font-['Inter'] text-sm leading-none font-semibold text-white">
                문의하기
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-6 self-stretch p-6">
            {/* Inquiry List Section */}
            <div className="flex flex-col gap-4 self-stretch rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              {/* Table Header */}
              <div className="flex h-12 items-center border-b border-slate-200 bg-slate-50 px-4">
                <div className="w-[20%] text-center text-sm font-semibold text-slate-700">
                  문의 유형
                </div>
                <div className="w-[45%] text-center text-sm font-semibold text-slate-700">
                  제목
                </div>
                <div className="w-[20%] text-center text-sm font-semibold text-slate-700">
                  등록일
                </div>
                <div className="w-[15%] text-center text-sm font-semibold text-slate-700">
                  상태
                </div>
              </div>

              <div key={fadeKey}>
                {inquiries.length === 0 && !loading ? (
                  <div className="flex h-12 items-center justify-center border-b border-slate-200 px-4 text-sm text-slate-500">
                    조회된 문의사항이 없습니다.
                  </div>
                ) : (
                  inquiries.map(inquiry => (
                    <Link
                      key={inquiry.inquiryId}
                      to={`/my/inquiries/${inquiry.inquiryId}`}
                      className="flex h-12 cursor-pointer items-center border-b border-slate-200 px-4 transition hover:bg-slate-50">
                      <div className="w-[20%] text-center text-sm font-medium text-slate-700">
                        {inquiry.categoryName || "기타"}
                      </div>
                      <div className="w-[45%] text-center text-sm font-medium text-indigo-600">
                        {inquiry.title}
                      </div>
                      <div className="w-[20%] text-center text-sm font-medium text-slate-700">
                        {formatDateToYMD(inquiry.createdAt)}
                      </div>
                      <div className="flex w-[15%] items-center justify-center">
                        <span
                          className={`rounded-2xl px-3 py-1 text-sm font-normal ${
                            inquiry.isReplied
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                          {inquiry.isReplied ? "답변완료" : "처리중"}
                        </span>
                      </div>
                    </Link>
                  ))
                )}

                {loading && inquiries.length === 0 && (
                  <div className="flex h-16 items-center justify-center border-b border-slate-200 px-4 text-sm text-slate-500">
                    로딩 중...
                  </div>
                )}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={searchParams.page || 0}
                totalItems={total}
                pageSize={searchParams.size || DEFAULT_PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}