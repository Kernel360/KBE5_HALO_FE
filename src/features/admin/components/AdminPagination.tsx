import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from "lucide-react";

interface AdminPaginationProps {
  page: number; // 0-based index
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export const AdminPagination = ({
  page,
  totalPages,
  onChange,
  className = "",
}: AdminPaginationProps) => {
  // 최소 1페이지는 항상 표시
  const safeTotalPages = Math.max(1, totalPages);

  // 페이지 그룹 계산 (5개씩)
  const PAGE_GROUP_SIZE = 5;
  const currentGroup = Math.floor(page / PAGE_GROUP_SIZE);
  const groupStart = currentGroup * PAGE_GROUP_SIZE;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE, safeTotalPages);


  // 페이지 번호 배열
  const pageNumbers = [];
  for (let i = groupStart; i < groupEnd; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={`flex justify-center gap-1 pt-4 ${className}`}>
      {/* 첫 페이지 */}
      <button
        className={`w-9 h-9 rounded-md flex justify-center items-center text-sm font-medium transition-colors
          ${page > 0 ? "bg-slate-100 text-slate-500 cursor-pointer hover:bg-slate-200" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}
        onClick={() => page > 0 && onChange(0)}
        disabled={page <= 0}
      >
        <ChevronFirst size={18} />
      </button>
      {/* 이전 페이지 */}
      <button
        className={`w-9 h-9 rounded-md flex justify-center items-center text-sm font-medium transition-colors
          ${page > 0 ? "bg-slate-100 text-slate-500 cursor-pointer hover:bg-slate-200" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}
        onClick={() => page > 0 && onChange(page - 1)}
        disabled={page <= 0}
      >
        <ChevronLeft size={18} />
      </button>
      {/* 페이지 번호 */}
      {pageNumbers.map((p) => (
        <button
          key={p}
          className={`w-9 h-9 rounded-md flex justify-center items-center text-sm font-medium transition-colors
            ${page === p ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}
          `}
          onClick={() => onChange(p)}
        >
          {p + 1}
        </button>
      ))}
      {/* 다음 페이지 */}
      <button
        className={`w-9 h-9 rounded-md flex justify-center items-center text-sm font-medium transition-colors
          ${page < safeTotalPages - 1 ? "bg-slate-100 text-slate-500 cursor-pointer hover:bg-slate-200" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}
        onClick={() => page < safeTotalPages - 1 && onChange(page + 1)}
        disabled={page >= safeTotalPages - 1}
      >
        <ChevronRight size={18} />
      </button>
      {/* 마지막 페이지 */}
      <button
        className={`w-9 h-9 rounded-md flex justify-center items-center text-sm font-medium transition-colors
          ${page < safeTotalPages - 1 ? "bg-slate-100 text-slate-500 cursor-pointer hover:bg-slate-200" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}
        onClick={() => page < safeTotalPages - 1 && onChange(safeTotalPages - 1)}
        disabled={page >= safeTotalPages - 1}
      >
        <ChevronLast size={18} />
      </button>
    </div>
  );
};

export default AdminPagination;
