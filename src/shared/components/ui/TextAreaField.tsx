import React from 'react'

interface TextAreaFieldProps {
  label: string
  value: string | null | undefined
  className?: string
  maxLines?: number
  placeholder?: string
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  className = '',
  maxLines = 3,
  placeholder = '-'
}) => {
  const displayValue = value || placeholder
  const shouldTruncate = maxLines && displayValue.split('\n').length > maxLines
  
  const truncatedValue = shouldTruncate 
    ? displayValue.split('\n').slice(0, maxLines).join('\n') + '...'
    : displayValue

  return (
    <div className={`flex flex-col gap-2 self-stretch ${className}`}>
      <div className="text-sm font-medium text-slate-500">
        {label}
      </div>
      <div className="min-h-16 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 leading-relaxed">
        <div className="whitespace-pre-wrap break-words">
          {truncatedValue}
        </div>
      </div>
    </div>
  )
}

export default TextAreaField 