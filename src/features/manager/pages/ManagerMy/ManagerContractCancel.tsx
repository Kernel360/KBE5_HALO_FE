import { Fragment, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { requestTermination } from '@/features/manager/api/managerMy'
import { isValidLength } from '@/shared/utils/validation'

export const ManagerContractCancel = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { contractAt, statusName } = location.state || {}
  const [terminationReason, setTerminationReason] = useState('')
  const [agreed, setAgreed] = useState(false)

  // 매니저 계약 해지 요청
  const handleSubmit = async () => {
    if (!isValidLength(terminationReason, 1, 500)) {
      alert('해지 사유는 필수 입력 항목이며, 500자 이하로 입력해주세요.')
      return
    }
    if (!agreed) {
      alert('계약 해지 약관에 동의해주세요.')
      return
    }

    try {
      await requestTermination(terminationReason)
      navigate('/managers/my') // 마이페이지로 이동
    } catch (err: any) {
      alert(err.message || '계약 해지 요청 실패')
    }
  }

  return (
    <Fragment>
      <div className="inline-flex w-full flex-col items-start justify-start self-stretch">
        <div className="inline-flex h-16 items-center justify-between self-stretch border-b border-gray-200 bg-white px-6">
          <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
            계약 해지 요청
          </div>
          <Link
            to="/managers/my"
            className="flex h-10 items-center justify-center rounded-md border px-4 text-sm text-gray-500 hover:bg-gray-100">
            취소
          </Link>
        </div>
        <div className="flex flex-col items-start justify-start gap-6 self-stretch p-6">
          <div className="flex flex-col items-start justify-start gap-6 self-stretch rounded-xl bg-white p-8 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
            <div className="inline-flex items-center justify-start gap-1 self-stretch rounded-lg bg-red-50 p-4">
              <span className="material-symbols-outlined text-red-700">
                error
              </span>
              <div className="inline-flex flex-1 flex-col items-start justify-start gap-1">
                <div className="justify-start self-stretch font-['Inter'] text-base leading-tight font-semibold text-red-700">
                  주의: 계약 해지는 되돌릴 수 없습니다
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-4 self-stretch">
              <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
                계약 정보
              </div>
              <div className="inline-flex items-center justify-start gap-2 self-stretch">
                <div className="w-40 justify-start font-['Inter'] text-sm leading-none font-medium text-slate-500">
                  계약 시작일
                </div>
                <div className="flex-1 justify-start font-['Inter'] text-sm leading-none font-medium text-slate-700">
                  {contractAt}
                </div>
              </div>
              <div className="inline-flex items-center justify-start gap-2 self-stretch">
                <div className="w-40 justify-start font-['Inter'] text-sm leading-none font-medium text-slate-500">
                  계약 상태
                </div>
                <div className="flex h-7 items-center justify-center rounded-2xl bg-green-100 px-3">
                  <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-green-800">
                    {statusName}
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center justify-start gap-2 self-stretch">
                <div className="w-40 justify-start font-['Inter'] text-sm leading-none font-medium text-slate-500">
                  남은 예약
                </div>
                <div className="flex-1 justify-start font-['Inter'] text-sm leading-none font-medium text-slate-700">
                  3건
                </div>
              </div>
            </div>
            {/* 해지 사유 */}
            <div className="flex flex-col gap-2 self-stretch">
              <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
                해지 사유
              </div>
              <textarea
                value={terminationReason}
                onChange={e => setTerminationReason(e.target.value)}
                placeholder="해지 사유를 입력해주세요"
                className="h-28 resize-none self-stretch rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700 outline outline-1 outline-slate-200"
              />
            </div>
            {/* 체크박스 */}
            <div className="flex items-center gap-2 self-stretch">
              <input
                id="agreement"
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="agreement"
                className="text-sm text-slate-700">
                계약 해지에 따른 모든 조건을 이해하고 동의합니다
              </label>
            </div>
            {/* 제출 버튼 */}
            <div className="inline-flex items-center justify-end gap-3 self-stretch">
              <button
                onClick={handleSubmit}
                className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-lg bg-red-500 hover:bg-red-600">
                <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-white">
                  계약 해지 요청
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
