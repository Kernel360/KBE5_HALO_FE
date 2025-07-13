import React, { useState } from 'react'
import { X } from 'lucide-react'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'

interface ReservationCancelModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  loading: boolean
}

export const ReservationCancelModal: React.FC<ReservationCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [cancelReason, setCancelReason] = useState<string>('')
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null)

  const handleSubmit = async () => {
    setAttemptedSubmit(true)

    // 유효성 검사
    if (!cancelReason.trim()) {
      setErrorToastMsg('예약 취소 사유를 입력해주세요.')
      return
    }

    if (cancelReason.trim().length < 5) {
      setErrorToastMsg('취소 사유를 5자 이상 입력해주세요.')
      return
    }

    onConfirm(cancelReason.trim())
  }

  const handleClose = () => {
    setCancelReason('')
    setAttemptedSubmit(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
        <div className="w-[400px] overflow-hidden rounded-3xl border border-red-300 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between bg-red-500 px-6 py-4 text-white">
            <h2 className="text-lg font-bold">예약 취소</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-white hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-50">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* 경고 메시지 */}
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="mb-2 text-sm font-medium text-red-800">
                예약을 취소하시겠습니까?
              </div>
              <div className="text-xs text-red-600">
                • 취소된 예약은 복구할 수 없습니다.
                <br />
                • 취소 사유는 매니저에게 전달됩니다.
                <br />
                • 결제된 포인트는 즉시 환불됩니다.
              </div>
            </div>

            {/* 취소 사유 입력 */}
            <div className="mb-6">
              <div className="mb-3 text-sm font-medium text-gray-700">
                취소 사유를 입력해주세요 <span className="text-red-500">*</span>
              </div>
              
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="예약을 취소하는 이유를 상세히 작성해주세요. (최소 5자 이상)"
                rows={4}
                className={`w-full resize-none rounded-xl border p-3 text-sm ${
                  attemptedSubmit && !cancelReason.trim()
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                } focus:outline-none`}
                maxLength={500}
                disabled={loading}
              />
              
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <div>
                  {attemptedSubmit && !cancelReason.trim() && (
                    <span className="text-red-500">취소 사유를 입력해주세요.</span>
                  )}
                  {attemptedSubmit && cancelReason.trim() && cancelReason.trim().length < 5 && (
                    <span className="text-red-500">취소 사유를 5자 이상 입력해주세요.</span>
                  )}
                </div>
                <div>{cancelReason.length}/500</div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 cursor-pointer rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                돌아가기
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 cursor-pointer rounded-xl bg-red-500 px-4 py-3 text-base text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? '취소 처리 중...' : '예약 취소'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 에러 토스트 */}
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ''}
        onClose={() => setErrorToastMsg(null)}
      />
    </>
  )
}