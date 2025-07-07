import React from 'react'

interface DetailSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-start justify-start gap-4 self-stretch ${className}`}>
      <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
        {title}
      </div>
      <div className="flex flex-col items-start justify-start gap-3 self-stretch">
        {children}
      </div>
    </div>
  )
}

export default DetailSection 