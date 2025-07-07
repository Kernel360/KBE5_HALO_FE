// CRM 대시보드 컴포넌트 임포트 (더미)
import { KPISection } from "../components/KPISection";
import { TodayScheduleSection } from "../components/TodayScheduleSection";
import { NoticeSection } from "../components/NoticeSection";
import { NotificationSection } from "../components/NotificationSection";
import { RecentReviewsSection } from "../components/RecentReviewsSection";

export const ManagerMain = () => {
  return (
    <div className="manager-dashboard w-full min-w-0 flex flex-col gap-6">
      {/* 상단 KPI 카드 */}
      <div className="px-4 md:px-8 pt-6 md:pt-10">
        <KPISection />
      </div>

      {/* 3단 대시보드 메인 (반응형) */}
      <div className="dashboard-main flex flex-col gap-6 xl:grid xl:grid-cols-3 xl:gap-6 px-4 md:px-8">
        {/* 스케줄 영역 (넓게) */}
        <div className="xl:col-span-2 w-full flex flex-col mb-4 xl:mb-0">
          <TodayScheduleSection />
        </div>
        {/* 리뷰 영역 (좁게) */}
        <div className="xl:col-span-1 w-full flex flex-col mb-4 xl:mb-0">
          <RecentReviewsSection />
        </div>
      </div>

      {/* 공지사항 + 예약 요청 (반응형) */}
      <div className="dashboard-side grid grid-cols-1 xl:grid-cols-2 gap-6 px-4 md:px-8 pb-6 md:pb-10">
        <NoticeSection />
        <NotificationSection />
      </div>
    </div>
  );
};
