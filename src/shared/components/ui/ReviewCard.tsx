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
      {/* 상단: 별점 */}
      <div className="flex items-center gap-2">
        <StarRating 
          rating={rating}
          showValue={true}
          className="flex items-center gap-1.5"
        />
      </div>
      {/* 작성자/작성일시: 별도의 줄, 구분선 */}
      {(author || createdAt) && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {author && <span className="font-medium text-slate-700">{author}</span>}
          {author && createdAt && <span className="mx-1 text-slate-300">|</span>}
          {createdAt && <span>{createdAt}</span>}
        </div>
      )}
      {/* 하단: 리뷰 내용 */}
      <div className="self-stretch text-base text-slate-700">
        {content}
      </div>
    </div>
  )
}

export default ReviewCard 