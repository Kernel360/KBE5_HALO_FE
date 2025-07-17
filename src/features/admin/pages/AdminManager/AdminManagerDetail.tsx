import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  fetchAdminManagerById,
  approveManager,
  rejectManager,
  approveTerminateManager
} from '@/features/admin/api/adminManager'
import type { AdminManagerDetail as AdminManagerDetailType } from '@/features/admin/types/AdminManagerType'
import { AlertModal } from '@/shared/components/ui/modal'
import ManagerDetailInfo from '@/features/admin/components/ManagerDetailInfo'
import ManagerContractInfo from '@/features/admin/components/ManagerContractInfo'
import ManagerProfileSummaryCard from '@/features/admin/components/ManagerProfileSummaryCard'
import Card from '@/shared/components/ui/Card'
import Loading from '@/shared/components/ui/Loading'
import type { SubmissionFileMeta } from '@/features/admin/components/ManagerDetailInfo'
import { fetchAdminManagerReviews } from '@/features/admin/api/adminManager'
import type { AdminManagerReview } from '@/features/admin/types/AdminManagerType'
import Modal from '@/shared/components/ui/modal/Modal'
import ReviewCard from '@/shared/components/ui/ReviewCard'
import { fetchRecentManagerInquiries } from '@/features/admin/api/adminInquiry'
import type { InquirySummary } from '@/features/admin/types/AdminInquiryType'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'

