import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchCustomerReviews } from '@/features/customer/api/CustomerReview'
import type { CustomerReviewRspType } from '../../types/CustomerReviewType'
import {
  getFormattedDate,
  formatTimeRange,
  formatDateWithDay
} from '@/shared/utils/dateUtils'
import { Star, Pencil } from 'lucide-react'
import Pagination from '@/shared/components/Pagination'
import { useAuthStore } from '@/store/useAuthStore'
import { CustomerReviewFormModal } from '../../modal/CustomerReviewModal'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'

const pageSize = 5

export const CustomerReviewsPage = () => {
  const [reviews, setReviews] = useState<CustomerReviewRspType[]>([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = (() => {
    const page = searchParams.get('page')
    return page ? parseInt(page) : 0
  })()

  const selectedRating = (() => {
    const rating = searchParams.get('rating')
    return rating ? parseInt(rating) : null
  })()

  const fetchReviews = useCallback(async () => {
    const { accessToken } = useAuthStore.getState()
    if (!accessToken) return

    try {
      const data = await searchCustomerReviews({
        page: currentPage,
        size: 5,
        rating: selectedRating === null ? undefined : selectedRating
      })
      setReviews(data.content)
      setTotalReviews(data.page.totalElements)
    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message || '리뷰 목록을 조회하는데 실패하였습니다.'
      alert(errorMessage)
    }
  }, [currentPage, selectedRating])

  useEffect(() => {
    fetchReviews()
  }, [currentPage, selectedRating, fetchReviews])

  const handleOpenModal = (reservationId: number) => {
    setSelectedReservationId(reservationId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReservationId(null)
  }

  const handleModalSuccess = async (message: string) => {
    setToastMessage(message)
    setShowSuccessToast(true)
    await fetchReviews()
  }

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    setSearchParams(params)
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">리뷰 내역</h2>

      {/* 리뷰 카드 */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p>조회한 리뷰 내역이 없습니다.</p>
          </div>
        ) : (
          reviews.map((review, idx) => (
            <ReviewCard
              key={idx}
              {...review}
              onOpenModal={handleOpenModal}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalReviews}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      {isModalOpen && selectedReservationId && (
        <CustomerReviewFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          reservationId={selectedReservationId}
          onSuccess={handleModalSuccess}
        />
      )}

      <SuccessToast
        open={showSuccessToast}
        message={toastMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  )
}

// 리뷰 카드
const ReviewCard: React.FC<
  CustomerReviewRspType & { onOpenModal: (reservationId: number) => void }
> = ({
  serviceCategoryName,
  requestDate,
  startTime,
  turnaround,
  managerName,
  content,
  rating,
  createdAt,
  reviewId,
  reservationId,
  onOpenModal
}) => {
  const handleWriteReview = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onOpenModal(reservationId)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* 리뷰 내용 */}
      {reviewId && (
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < (rating ?? 0)
                    ? 'fill-yellow-400 stroke-yellow-400 text-yellow-400'
                    : 'stroke-gray-300 text-gray-300'
                }
              />
            ))}
            <span className="text-lg font-bold text-gray-800">
              {typeof rating === 'number' ? Math.floor(rating) : '0'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            작성일: {getFormattedDate(new Date(createdAt))}
          </span>
        </div>
      )}
      <p className="mb-[10px] text-sm whitespace-pre-line text-gray-800">
        {content}
      </p>

      <hr className="border-gray-200" />

      {/* 예약 정보 + 매니저 정보 */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
            <span className="material-symbols-outlined text-3xl text-gray-500">
              photo_camera
            </span>
          </div>
          <div className="text-sm">
            <p className="text-gray-500">
              {formatDateWithDay(requestDate)}{' '}
              {formatTimeRange(startTime, turnaround)}
            </p>
            <p className="text-gray-400">{serviceCategoryName}</p>
            <p className="font-medium text-gray-800">{managerName}</p>
          </div>
        </div>

        {reviewId ? (
          <button
            onClick={handleWriteReview}
            className="flex cursor-pointer items-center gap-1 rounded-md border border-indigo-500 bg-white px-4 py-2 text-sm text-indigo-600 transition-colors duration-200 hover:bg-indigo-50">
            <Pencil className="h-4 w-4" />
            수정
          </button>
        ) : (
          <button
            onClick={handleWriteReview}
            className="flex cursor-pointer items-center gap-1 rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-indigo-700">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            리뷰 작성
          </button>
        )}
      </div>
    </div>
  )
}
