import { Button } from '@/shared/components/ui/Button'
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { ClockIcon } from '@heroicons/react/24/outline'
import type { ManagerReservationDetail } from '@/features/manager/types/ManagerReservationType'
import { formatDateTimeKoreanFull } from '@/shared/utils/dateUtils'

interface CheckInOutCardProps {
  reservation: ManagerReservationDetail
  setCheckType: (type: 'IN' | 'OUT') => void
  setOpenModal: (open: boolean) => void
}

export function CheckInOutCard({
  reservation,
  setCheckType,
  setOpenModal
}: CheckInOutCardProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border border-indigo-100 bg-white p-2 shadow-md md:p-4">
      {/* Header */}
      <div className="mb-1 flex items-center gap-2">
        <ClockIcon className="h-6 w-6 text-indigo-500 md:h-7 md:w-7" />
        <span className="text-base font-bold text-indigo-700 md:text-lg">
          체크인 / 체크아웃
        </span>
        <span className="ml-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
          진행 관리
        </span>
      </div>
      {/* Responsive Stepper */}
      <div className="mb-2 flex w-full min-w-0 flex-col items-center justify-center gap-2 min-[42.5rem]:flex-row min-[42.5rem]:gap-6">
        {/* Check-in */}
        <div className="flex w-[12rem] min-w-[12rem] flex-shrink-0 flex-col items-center gap-1 bg-white transition-all min-[42.5rem]:rounded-xl min-[42.5rem]:p-3 min-[42.5rem]:shadow">
          <CheckCircleIcon
            className={`h-7 w-7 ${reservation.inTime ? 'text-green-500' : 'text-gray-300'}`}
          />
          <div className="text-sm font-semibold text-slate-700">체크인</div>
          <div
            className={`text-xs font-medium ${reservation.inTime ? 'text-green-600' : 'text-gray-400'}`}>
            {reservation.inTime ? (
              <span
                className="block w-full text-center"
                dangerouslySetInnerHTML={{
                  __html: formatDateTimeKoreanFull(reservation.inTime).replace(
                    /\n/g,
                    '<br/>'
                  )
                }}
              />
            ) : (
              '미완료'
            )}
          </div>
          <Button
            onClick={() => {
              setCheckType('IN')
              setOpenModal(true)
            }}
            disabled={!!reservation.inTime}
            className={`mt-1 h-8 w-full max-w-[10rem] rounded-lg font-semibold text-white transition-all duration-200 ${
              reservation.inTime
                ? 'cursor-not-allowed bg-gray-300'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}>
            {reservation.inTime ? '체크인 완료' : '체크인 하기'}
          </Button>
        </div>
        {/* Arrow or Progress Line */}
        <div className="hidden flex-col items-center justify-center min-[42.5rem]:flex">
          <ArrowRightIcon className="h-7 w-7 text-indigo-200" />
        </div>
        <div className="my-1 flex items-center justify-center min-[42.5rem]:hidden">
          <ArrowRightIcon className="h-5 w-5 text-indigo-200" />
        </div>
        {/* Check-out */}
        <div className="flex w-[12rem] min-w-[12rem] flex-shrink-0 flex-col items-center gap-1 bg-white transition-all min-[42.5rem]:rounded-xl min-[42.5rem]:p-3 min-[42.5rem]:shadow">
          <CheckCircleIcon
            className={`h-7 w-7 ${reservation.outTime ? 'text-green-500' : 'text-gray-300'}`}
          />
          <div className="text-sm font-semibold text-slate-700">체크아웃</div>
          <div
            className={`text-xs font-medium ${reservation.outTime ? 'text-green-600' : 'text-gray-400'}`}>
            {reservation.outTime ? (
              <span
                className="block w-full text-center"
                dangerouslySetInnerHTML={{
                  __html: formatDateTimeKoreanFull(reservation.outTime).replace(
                    /\n/g,
                    '<br/>'
                  )
                }}
              />
            ) : (
              '미완료'
            )}
          </div>
          <Button
            onClick={() => {
              setCheckType('OUT')
              setOpenModal(true)
            }}
            disabled={!reservation.inTime || !!reservation.outTime}
            className={`mt-1 h-8 w-full max-w-[10rem] rounded-lg font-semibold text-white transition-all duration-200 ${
              !reservation.inTime || reservation.outTime
                ? 'cursor-not-allowed bg-gray-300'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}>
            {reservation.outTime ? '체크아웃 완료' : '체크아웃 하기'}
          </Button>
        </div>
      </div>
      {/* 안내 메시지 */}
      <div className="mt-1 w-full text-center text-xs text-slate-500 md:text-sm">
        체크인 후 체크아웃이 가능합니다. 각 단계별로 파일 업로드가 필요합니다.
      </div>
    </div>
  )
}
