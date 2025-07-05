import React from 'react'
import { StarRating } from './StarRating'
import { Button } from './Button'

interface ReviewFormProps {
  rating: number
  content: string
  onRatingChange: (rating: number) => void
  onContentChange: (content: string) => void
  onSubmit: () => void
  placeholder?: string
  submitText?: string
  className?: string
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  rating,
  content,
  onRatingChange,
  onContentChange,
  onSubmit,
  placeholder = '서비스에 대한 리뷰를 작성해주세요',
  submitText = '리뷰 작성하기',
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* 별점 선택 */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-slate-700">
          평점
        </div>
        <StarRating 
          rating={rating}
          interactive={true}
          onRatingChange={onRatingChange}
          className="flex gap-1"
        />
      </div>
      
      {/* 리뷰 내용 */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-slate-700">
          리뷰 내용
        </div>
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="h-28 w-full rounded-lg bg-slate-50 px-4 py-3 outline outline-1 outline-slate-200 focus:outline-indigo-500"
          placeholder={placeholder}
        />
      </div>
      
      {/* 제출 버튼 */}
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          className="h-12 w-40 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
          {submitText}
        </Button>
      </div>
    </div>
  )
}

export default ReviewForm 