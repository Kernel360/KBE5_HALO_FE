import React from "react";

interface ManagerAvailableTimeTableProps {
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

const ManagerAvailableTimeTable: React.FC<ManagerAvailableTimeTableProps> = ({
  weekDays,
  groupedTimes,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-max border-collapse">
        <thead>
          <tr>
            <th className="p-2 bg-slate-100 text-xs font-bold text-slate-600 border-b border-gray-200 sticky left-0 z-10">
              시간/요일
            </th>
            {weekDays.map((day) => (
              <th
                key={day.key}
                className="p-2 bg-slate-100 text-xs font-bold text-slate-600 border-b border-gray-200"
              >
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((time) => (
            <tr key={time}>
              <td className="p-2 text-xs font-semibold text-slate-500 bg-slate-50 border-b border-gray-100 sticky left-0 bg-white z-10">
                {time}
              </td>
              {weekDays.map((day) => {
                const available = groupedTimes[day.key]?.includes(time);
                return (
                  <td
                    key={day.key}
                    className={
                      "p-1 border-b border-gray-100 text-center " +
                      (available
                        ? "bg-indigo-500 text-white rounded transition-colors"
                        : "bg-gray-100 text-gray-300")
                    }
                    style={{ minWidth: 40 }}
                  >
                    {available ? "●" : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerAvailableTimeTable;
