import Card from "@/shared/components/ui/Card";
import React from "react";

interface RecentItem {
  type: string;
  content: string;
  date: string;
}

interface ManagerRecentItemsCardProps {
  recentItems: RecentItem[];
}

const ManagerRecentItemsCard: React.FC<ManagerRecentItemsCardProps> = ({
  recentItems,
}) => (
  <Card className="w-full p-6 shadow-lg border border-gray-200 bg-white">
    <div className="text-xl font-bold mb-2">최근 문의/리뷰</div>
    <div className="border-b border-gray-100 mb-4"></div>
    <ul className="flex flex-col gap-2">
      {recentItems.map((item, idx) => (
        <li key={idx} className="flex items-center gap-3">
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">
            {item.type}
          </span>
          <span className="text-sm text-slate-700 flex-1">{item.content}</span>
          <span className="text-xs text-slate-400">{item.date}</span>
        </li>
      ))}
    </ul>
  </Card>
);

export default ManagerRecentItemsCard;
