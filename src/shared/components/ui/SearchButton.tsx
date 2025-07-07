import { Search } from "lucide-react";

interface SearchButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export const SearchButton = ({ onClick, disabled = false, className = "", type = "submit" }: SearchButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-9 px-5 bg-indigo-600 rounded text-white text-sm font-medium hover:bg-indigo-700 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span>검색</span>
      <Search size={15} strokeWidth={2} />
    </button>
  );
};