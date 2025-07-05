interface StatusBadgeProps {
  value: boolean
  trueText: string
  falseText: string
  className?: string
}

export const StatusBadge = ({
  value,
  trueText,
  falseText,
  className = ''
}: StatusBadgeProps) => (
  <div
    className={`inline-flex h-7 items-center justify-center rounded-2xl px-3 ${
      value ? 'bg-green-100' : 'bg-slate-100'
    } ${className}`}>
    <div
      className={`font-['Inter'] text-sm leading-none font-medium ${
        value ? 'text-green-800' : 'text-slate-800'
      }`}>
      {value ? trueText : falseText}
    </div>
  </div>
)

export default StatusBadge
