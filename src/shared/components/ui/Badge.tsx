import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
  children: React.ReactNode
  color?: 'gray' | 'yellow' | 'blue' | 'indigo' | 'green' | 'red' | 'default'
}

const colorMap: Record<string, string> = {
  gray: 'bg-slate-100 text-slate-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue: 'bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  default: 'bg-slate-100 text-slate-700'
}

export const Badge = ({
  children,
  className = '',
  color = 'default',
  ...rest
}: BadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colorMap[color] || colorMap.default} ${className}`}
    {...rest}
  >
    {children}
  </span>
)

export default Badge
