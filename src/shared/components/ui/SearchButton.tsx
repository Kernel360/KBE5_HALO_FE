import { Search } from "lucide-react"

interface SearchButtonProps {
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}

export const SearchButton = ({
  onClick,
  disabled = false,
  className = "",
  type = "submit"
}: SearchButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded bg-indigo-600 px-5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {" "}
      <Search
        size={15}
        strokeWidth={2}
      />
      <span>검색</span>
    </button>
  )
}
