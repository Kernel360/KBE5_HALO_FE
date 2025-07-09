import React, { useState } from "react"
import { SearchButton } from "@/shared/components/ui/SearchButton"
import { ResetButton } from "@/shared/components/ui/ResetButton"
import DateRangeCalendar from "../../../../shared/components/ui/DateRangeCalendar"

interface InquirySearchFilterProps {
  onSearch: (filters: {
    dateRange: { start: string; end: string }
    replyStatus: string
    titleKeyword: string
    contentKeyword: string
  }) => void
  onReset: () => void
}

const InquirySearchFilter: React.FC<InquirySearchFilterProps> = ({
  onSearch,
  onReset
}) => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [replyStatus, setReplyStatus] = useState("")
  const [titleKeyword, setTitleKeyword] = useState("")
  const [contentKeyword, setContentKeyword] = useState("")

  const handleReplyStatusChange = (value: string) => {
    setReplyStatus(value)
  }

  const handleInputChange = (
    field: "titleKeyword" | "contentKeyword",
    value: string
  ) => {
    if (field === "titleKeyword") setTitleKeyword(value)
    else setContentKeyword(value)
  }

  const handleSearch = () => {
    onSearch({
      dateRange: { start: startDate, end: endDate },
      replyStatus,
      titleKeyword,
      contentKeyword
    })
  }

  const handleReset = () => {
    setStartDate("")
    setEndDate("")
    setReplyStatus("")
    setTitleKeyword("")
    setContentKeyword("")
    onReset()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          문의 날짜
        </label>
        <DateRangeCalendar
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={(start, end) => {
            setStartDate(start)
            setEndDate(end)
          }}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          답변 여부
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input
              type="radio"
              name="replyStatus"
              value=""
              checked={replyStatus === ""}
              onChange={e => handleReplyStatusChange(e.target.value)}
            />
            전체
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input
              type="radio"
              name="replyStatus"
              value="false"
              checked={replyStatus === "false"}
              onChange={e => handleReplyStatusChange(e.target.value)}
            />
            답변대기
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input
              type="radio"
              name="replyStatus"
              value="true"
              checked={replyStatus === "true"}
              onChange={e => handleReplyStatusChange(e.target.value)}
            />
            답변완료
          </label>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          제목 키워드
        </label>
        <input
          type="text"
          value={titleKeyword}
          onChange={e => handleInputChange("titleKeyword", e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          내용 키워드
        </label>
        <input
          type="text"
          value={contentKeyword}
          onChange={e => handleInputChange("contentKeyword", e.target.value)}
          placeholder="내용을 입력하세요"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-2">
        <ResetButton
          onClick={handleReset}
          className="flex-1"
        />
        <SearchButton
          onClick={handleSearch}
          className="flex-1"
        />
      </div>
    </div>
  )
}

export default InquirySearchFilter
