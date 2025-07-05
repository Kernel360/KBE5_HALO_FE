import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  options: Option[]
  selectedValues: string[]
  onSelectionChange: (selectedValues: string[]) => void
  placeholder?: string
  className?: string
  dropdownClassName?: string
  buttonClassName?: string
}

export const MultiSelectDropdown = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = '선택하세요',
  className = '',
  dropdownClassName = '',
  buttonClassName = ''
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 전체 선택/해제 토글
  const handleToggleAll = () => {
    const newSelectedValues =
      selectedValues.length === options.length
        ? []
        : options.map(option => option.value)
    onSelectionChange(newSelectedValues)
  }

  // 개별 선택 토글
  const handleToggle = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onSelectionChange(newSelectedValues)
  }

  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-1 ${buttonClassName}`}>
        <span>{placeholder}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180 transform' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className={`absolute top-full left-1/2 z-50 mt-1 min-w-48 -translate-x-1/2 transform rounded-lg border border-slate-200 bg-white shadow-lg ${dropdownClassName}`}>
          <div className="p-2">
            {/* 전체 선택 옵션 */}
            <label className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={selectedValues.length === options.length}
                onChange={handleToggleAll}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-semibold text-slate-700">전체</span>
            </label>

            {/* 구분선 */}
            <hr className="my-2 border-slate-200" />

            {/* 개별 옵션들 */}
            {options.map(option => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
