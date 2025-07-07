import React from 'react'

interface ToastProps {
  open: boolean
  message: string
  onClose: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({
  open,
  message,
  onClose,
  duration = 2500
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
      <div className="animate-fade-in-up relative mb-2 min-w-[200px] overflow-hidden rounded-xl bg-gray-900 px-6 py-3 text-center text-base font-semibold text-white shadow-lg">
        {message}
        <div
          className="absolute bottom-0 left-0 h-1 bg-blue-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default Toast
