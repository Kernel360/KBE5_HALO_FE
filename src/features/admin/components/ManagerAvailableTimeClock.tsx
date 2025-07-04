import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import Modal from "@/shared/components/ui/modal/Modal";

interface ManagerAvailableTimeClockProps {
  weekDays: { label: string; key: string }[];
  groupedTimes: Record<string, string[]>;
}

// 00:00~23:00까지 24시간 구간
const TIME_SLOTS = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`,
);
const WORK_START = 8; // 08:00
const COLORS = {
  available: "#6366f1", // indigo
  unavailable: "#e5e7eb", // light gray
  blocked: "#9ca3af", // dark gray
};

const getPieData = (availableTimes: string[]) => {
  return TIME_SLOTS.map((time, idx) => {
    // 23:00~07:00은 막힘
    if (idx >= 23 || idx < WORK_START) {
      return { name: time, value: 1, status: "blocked" };
    }
    // 08:00~22:00
    return {
      name: time,
      value: 1,
      status: availableTimes.includes(time) ? "available" : "unavailable",
    };
  });
};

const ManagerAvailableTimeClock: React.FC<ManagerAvailableTimeClockProps> = ({
  weekDays,
  groupedTimes,
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedDayObj = weekDays.find((day) => day.key === selectedDay);
  const selectedTimes = selectedDay ? groupedTimes[selectedDay] || [] : [];

  const handleDayClick = (dayKey: string) => {
    setSelectedDay(dayKey);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 justify-items-center">
        {weekDays.map(({ label, key }) => {
          const availableTimes = groupedTimes[key] || [];
          const data = getPieData(availableTimes);
          return (
            <div
              key={key}
              className="flex flex-col items-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-2 rounded-lg"
              onClick={() => handleDayClick(key)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleDayClick(key);
                }
              }}
            >
              <div className="relative">
                <PieChart width={80} height={80}>
                  <Pie
                    data={data}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={24}
                    outerRadius={36}
                    paddingAngle={0}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {data.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={
                          entry.status === "available"
                            ? COLORS.available
                            : entry.status === "blocked"
                              ? COLORS.blocked
                              : COLORS.unavailable
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
                {/* 12시와 24시 숫자 표시 */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-[8px] font-semibold text-gray-600">
                  24
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-[8px] font-semibold text-gray-600">
                  12
                </div>
              </div>
              <div className="text-xs font-medium mt-1 text-slate-700 text-center">
                {label}
              </div>
              {/* 가능한 시간 개수 표시 */}
              <div className="text-[10px] text-indigo-600 font-medium mt-0.5">
                {availableTimes.length > 0
                  ? `${availableTimes.length}시간`
                  : "휴무"}
              </div>
            </div>
          );
        })}
      </div>

      {/* 모달 */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 w-full max-w-4xl p-2 sm:p-4">
          {/* 모달 헤더 */}
          <div className="flex justify-between items-center w-full pb-3 sm:pb-4 border-b">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {selectedDayObj ? `${selectedDayObj.label} 상세 근무 시간` : ""}
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 w-full">
            {/* 애니메이션이 적용된 큰 원 그래프 */}
            <div className="relative flex-shrink-0">
              <PieChart
                width={200}
                height={200}
                className="sm:w-[240px] sm:h-[240px]"
              >
                <Pie
                  data={getPieData(selectedTimes)}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={1}
                  stroke="none"
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {getPieData(selectedTimes).map((entry, idx) => (
                    <Cell
                      key={`modal-cell-${idx}`}
                      fill={
                        entry.status === "available"
                          ? COLORS.available
                          : entry.status === "blocked"
                            ? COLORS.blocked
                            : COLORS.unavailable
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
              {/* 12시와 24시 숫자 표시 */}
              <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 text-sm sm:text-lg font-bold text-gray-700">
                24
              </div>
              <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 text-sm sm:text-lg font-bold text-gray-700">
                12
              </div>
              {/* 중앙 정보 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-indigo-600">
                    {selectedTimes.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    가능 시간
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 정보 영역 */}
            <div className="flex-1 w-full lg:w-auto space-y-4">
              {/* 범례 */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                    style={{ backgroundColor: COLORS.available }}
                  ></div>
                  <span>가능</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                    style={{ backgroundColor: COLORS.unavailable }}
                  ></div>
                  <span>불가능</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                    style={{ backgroundColor: COLORS.blocked }}
                  ></div>
                  <span>서비스 불가</span>
                </div>
              </div>

              {/* 요약 정보 */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  근무 시간 요약
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• 총 가능 시간: {selectedTimes.length}시간</div>
                  <div>• 서비스 가능 시간: 08:00 ~ 22:00</div>
                  <div>• 서비스 불가 시간: 23:00 ~ 07:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* 시간 칩 리스트 */}
          <div className="w-full">
            <div className="text-sm font-medium text-gray-700 mb-3 text-center">
              시간별 상세 정보
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
              {TIME_SLOTS.map((time) => {
                const isAvailable = selectedTimes.includes(time);
                const isBlocked =
                  parseInt(time.split(":")[0]) >= 23 ||
                  parseInt(time.split(":")[0]) < 8;
                return (
                  <div
                    key={time}
                    className={
                      `px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-all hover:scale-105 ` +
                      (isBlocked
                        ? "bg-gray-200 text-gray-500 border border-gray-300"
                        : isAvailable
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm hover:bg-indigo-200"
                          : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100")
                    }
                  >
                    {time}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ManagerAvailableTimeClock;
