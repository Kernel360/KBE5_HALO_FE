import Card from "@/shared/components/ui/Card";
import React from "react";

interface TimelineItem {
  date: string;
  event: string;
}

interface ManagerTimelineCardProps {
  timeline: TimelineItem[];
}

const ManagerTimelineCard: React.FC<ManagerTimelineCardProps> = ({
  timeline,
}) => (
  <Card className="w-full p-6 shadow-lg border border-gray-200 bg-white">
    <div className="text-xl font-bold mb-2">이력</div>
    <div className="border-b border-gray-100 mb-4"></div>
    <ul className="flex flex-col gap-2">
      {timeline.map((item) => (
        <li key={item.date} className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-20">{item.date}</span>
          <span className="text-sm text-slate-700">{item.event}</span>
        </li>
      ))}
    </ul>
  </Card>
);

export default ManagerTimelineCard;
