import React, { useState } from 'react'

export type SearchField =
  | { type: 'text'; name: string; placeholder?: string }
  | {
      type: 'select'
      name: string
      options: { value: string; label: string }[]
    }
  | {
      type: 'date-range'
      nameFrom: string
      nameTo: string
      labelFrom?: string
      labelTo?: string
    }

interface SearchFormProps {
  fields: SearchField[]
  onSearch: (values: Record<string, string>) => void
  onReset?: () => void
  initialValues?: Record<string, string>
  className?: string
  showTitle?: boolean
  title?: string
}

export const SearchForm = ({
  fields,
  onSearch,
  onReset,
  initialValues = {},
  className = '',
  showTitle = false,
  title = '검색 조건'
}: SearchFormProps) => {
  const [values, setValues] = useState<Record<string, string>>(initialValues)

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(values)
  }

  const handleReset = () => {
    setValues(initialValues)
    if (onReset) {
      onReset()
    }
  }

  // select는 여러 개 지원, text는 하나만 지원
  const selectFields = fields.filter(f => f.type === 'select') as Array<
    Extract<SearchField, { type: 'select' }>
  >
  const textField = fields.find(f => f.type === 'text') as
    | Extract<SearchField, { type: 'text' }>
    | undefined
  const dateRangeField = fields.find(f => f.type === 'date-range') as
    | Extract<SearchField, { type: 'date-range' }>
    | undefined

  // 드롭다운이 있을 때, 선택된 label을 찾아 placeholder로 사용
  let dynamicPlaceholder = textField?.placeholder || ''
  if (selectFields.length > 0 && textField) {
    const select = selectFields[0]
    const selectedValue = values[select.name] || select.options[0]?.value
    const selectedLabel =
      select.options.find(opt => opt.value === selectedValue)?.label || ''
    dynamicPlaceholder = `${selectedLabel} 검색`
  }

  // 관리자 스타일 (간단한 한 줄 폼)
  if (!showTitle) {
    return (
      <form
        onSubmit={handleSubmit}
        className={`flex w-full items-center justify-end gap-2 py-1 ${className}`}>
        {/* select box가 있으면 왼쪽에 배치 */}
        {selectFields.map(field => (
          <select
            key={field.name}
            value={values[field.name] || field.options[0]?.value || ''}
            onChange={e => handleChange(field.name, e.target.value)}
            className="h-8 min-w-[100px] rounded bg-white px-2 text-sm text-slate-700 outline-none">
            {field.options.map(opt => (
              <option
                key={opt.value}
                value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
        {textField && (
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2">
              {/* 돋보기 아이콘 (SVG) */}
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-slate-400">
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  strokeWidth="2"
                />
                <line
                  x1="16.5"
                  y1="16.5"
                  x2="21"
                  y2="21"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder={dynamicPlaceholder}
              value={values[textField.name] || ''}
              onChange={e => handleChange(textField.name, e.target.value)}
              className="h-8 w-48 min-w-[120px] rounded bg-white pr-2 pl-8 text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        )}
        <button
          type="submit"
          className="ml-1 h-8 cursor-pointer rounded bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-700">
          검색
        </button>
      </form>
    )
  }

  // 매니저 스타일 (카드 형태의 상세 폼)
  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col items-start justify-start gap-4 self-stretch rounded-xl bg-white p-6 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] ${className}`}>
      <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
        {title}
      </div>
      <div className="flex flex-col items-start justify-start gap-4 self-stretch">
        <div className="inline-flex items-start justify-start gap-4 self-stretch">
          {dateRangeField && (
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-2">
              <div className="justify-start self-stretch font-['Inter'] text-sm leading-none font-medium text-slate-700">
                {dateRangeField.labelFrom || '시작일'}~
                {dateRangeField.labelTo || '종료일'}
              </div>
              <div className="inline-flex items-center justify-start gap-2 self-stretch">
                <input
                  type="date"
                  value={values[dateRangeField.nameFrom] || ''}
                  onChange={e =>
                    handleChange(dateRangeField.nameFrom, e.target.value)
                  }
                  className="h-12 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-indigo-500"
                />
                <span className="text-sm text-slate-500">~</span>
                <input
                  type="date"
                  value={values[dateRangeField.nameTo] || ''}
                  onChange={e =>
                    handleChange(dateRangeField.nameTo, e.target.value)
                  }
                  className="h-12 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-indigo-500"
                />
              </div>
            </div>
          )}

          {textField && (
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-2">
              <div className="justify-start self-stretch font-['Inter'] text-sm leading-none font-medium text-slate-700">
                {textField.placeholder || '검색어'}
              </div>
              <div className="inline-flex h-12 items-center justify-start self-stretch rounded-lg bg-slate-50 px-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
                <input
                  value={values[textField.name] || ''}
                  onChange={e => handleChange(textField.name, e.target.value)}
                  placeholder={textField.placeholder || '검색어를 입력하세요'}
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="inline-flex items-center justify-end gap-2 self-stretch">
          {onReset && (
            <button
              type="button"
              onClick={handleReset}
              className="flex h-12 w-28 cursor-pointer items-center justify-center rounded-lg bg-slate-100 font-['Inter'] text-sm leading-none font-medium text-slate-500 transition hover:bg-slate-200">
              초기화
            </button>
          )}
          <button
            type="submit"
            className="flex h-12 w-28 cursor-pointer items-center justify-center rounded-lg bg-indigo-600 font-['Inter'] text-sm leading-none font-medium text-white transition hover:bg-indigo-700">
            검색
          </button>
        </div>
      </div>
    </form>
  )
}

export default SearchForm
