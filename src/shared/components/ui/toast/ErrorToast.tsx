import React from 'react'

interface ErrorToastProps {
  open: boolean
  message: string
  onClose: () => void
  duration?: number
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  open,
  message,
  onClose,
  duration = 3000
}) => {
  const [progress, setProgress] = React.useState(100)

  React.useEffect(() => {
    if (open) {
      setProgress(100)
      const start = Date.now()
      const timer = setTimeout(onClose, duration)
      const interval = setInterval(() => {
        const elapsed = Date.now() - start
        setProgress(Math.max(0, 100 - (elapsed / duration) * 100))
      }, 30)
      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    } else {
      setProgress(100)
    }
  }, [open, duration, onClose])

  if (!open) return null
  return (
    <div className="fixed top-8 right-8 z-[9999] flex flex-col items-end space-y-2">
      <div className="animate-fade-in-up relative mb-2 flex min-w-[220px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 px-6 py-3 text-center text-base font-semibold text-white shadow-lg">
        <span className="mr-1 text-xl">⚠️</span>
        <span>{message}</span>
        <div
          className="absolute bottom-0 left-0 h-1 bg-red-300 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ErrorToast
