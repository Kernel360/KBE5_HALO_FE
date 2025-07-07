import React from "react";

interface TableSectionProps {
  title: string;
  total: number;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  authorType?: string;
  replyStatus?: string;
  selectedCategories?: string[];
  categories?: Array<{code: string; label: string}>;
}

export const TableSection = ({
  title,
  total,
  children,
  actions,
  className = "",
  authorType,
  replyStatus,
  selectedCategories = [],
  categories = [],
}: TableSectionProps) => {
  const getAuthorTypeText = (type: string) => {
    if (type === "customer") return "수요자";
    if (type === "manager") return "매니저";
    return "전체";
  };

  const getReplyStatusText = (status: string) => {
    if (status === "PENDING") return "답변 대기";
    if (status === "ANSWERED") return "답변 완료";
    return "전체";
  };

  const buildTitleWithFilters = () => {
    const filters = [];
    if (authorType) filters.push(`작성자: ${getAuthorTypeText(authorType)}`);
    if (replyStatus) filters.push(`답변상태: ${getReplyStatusText(replyStatus)}`);
    if (selectedCategories.length > 0) {
      const categoryNames = selectedCategories.map(code => 
        categories.find(cat => cat.code === code)?.label || code
      ).join(", ");
      filters.push(`문의유형: ${categoryNames}`);
    }
    
    if (filters.length > 0) {
      return `${title} (${filters.join(", ")})`;
    }
    return title;
  };

  return (
  <section
    className={`w-full bg-white rounded-xl shadow flex flex-col p-6 ${className}`}
  >
    <div className="w-full flex justify-between items-center pb-4">
      <div className="text-slate-800 text-lg font-semibold">{buildTitleWithFilters()}</div>
      <div className="text-slate-500 text-sm">총 {total}건</div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </section>
  );
};

export default TableSection;
