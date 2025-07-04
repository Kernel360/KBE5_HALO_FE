import React from "react";

interface TableSectionProps {
  title: string;
  total: number;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const TableSection = ({
  title,
  total,
  children,
  actions,
  className = "",
}: TableSectionProps) => (
  <section
    className={`w-full bg-white rounded-xl shadow flex flex-col p-6 ${className}`}
  >
    <div className="w-full flex justify-between items-center pb-4">
      <div className="text-slate-800 text-lg font-semibold">{title}</div>
      <div className="text-slate-500 text-sm">총 {total}건</div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </section>
);

export default TableSection;
