import React from "react";

interface ManagerAvailableTimeBarProps {
  weekDays: { label: string; key: string }[];
  groupedTimes: Record<string, string[]>;
}

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];
const TIME_SLOT_COUNT = TIME_SLOTS.length;

// 연속 구간 추출 함수
function getTimeRanges(times: string[]): [string, string][] {
  if (!times.length) return [];
  const sorted = times.slice().sort();
  const ranges: [string, string][] = [];
  let start = sorted[0];
  let end = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const prevIdx = TIME_SLOTS.indexOf(end);
    const currIdx = TIME_SLOTS.indexOf(sorted[i]);
    if (currIdx === prevIdx + 1) {
      end = sorted[i];
    } else {
      ranges.push([start, end]);
      start = end = sorted[i];
    }
  }
  ranges.push([start, end]);
  return ranges;
}

const ManagerAvailableTimeBar: React.FC<ManagerAvailableTimeBarProps> = ({
  weekDays,
  groupedTimes,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {weekDays.map(({ label, key }) => {
        const times = groupedTimes[key]?.sort() || [];
        const ranges = getTimeRanges(times);
        return (
          <div key={key} className="flex items-center gap-4 mb-1">
            <div className="w-16 text-sm font-medium text-slate-700">
              {label}
            </div>
            <div className="flex-1 relative h-4 bg-gray-100 rounded overflow-hidden">
              {ranges.map(([start, end], idx) => {
                const startIdx = TIME_SLOTS.indexOf(start);
                const endIdx = TIME_SLOTS.indexOf(end);
                if (startIdx === -1 || endIdx === -1) return null;
                const left = (startIdx / TIME_SLOT_COUNT) * 100;
                const width = ((endIdx - startIdx + 1) / TIME_SLOT_COUNT) * 100;
                return (
                  <div
                    key={idx}
                    className="absolute top-0 h-4 bg-indigo-400 rounded"
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${start}~${end}`}
                  />
                );
              })}
            </div>
            <div className="text-xs text-gray-600 ml-2 min-w-[90px]">
              {ranges.length > 0 ? (
                ranges
                  .map(([start, end]) =>
                    start === end ? start : `${start}~${end}`,
                  )
                  .join(", ")
              ) : (
                <span className="text-slate-400">휴무</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManagerAvailableTimeBar;
