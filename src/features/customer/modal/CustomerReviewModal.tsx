import React, { useEffect, useState } from 'react'
import { Star, X } from 'lucide-react'
import {
  createCustomerReview,
  getCustomerReviewByReservationId,
  updateCustomerReview
} from '@/features/customer/api/CustomerReview'
import type { CustomerReviewRspType } from '@/features/customer/types/CustomerReviewType'
import { formatDateWithDay, formatTimeRange } from '@/shared/utils/dateUtils'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import ProfileImagePreview from '@/shared/components/ui/ProfileImagePreview'

interface CustomerReviewFormModalProps {
  isOpen: boolean
  onClose: () => void
  reservationId: number
  onSuccess?: (message: string) => Promise<void>
}

export const CustomerReviewFormModal: React.FC<
  CustomerReviewFormModalProps
> = ({ isOpen, onClose, reservationId, onSuccess }) => {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewFromReservation, setReviewFromReservation] =
    useState<CustomerReviewRspType | null>(null)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingReview, setFetchingReview] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (isOpen && reservationId) {
      fetchReview()
    }
  }, [isOpen, reservationId])

  const fetchReview = async () => {
    setFetchingReview(true)
    try {
      const response = await getCustomerReviewByReservationId(reservationId)
      if (response?.body) {
        setReviewFromReservation(response.body)
        if (response.body.rating !== null) {
          setRating(response.body.rating)
        }
        if (response.body.content !== null) {
          setContent(response.body.content)
        }
      }
    } catch {
      setToastMessage('리뷰 조회에 실패했습니다.')
      setShowErrorToast(true)
    } finally {
      setFetchingReview(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setContent('')
    setHoveredRating(0)
    setReviewFromReservation(null)
    setAttemptedSubmit(false)
    setLoading(false)
    setFetchingReview(false)
    onClose()
  }

  const handleSubmit = async () => {
    setAttemptedSubmit(true)

    if (rating === 0) {
      setToastMessage('별점을 선택해주세요.')
      setShowErrorToast(true)
      return
    }

    if (!content.trim()) {
      setToastMessage('리뷰 내용을 입력해주세요.')
      setShowErrorToast(true)
      return
    }

    if (content.trim().length < 5 || content.trim().length > 600) {
      setToastMessage('리뷰 내용은 최소 5글자, 최대 600글자여야 합니다.')
      setShowErrorToast(true)
      return
    }

    setLoading(true)

    try {
      const payload = { reservationId, rating, content }

      let successMessage = ''
      if (reviewFromReservation?.reviewId) {
        await updateCustomerReview(
          Number(reviewFromReservation.reviewId),
          payload
        )
        successMessage = '리뷰가 수정되었습니다.'
      } else {
        await createCustomerReview(reservationId, payload)
        successMessage = '리뷰가 등록되었습니다.'
      }

      await onSuccess?.(successMessage)
      handleClose()
    } catch {
      setToastMessage('리뷰 저장에 실패했습니다. 다시 시도해주세요.')
      setShowErrorToast(true)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="w-[400px] overflow-hidden rounded-3xl border border-indigo-300 bg-white">
          {/* 헤더 */}
          <div className="flex items-center justify-between bg-[#6366F1] px-6 py-4 text-white">
            <h2 className="text-lg font-bold">리뷰쓰기</h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* 서비스 정보 */}
            <div className="mb-8 flex items-center gap-4 rounded-xl bg-gray-50 p-4">
              <ProfileImagePreview
                src={
                  reviewFromReservation?.path
                    ? (() => {
                        try {
                          const arr = JSON.parse(reviewFromReservation.path)
                          return Array.isArray(arr) && arr.length > 0
                            ? arr[0]
                            : undefined
                        } catch {
                          return undefined
                        }
                      })()
                    : undefined
                }
                alt={`${reviewFromReservation?.managerName} 매니저 프로필`}
                size="sm"
                className="shadow-sm ring-2 ring-white"
              />
              <div className="flex-1">
                {fetchingReview ? (
                  <div className="space-y-2">
                    <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-1 text-sm text-gray-500">
                      {reviewFromReservation && (
                        <>
                          {formatDateWithDay(reviewFromReservation.requestDate)}{' '}
                          {formatTimeRange(
                            reviewFromReservation.startTime,
                            reviewFromReservation.turnaround
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-gray-900">
                      {reviewFromReservation?.serviceCategoryName}
                    </div>
                    <div className="text-gray-600">
                      {reviewFromReservation?.managerName}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 별점 */}
            <div className="mb-6">
              <div className="mb-2 text-center text-lg">
                서비스에 만족하셨나요?
              </div>
              <div className="mb-1 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${
                      (hoveredRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <div className="text-center text-gray-600">{rating}점</div>
            </div>

            {/* 리뷰 내용 */}
            <div className="mb-6">
              <div className="mb-2 text-gray-900">리뷰 내용</div>
              <textarea
                className="h-32 w-full resize-none rounded-xl border border-gray-200 p-4 text-sm"
                placeholder="서비스에 대한 솔직한 후기를 남겨주세요.
(최소 5글자, 최대 600글자)"
                value={content}
                onChange={e => setContent(e.target.value)}
                maxLength={600}
              />
              {attemptedSubmit && content.trim().length < 5 && (
                <div className="mt-1 ml-1 text-xs text-red-500">
                  최소 5글자를 입력해주세요
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              {reviewFromReservation?.reviewId && (
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 cursor-pointer rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                  취소
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 cursor-pointer rounded-xl bg-[#6366F1] px-4 py-3 text-base text-white hover:bg-[#5558E3] disabled:cursor-not-allowed disabled:opacity-50">
                {loading
                  ? '저장 중...'
                  : reviewFromReservation?.reviewId
                    ? '수정'
                    : '등록'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ErrorToast
        open={showErrorToast}
        message={toastMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </>
  )
}
