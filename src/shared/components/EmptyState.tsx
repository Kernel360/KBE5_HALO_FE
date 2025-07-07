import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  message: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export const EmptyState = ({
  icon,
  message,
  description,
  className = '',
  children
}: EmptyStateProps) => (
  <div
    className={`flex flex-col items-center justify-center py-12 ${className}`}>
    {icon && <div className="mb-4">{icon}</div>}
    <div className="mb-1 text-lg font-semibold text-gray-500">{message}</div>
    {description && (
      <div className="mb-2 text-center text-sm text-gray-400">
        {description}
      </div>
    )}
    {children}
  </div>
)

export default EmptyState
