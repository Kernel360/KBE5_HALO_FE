import React from 'react'

interface TableSectionProps {
  title: string
  total: number
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const TableSection = ({
  title,
  total,
  children,
  actions,
  className = ''
}: TableSectionProps) => (
  <section
    className={`flex w-full flex-col rounded-xl bg-white p-6 shadow ${className}`}>
    <div className="flex w-full items-center justify-between pb-4">
      <div className="text-lg font-semibold text-slate-800">{title}</div>
      <div className="text-sm text-slate-500">총 {total}건</div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </section>
)

export default TableSection
