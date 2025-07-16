// CRM 대시보드 컴포넌트 임포트 (더미)
import { KPISection } from '../components/KPISection'
import { TodayScheduleSection } from '../components/TodayScheduleSection'
import { NotificationSection } from '../components/NotificationSection'
import { RecentReviewsSection } from '../components/RecentReviewsSection'

export const ManagerMain = () => {
  return (
    <div className="manager-dashboard flex w-full min-w-0 flex-col gap-6">
      {/* 상단 KPI 카드 */}
      <div className="px-4 pt-6 md:px-8 md:pt-10">
        <KPISection />
      </div>

      {/* 3단 대시보드 메인 (반응형) */}
      <div className="dashboard-main flex flex-col gap-6 px-4 md:px-8 xl:grid xl:grid-cols-3 xl:gap-6">
        {/* 스케줄 영역 (넓게) */}
        <div className="mb-4 flex w-full flex-col xl:col-span-2 xl:mb-0">
          <TodayScheduleSection />
        </div>
        {/* 예약 요청 (좁게) */}
        <div className="mb-4 flex w-full flex-col xl:col-span-1 xl:mb-0">
          <NotificationSection />
        </div>
      </div>

      {/* 최근 리뷰 (반응형) */}
      <div className="dashboard-side grid grid-cols-1 gap-6 px-4 pb-6 md:px-8 md:pb-10 xl:grid-cols-2">
        <RecentReviewsSection />
      </div>
    </div>
  )
}
