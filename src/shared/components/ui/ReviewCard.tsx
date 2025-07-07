import React from 'react'
import { StarRating } from './StarRating'

interface ReviewCardProps {
  rating: number
  content: string
  createdAt: string
  author?: string
  className?: string
  emptyMessage?: string
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  rating,
  content,
  createdAt,
  author,
  className = '',
  emptyMessage = '아직 등록된 리뷰가 없습니다.'
}) => {
  if (!content && !rating) {
    return (
      <div className={`mb-4 flex flex-col items-start justify-start gap-4 self-stretch rounded-lg bg-slate-50 p-6 ${className}`}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={`mb-4 flex flex-col items-start justify-start gap-4 self-stretch rounded-lg bg-slate-50 p-6 ${className}`}>
      {/* 상단: 별점, 날짜, 작성자 */}
      <div className="inline-flex items-center justify-between self-stretch">
        <StarRating 
          rating={rating}
          showValue={true}
          className="flex items-center gap-1.5"
        />
        <div className="flex items-center justify-start gap-3">
          {author && (
            <div className="text-sm font-medium text-slate-700">
              {author}
            </div>
          )}
          <div className="text-sm text-slate-500">
            {createdAt}
          </div>
        </div>
      </div>
      
      {/* 하단: 리뷰 내용 */}
      <div className="self-stretch text-base text-slate-700">
        {content}
      </div>
    </div>
  )
}

export default ReviewCard 