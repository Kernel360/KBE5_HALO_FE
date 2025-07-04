import Card from "@/shared/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";

interface ActivityData {
  month: string;
  count: number;
}

interface ManagerActivityChartCardProps {
  activityData: ActivityData[];
}

const ManagerActivityChartCard: React.FC<ManagerActivityChartCardProps> = ({
  activityData,
}) => (
  <Card className="w-full p-6 shadow-lg border border-gray-200 bg-white">
    <div className="text-xl font-bold mb-2">월별 활동</div>
    <div className="border-b border-gray-100 mb-4"></div>
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={activityData}>
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

export default ManagerActivityChartCard;
