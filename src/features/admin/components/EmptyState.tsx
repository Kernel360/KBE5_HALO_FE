import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export const EmptyState = ({
  icon,
  message,
  description,
  className = "",
  children,
}: EmptyStateProps) => (
  <div
    className={`flex flex-col items-center justify-center py-12 ${className}`}
  >
    {icon && <div className="mb-4">{icon}</div>}
    <div className="text-lg font-semibold text-gray-500 mb-1">{message}</div>
    {description && (
      <div className="text-sm text-gray-400 mb-2 text-center">
        {description}
      </div>
    )}
    {children}
  </div>
);

export default EmptyState;
