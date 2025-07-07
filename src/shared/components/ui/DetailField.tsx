import React from 'react'

interface DetailFieldProps {
  label: string
  value: React.ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
  multiline?: boolean
}

export const DetailField: React.FC<DetailFieldProps> = ({
  label,
  value,
  className = '',
  labelClassName = '',
  valueClassName = '',
  multiline = false
}) => {
  const containerClass = multiline 
    ? `inline-flex items-start justify-start gap-2 self-stretch ${className}`
    : `inline-flex items-center justify-start gap-2 self-stretch ${className}`
  
  const valueClass = multiline
    ? `flex-1 justify-start font-['Inter'] text-sm leading-relaxed font-medium text-slate-700 ${valueClassName}`
    : `flex-1 justify-start font-['Inter'] text-sm leading-none font-medium text-slate-700 ${valueClassName}`

  return (
    <div className={containerClass}>
      <div className={`w-40 justify-start font-['Inter'] text-sm leading-none font-medium text-slate-500 ${labelClassName} ${multiline ? 'mt-1' : ''}`}>
        {label}
      </div>
      <div className={valueClass}>
        {value || '-'}
      </div>
    </div>
  )
}

export default DetailField 