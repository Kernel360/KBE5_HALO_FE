import { Link } from 'react-router-dom'
import Card from '@/shared/components/ui/Card'
import Loading from '@/shared/components/ui/Loading'

interface RecentInquiriesCardProps {
  inquiriesLoading: boolean
  inquiriesError: string | null
  recentInquiries: Array<{
    content: string
    date?: string
    full?: string
    inquiryId: string
  }>
}

const RecentInquiriesCard = ({
  inquiriesLoading,
  inquiriesError,
  recentInquiries
}: RecentInquiriesCardProps) => (
  <Card className="flex w-full flex-col gap-4 rounded-xl bg-white p-8 shadow">
    <div className="mb-4 text-lg font-bold">최근 문의</div>
    {inquiriesLoading ? (
      <div className="flex min-h-[4rem] items-center justify-center">
        <Loading
          size="sm"
          message="문의 내역을 불러오는 중..."
        />
      </div>
    ) : inquiriesError ? (
      <div className="text-red-500">{inquiriesError}</div>
    ) : recentInquiries.length === 0 ? (
      <div className="text-gray-400">최근 문의가 없습니다.</div>
    ) : (
      <ul className="flex flex-col gap-2">
        {recentInquiries.map(item => (
          <li key={item.inquiryId}>
            <Link
              to={`/admin/inquiries/${item.inquiryId}`}
              className="cursor-pointer justify-between rounded px-2 py-1 text-sm hover:bg-slate-100"
            >
              <span>{item.content}</span>
              <span className="text-gray-400">{item.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    )}
  </Card>
)

export default RecentInquiriesCard 