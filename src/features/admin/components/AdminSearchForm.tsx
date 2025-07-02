import React, { useState } from "react";

export type AdminSearchField =
  | { type: "text"; name: string; placeholder?: string }
  | { type: "select"; name: string; options: { value: string; label: string }[] };

interface AdminSearchFormProps {
  fields: AdminSearchField[];
  onSearch: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
  className?: string;
}

export const AdminSearchForm = ({ fields, onSearch, initialValues = {}, className = "" }: AdminSearchFormProps) => {
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(values);
  };

  // select는 여러 개 지원, text는 하나만 지원
  const selectFields = fields.filter(f => f.type === "select");
  const textField = fields.find(f => f.type === "text");

  // 드롭다운이 있을 때, 선택된 label을 찾아 placeholder로 사용
  let dynamicPlaceholder = textField?.placeholder || "";
  if (selectFields.length > 0 && textField) {
    const select = selectFields[0];
    const selectedValue = values[select.name] || select.options[0]?.value;
    const selectedLabel = select.options.find(opt => opt.value === selectedValue)?.label || "";
    dynamicPlaceholder = `${selectedLabel} 검색`;
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full flex items-center gap-2 justify-end py-1 ${className}`}> 
      {/* select box가 있으면 왼쪽에 배치 */}
      {selectFields.map((field) => (
        <select
          key={field.name}
          value={values[field.name] || field.options[0]?.value || ""}
          onChange={e => handleChange(field.name, e.target.value)}
          className="h-8 px-2 bg-white rounded outline-none min-w-[100px] text-sm text-slate-700"
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
      {textField && (
        <div className="relative flex items-center">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
            {/* 돋보기 아이콘 (SVG) */}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-400">
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={dynamicPlaceholder}
            value={values[textField.name] || ""}
            onChange={e => handleChange(textField.name, e.target.value)}
            className="h-8 pl-8 pr-2 bg-white rounded outline-none w-48 min-w-[120px] text-sm placeholder:text-slate-400"
          />
        </div>
      )}
      <button
        type="submit"
        className="h-8 px-4 bg-indigo-600 rounded text-white text-xs font-medium hover:bg-indigo-700 cursor-pointer ml-1"
      >
        검색
      </button>
    </form>
  );
};

export default AdminSearchForm; 