import React from 'react'

interface ReviewSearchFilterProps {
  onRatingChange: (rating: number | null) => void
  selectedRating?: number | null
}

const ReviewSearchFilter: React.FC<ReviewSearchFilterProps> = ({
  onRatingChange,
  selectedRating = null
}) => {
  const ratingOptions = [
    { label: '전체', value: null },
    { label: '리뷰 작성 필요', value: 0 },
    { label: '5점', value: 5 },
    { label: '4점', value: 4 },
    { label: '3점 이하', value: 3 }
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          별점 필터
        </label>
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map(option => (
            <button
              key={option.label}
              onClick={() => onRatingChange(option.value)}
              className={`rounded-full border px-3 py-1 text-sm ${
                selectedRating === option.value
                  ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewSearchFilter
