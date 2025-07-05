import { Button } from "@/shared/components/ui/Button";
import { CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import type { ManagerReservationDetail } from "@/features/manager/types/ManagerReservationType";

interface CheckInOutCardProps {
  reservation: ManagerReservationDetail;
  setCheckType: (type: "IN" | "OUT") => void;
  setOpenModal: (open: boolean) => void;
}

export function CheckInOutCard({
  reservation,
  setCheckType,
  setOpenModal,
}: CheckInOutCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg border border-indigo-100 bg-white p-4 md:p-8 flex flex-col items-center gap-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <ClockIcon className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
        <span className="text-lg md:text-2xl font-bold text-indigo-700">
          체크인 / 체크아웃
        </span>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs md:text-sm font-semibold">
          진행 관리
        </span>
      </div>
      {/* Responsive Stepper */}
      <div className="flex flex-col min-[42.5rem]:flex-row w-full items-center justify-center gap-4 min-[42.5rem]:gap-12 mb-4 min-w-0">
        {/* Check-in */}
        <div className="flex flex-col items-center gap-2 bg-white min-[42.5rem]:shadow min-[42.5rem]:rounded-xl min-[42.5rem]:p-6 transition-all w-[15rem] min-w-[15rem] flex-shrink-0">
          <CheckCircleIcon
            className={`w-8 h-8 md:w-10 md:h-10 ${reservation.inTime ? "text-green-500" : "text-gray-300"}`}
          />
          <div className="text-base md:text-lg font-semibold text-slate-700">체크인</div>
          <div
            className={`text-xs md:text-sm font-medium ${reservation.inTime ? "text-green-600" : "text-gray-400"}`}
          >
            {reservation.inTime ? reservation.inTime : "미완료"}
          </div>
          <Button
            onClick={() => {
              setCheckType("IN");
              setOpenModal(true);
            }}
            disabled={!!reservation.inTime}
            className={`w-full max-w-[12.5rem] h-10 mt-2 rounded-lg text-white font-semibold transition-all duration-200 ${
              reservation.inTime
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {reservation.inTime ? "체크인 완료" : "체크인 하기"}
          </Button>
        </div>
        {/* Arrow or Progress Line */}
        <div className="hidden min-[42.5rem]:flex flex-col items-center justify-center">
          <ArrowRightIcon className="w-10 h-10 text-indigo-200" />
        </div>
        <div className="flex min-[42.5rem]:hidden items-center justify-center my-2">
          <ArrowRightIcon className="w-7 h-7 text-indigo-200" />
        </div>
        {/* Check-out */}
        <div className="flex flex-col items-center gap-2 bg-white min-[42.5rem]:shadow min-[42.5rem]:rounded-xl min-[42.5rem]:p-6 transition-all w-[15rem] min-w-[15rem] flex-shrink-0">
          <CheckCircleIcon
            className={`w-8 h-8 md:w-10 md:h-10 ${reservation.outTime ? "text-green-500" : "text-gray-300"}`}
          />
          <div className="text-base md:text-lg font-semibold text-slate-700">체크아웃</div>
          <div
            className={`text-xs md:text-sm font-medium ${reservation.outTime ? "text-green-600" : "text-gray-400"}`}
          >
            {reservation.outTime ? reservation.outTime : "미완료"}
          </div>
          <Button
            onClick={() => {
              setCheckType("OUT");
              setOpenModal(true);
            }}
            disabled={!reservation.inTime || !!reservation.outTime}
            className={`w-full max-w-[12.5rem] h-10 mt-2 rounded-lg text-white font-semibold transition-all duration-200 ${
              !reservation.inTime || reservation.outTime
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {reservation.outTime ? "체크아웃 완료" : "체크아웃 하기"}
          </Button>
        </div>
      </div>
      {/* 안내 메시지 */}
      <div className="w-full text-center text-sm md:text-base text-slate-500 mt-2">
        체크인 후 체크아웃이 가능합니다. 각 단계별로 파일 업로드가 필요합니다.
      </div>
    </div>
  );
} 