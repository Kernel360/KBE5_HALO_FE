import React from 'react'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({
  message = '로딩 중...',
  size = 'md',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 bg-white bg-opacity-90 flex flex-col justify-center items-center'
    : 'flex flex-col justify-center items-center'

  return (
    <>
      <style>{`
        .halo-spinner {
          border-color: #e5e7eb;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: halo-spin 1s linear infinite;
        }
        @keyframes halo-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className={`${containerClasses} ${className}`}>
        <div className={`halo-spinner ${sizeClasses[size]} mb-4`} />
        <div className="text-base font-medium text-indigo-500">{message}</div>
      </div>
    </>
  )
}

export default Loading
