import React, { useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import Modal from '@/shared/components/ui/modal/Modal'

interface ManagerAvailableTimeClockProps {
  weekDays: { label: string; key: string }[]
  groupedTimes: Record<string, string[]>
}

// 00:00~23:00까지 24시간 구간
const TIME_SLOTS = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, '0')}:00`
)
const WORK_START = 8 // 08:00
const COLORS = {
  available: '#6366f1', // indigo
  unavailable: '#e5e7eb', // light gray
  blocked: '#9ca3af' // dark gray
}

const getPieData = (availableTimes: string[]) => {
  return TIME_SLOTS.map((time, idx) => {
    // 23:00~07:00은 막힘
    if (idx >= 23 || idx < WORK_START) {
      return { name: time, value: 1, status: 'blocked' }
    }
    // 08:00~22:00
    return {
      name: time,
      value: 1,
      status: availableTimes.includes(time) ? 'available' : 'unavailable'
    }
  })
}

// Utility: group consecutive times into ranges
function getTimeRanges(times: string[]): [string, string][] {
  if (!times.length) return []
  const sorted = times.slice().sort()
  const ranges: [string, string][] = []
  let start = sorted[0]
  let end = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    const prevIdx = TIME_SLOTS.indexOf(end)
    const currIdx = TIME_SLOTS.indexOf(sorted[i])
    if (currIdx === prevIdx + 1) {
      end = sorted[i]
    } else {
      ranges.push([start, end])
      start = end = sorted[i]
    }
  }
  ranges.push([start, end])
  return ranges
}

// Helper: add one hour to a time string like '08:00' => '09:00'
function addOneHour(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const next = h + 1
  return `${next.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

const ManagerAvailableTimeClock: React.FC<ManagerAvailableTimeClockProps> = ({
  weekDays,
  groupedTimes
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedDayObj = weekDays.find(day => day.key === selectedDay)
  const selectedTimes = selectedDay ? groupedTimes[selectedDay] || [] : []

  const handleDayClick = (dayKey: string) => {
    setSelectedDay(dayKey)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDay(null)
  }

  return (
    <>
      <div className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-7">
        {weekDays.map(({ label, key }) => {
          const availableTimes = groupedTimes[key] || []
          const data = getPieData(availableTimes)
          return (
            <div
              key={key}
              className="cursor-pointer flex-col items-center rounded-lg p-2 transition-all hover:scale-105 hover:shadow-lg"
              onClick={() => handleDayClick(key)}
              tabIndex={0}
              role="button"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleDayClick(key)
                }
              }}
            >
              <div className="relative">
                <PieChart
                  width={80}
                  height={80}
                >
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
                          entry.status === 'available'
                            ? COLORS.available
                            : entry.status === 'blocked'
                              ? COLORS.blocked
                              : COLORS.unavailable
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
                {/* 12시와 24시 숫자 표시 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 transform text-[8px] font-semibold text-gray-600">
                  24
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform text-[8px] font-semibold text-gray-600">
                  12
                </div>
              </div>
              <div className="mt-1 text-center text-xs font-medium text-slate-700">
                {label}
              </div>
              {/* 가능한 시간 개수 표시 */}
              <div className="mt-0.5 text-[10px] font-medium text-indigo-600">
                {availableTimes.length > 0
                  ? `${availableTimes.length}시간`
                  : '휴무'}
              </div>
            </div>
          )
        })}
      </div>

      {/* 모달 */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
      >
        <div className="w-full max-w-4xl flex-col items-center space-y-4 p-2 sm:space-y-6">
          {/* 모달 헤더 */}
          <div className="flex w-full items-center justify-between border-b pb-3 sm:pb-4">
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
              {selectedDayObj ? `${selectedDayObj.label} 상세 근무 시간` : ''}
            </h2>
            <button
              onClick={handleCloseModal}
              className="p-1 text-gray-400 transition-colors hover:text-gray-600"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
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
          <div className="w-full flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
            {/* 애니메이션이 적용된 큰 원 그래프 */}
            <div className="relative mx-auto flex flex-shrink-0 justify-center">
              <PieChart
                width={200}
                height={200}
                className="h-[240px] sm:w-[240px]"
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
                        entry.status === 'available'
                          ? COLORS.available
                          : entry.status === 'blocked'
                            ? COLORS.blocked
                            : COLORS.unavailable
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
              {/* 12시와 24시 숫자 표시 */}
              <div className="absolute top-[18px] left-1/2 -translate-x-1/2 text-center text-sm font-bold text-gray-700 sm:text-lg">
                24
              </div>
              <div className="absolute bottom-[18px] left-1/2 -translate-x-1/2 text-center text-sm font-bold text-gray-700 sm:text-lg">
                12
              </div>
              {/* 중앙 정보 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-indigo-600 sm:text-2xl">
                    {selectedTimes.length}
                  </div>
                  <div className="text-gray-600 sm:text-sm">가능 시간</div>
                </div>
              </div>
            </div>

            {/* 우측 정보 영역 */}
            <div className="w-full flex-1 space-y-4 lg:w-auto">
              {/* 범례 */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm sm:gap-6 lg:justify-start">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full sm:h-4 sm:w-4"
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
                  <div>
                    • 서비스 가능 시간:
                    {selectedTimes.length > 0 ? (
                      <ul className="ml-4 pl-6 list-disc">
                        {getTimeRanges(selectedTimes).map(([start, end], idx) => (
                          <li key={idx}>{`${start}~${addOneHour(end)}`}</li>
                        ))}
                      </ul>
                    ) : (
                      <span> - </span>
                    )}
                  </div>
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
              {TIME_SLOTS.filter((time) => {
                const hour = parseInt(time.split(":")[0], 10);
                // 08:00~22:00만 표시
                return hour >= 8 && hour <= 22;
              }).map((time) => {
                const isAvailable = selectedTimes.includes(time);
                return (
                  <div
                    key={time}
                    className={
                      `px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-all hover:scale-105 ` +
                      (isAvailable
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
