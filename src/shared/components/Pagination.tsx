import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  maxVisiblePages = 5
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  if (totalPages <= 1) return null;

  const renderPaginationNumbers = () => {
    const pagesToShow = maxVisiblePages;
    let startPage = Math.max(0, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + pagesToShow - 1);
    
    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(0, endPage - pagesToShow + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center gap-2 pt-4">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className={`w-9 h-9 rounded-lg flex justify-center items-center transition-all duration-200 ${
          currentPage === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
      >
        <span className="material-symbols-outlined text-base">chevron_left</span>
      </button>

      {renderPaginationNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`w-9 h-9 rounded-lg flex justify-center items-center text-sm font-medium cursor-pointer transition-all duration-200 ${
            pageNum === currentPage
              ? 'border border-indigo-500 bg-indigo-50 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          {pageNum + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className={`w-9 h-9 rounded-lg flex justify-center items-center transition-all duration-200 ${
          currentPage === totalPages - 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
      >
        <span className="material-symbols-outlined text-base">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;