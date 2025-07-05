import React from 'react'

interface PageHeaderProps {
  title: string
  actions?: React.ReactNode
  className?: string
}

export const PageHeader = ({
  title,
  actions,
  className = ''
}: PageHeaderProps) => (
  <div
    className={`inline-flex h-16 items-center justify-between self-stretch border-b border-gray-200 bg-white px-6 ${className}`}>
    <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
      {title}
    </div>
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>
)

export default PageHeader
