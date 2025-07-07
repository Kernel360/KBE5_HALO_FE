import { RefreshCw } from "lucide-react";

interface ResetButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const ResetButton = ({ onClick, disabled = false, className = "" }: ResetButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-9 px-4 bg-white border border-gray-300 rounded text-slate-600 text-sm font-medium hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span>초기화</span>
      <RefreshCw size={15} strokeWidth={2} />
    </button>
  );
};