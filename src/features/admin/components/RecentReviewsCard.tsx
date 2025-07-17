import Modal from '@/shared/components/ui/modal/Modal'
import ReviewCard from '@/shared/components/ui/ReviewCard'
import Card from '@/shared/components/ui/Card'
import Loading from '@/shared/components/ui/Loading'
import type { AdminManagerReview } from '@/features/admin/types/AdminManagerType'
import type { Dispatch, SetStateAction } from 'react'

interface RecentReviewsCardProps {
  reviewsLoading: boolean
  reviewsError: string | null
  recentReviews: Array<{
    content: string
    date: string
    full: string
    rating: number
    author: string
    createdAt: string
  }>
  reviews: AdminManagerReview[]
  selectedReview: AdminManagerReview | null
  setSelectedReview: Dispatch<SetStateAction<AdminManagerReview | null>>
}

const RecentReviewsCard = ({
  reviewsLoading,
  reviewsError,
  recentReviews,
  reviews,
  selectedReview,
  setSelectedReview
}: RecentReviewsCardProps) => (
  <Card className="flex w-full flex-col gap-4 rounded-xl bg-white p-8 shadow">
    <div className="mb-4 text-lg font-bold">최근 리뷰</div>
    {reviewsLoading ? (
      <div className="flex min-h-[4rem] items-center justify-center">
        <Loading size="sm" message="리뷰를 불러오는 중..." />
      </div>
    ) : reviewsError ? (
      <div className="text-red-500">{reviewsError}</div>
    ) : recentReviews.length === 0 ? (
      <div className="text-gray-400">최근 리뷰가 없습니다.</div>
    ) : (
      <ul className="flex flex-col gap-2">
        {recentReviews.map((item, idx) => (
          <li
            key={idx}
            className="cursor-pointer justify-between rounded px-2 py-1 text-sm hover:bg-slate-100"
            onClick={() => setSelectedReview(reviews[idx])}
          >
            <span>{item.content}</span>
            <span className="text-gray-400">{item.date}</span>
          </li>
        ))}
      </ul>
    )}
    {/* 리뷰 상세 모달 */}
    <Modal open={!!selectedReview} onClose={() => setSelectedReview(null)}>
      {selectedReview && (
        <ReviewCard
          rating={selectedReview.rating}
          content={selectedReview.content}
          createdAt={selectedReview.createdAt.slice(0, 10)}
          author={selectedReview.authorName}
        />
      )}
    </Modal>
  </Card>
)

export default RecentReviewsCard 