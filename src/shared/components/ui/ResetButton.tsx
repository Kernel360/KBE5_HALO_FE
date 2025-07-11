import { RefreshCw } from "lucide-react"

interface ResetButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
}

export const ResetButton = ({
  onClick,
  disabled = false,
  className = ""
}: ResetButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded border border-gray-300 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      <RefreshCw
        size={15}
        strokeWidth={2}
      />

      <span>초기화</span>
    </button>
  )
}