export const AdminManagerDetail = () => {
  const { managerId } = useParams<{ managerId: string }>()
  const [manager, setManager] = useState<AdminManagerDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [fileMetas, setFileMetas] = useState<SubmissionFileMeta[]>([])
  const [reviews, setReviews] = useState<AdminManagerReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState<string | null>(null)
  const [selectedReview, setSelectedReview] = useState<AdminManagerReview | null>(null)
  const [inquiries, setInquiries] = useState<InquirySummary[]>([])
  const [inquiriesLoading, setInquiriesLoading] = useState(false)
  const [inquiriesError, setInquiriesError] = useState<string | null>(null)
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null)

  const weekDays = [
    { label: '월요일', key: 'MONDAY' },
    { label: '화요일', key: 'TUESDAY' },
    { label: '수요일', key: 'WEDNESDAY' },
    { label: '목요일', key: 'THURSDAY' },
    { label: '금요일', key: 'FRIDAY' },
    { label: '토요일', key: 'SATURDAY' },
    { label: '일요일', key: 'SUNDAY' },
  ]

  // 예시: 월별 활동 데이터 (실제 데이터 연동 전)
  // const activityData = [
  //   { month: '2월', count: 3 },
  //   { month: '3월', count: 5 },
  //   { month: '4월', count: 2 },
  //   { month: '5월', count: 7 },
  //   { month: '6월', count: 4 }
  // ] // eslint-disable-line @typescript-eslint/no-unused-vars

  // 예시: 타임라인 데이터
  // const recentItems = [
  //   { type: '문의', content: '서비스 일정 변경 문의', date: '2024-06-02' },
  //   { type: '리뷰', content: '매우 친절하고 꼼꼼해요!', date: '2024-05-30' },
  //   { type: '문의', content: '결제 관련 문의', date: '2024-05-28' }
  // ] // eslint-disable-line @typescript-eslint/no-unused-vars

  // 최근 문의 데이터 (최대 20자 요약)
  const recentInquiries = inquiries.map(i => ({
    content: i.title?.length > 20 ? i.title.slice(0, 20) + '...' : i.title,
    date: i.createdAt?.slice(0, 10),
    full: i.title,
    inquiryId: i.inquiryId
  }))
  // 실제 리뷰 데이터 사용
  const recentReviews = reviews.map(r => ({
    content: r.content.length > 20 ? r.content.slice(0, 20) + '...' : r.content,
    date: r.createdAt.slice(0, 10),
    full: r.content,
    rating: r.rating,
    author: r.authorName,
    createdAt: r.createdAt
  }))

  const groupedTimes = useMemo(() => {
    const map: Record<string, string[]> = {}
    if (!manager || !manager.availableTimes) return map
    for (const { dayOfWeek, time } of manager.availableTimes) {
      if (!map[dayOfWeek]) map[dayOfWeek] = []
      map[dayOfWeek].push(time.slice(0, 5))
    }
    for (const key in map) {
      map[key].sort()
    }
    return map
  }, [manager])

  useEffect(() => {
    let filePaths: string[] = []
    try {
      const filePathsRaw = (manager as { filePaths?: unknown })?.filePaths
      if (filePathsRaw) {
        if (typeof filePathsRaw === 'string') {
          const parsed = JSON.parse(filePathsRaw)
          if (Array.isArray(parsed)) filePaths = parsed
        } else if (Array.isArray(filePathsRaw)) {
          filePaths = filePathsRaw
        }
      }
    } catch {
      // ignore file path parse errors
    }
    if (!Array.isArray(filePaths)) filePaths = []

    const fetchMetas = async () => {
      try {
        const metas: SubmissionFileMeta[] = await Promise.all(
          filePaths.map(async (url: string) => {
            try {
              const res = await fetch(url, { method: 'HEAD' })
              const name = decodeURIComponent(
                url.split('/').pop()?.split('?')[0] || '파일'
              )
              const type = res.headers.get('Content-Type') || '-'
              const size = Number(res.headers.get('Content-Length') || 0)
              return { url, name, type, size }
            } catch {
              return { url, name: '알 수 없음', type: '-', size: 0 }
            }
          })
        )
        setFileMetas(metas)
      } catch {
        setFileMetas([])
      }
    }
    fetchMetas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager])

  useEffect(() => {
    if (!manager) return
    setReviewsLoading(true)
    setReviewsError(null)
    fetchAdminManagerReviews(manager.managerId, { size: 3 })
      .then(data => {
        const arr = Array.isArray(data) ? data : data?.content
        setReviews(Array.isArray(arr) ? arr : [])
      })
      .catch(err => {
        setReviewsError(err.message || '리뷰를 불러오지 못했습니다.')
      })
      .finally(() => setReviewsLoading(false))
  }, [manager])

  useEffect(() => {
    if (!manager) return
    setInquiriesLoading(true)
    setInquiriesError(null)
    fetchRecentManagerInquiries(manager.managerId)
      .then(data => setInquiries(Array.isArray(data) ? data : []))
      .catch(err => {
        setInquiriesError(err.message || '문의 내역을 불러오지 못했습니다.')
      })
      .finally(() => setInquiriesLoading(false))
  }, [manager])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchAdminManagerById(managerId!)
        setManager(res || null)
        if (!res) setError('매니저 정보를 찾을 수 없습니다.')
      } catch (err: unknown) {
        let backendMsg: string | undefined = undefined
        if (
          err &&
          typeof err === 'object' &&
          'response' in err &&
          err.response &&
          typeof err.response === 'object' &&
          'data' in err.response &&
          err.response.data &&
          typeof err.response.data === 'object' &&
          'message' in err.response.data
        ) {
          backendMsg = (err.response.data as { message?: string }).message
        }
        setError(backendMsg || '매니저 정보 조회 실패')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [managerId])

  if (loading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loading
          message="매니저 정보를 불러오는 중..."
          size="lg"
        />
      </div>
    )
  if (error) {
    return (
      <AlertModal
        open={true}
        message={error}
        onClose={() => navigate('/admin/managers')}
        confirmLabel="목록으로"
      />
    )
  }
  if (!manager) return null

  // 이력(타임라인) 데이터: 가입(createdAt), 계약 승인(contractAt)
  // const timeline = [
  //   manager.createdAt ? { date: manager.createdAt.slice(0, 10), event: '가입' } : null,
  //   manager.status !== 'PENDING' && manager.contractAt ? { date: manager.contractAt.slice(0, 10), event: '계약 승인' } : null,
  //   manager.terminatedAt ? { date: manager.terminatedAt.slice(0, 10), event: '계약 해지' } : null,
  // ].filter((item): item is { date: string; event: string } => !!item)

  // 승인/거절 핸들러
  const handleApprove = async () => {
    if (!manager) return
    try {
      await approveManager(manager.managerId)
      setSuccessToastMsg('승인되었습니다.')
      setTimeout(() => window.location.reload(), 1200)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message?: string }).message
          : undefined
      alert(msg || '승인 실패')
    }
  }
  const handleReject = async () => {
    if (!manager) return
    try {
      await rejectManager(manager.managerId)
      setSuccessToastMsg('거절되었습니다.')
      setTimeout(() => window.location.reload(), 1200)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message?: string }).message
          : undefined
      alert(msg || '거절 실패')
    }
  }
  // 계약해지대기 승인 핸들러
  const handleTerminateApprove = async () => {
    if (!manager) return
    try {
      await approveTerminateManager(manager.managerId)
      setSuccessToastMsg('계약해지 승인되었습니다.')
      setTimeout(() => window.location.reload(), 1200)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message?: string }).message
          : undefined
      alert(msg || '계약해지 승인 실패')
    }
  }

  // 계약 상태 한글 매핑 함수
  const getContractStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '승인대기';
      case 'APPROVED':
        return '승인';
      case 'REJECTED':
        return '승인거절';
      case 'TERMINATION_PENDING':
        return '해지대기';
      case 'TERMINATED':
        return '계약해지';
      default:
        return status;
    }
  };

  // KPI 카드용 데이터
  const kpiList = [
    { label: '누적 서비스', value: manager.reservationCount ?? '-' },
    {
      label: '평균 평점',
      value:
        manager.averageRating != null
          ? Number(manager.averageRating).toFixed(1)
          : '-'
    },
    { label: '리뷰 수', value: manager.reviewCount ?? '-' },
    {
      label: '계약 상태',
      value: getContractStatusLabel(manager.contractStatus)
    }
  ]

  return (
    <div className="flex w-full flex-col">
      <div className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="text-xl font-bold text-gray-900">매니저 상세 정보</div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-8">
        {/* 상단 2단 그리드 → 1단 세로 배치로 변경 */}
        <div className="flex flex-col gap-8">
          <ManagerProfileSummaryCard
            userName={manager.userName}
            bio={manager.bio}
            kpiList={kpiList}
            profileImageUrl={
              manager.profileImageId
                ? `/api/files/${manager.profileImageId}`
                : undefined
            }
          />
          <ManagerContractInfo
            manager={manager}
            onApprove={handleApprove}
            onReject={handleReject}
            onTerminateApprove={handleTerminateApprove}
            fileMetas={fileMetas}
          />
        </div>
        {/* 중단 2단 그리드: 최근 문의, 최근 리뷰 분리 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                    className="flex justify-between text-sm cursor-pointer hover:bg-slate-100 rounded px-2 py-1"
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
        </div>
        {/* 하단 단일(세로) */}
        <Card className="w-full">
          <ManagerDetailInfo
            manager={manager}
            weekDays={weekDays}
            groupedTimes={groupedTimes}
          />
        </Card>
      </div>
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ''}
        onClose={() => setSuccessToastMsg(null)}
      />
    </div>
  );
};

export default AdminManagerDetail;

