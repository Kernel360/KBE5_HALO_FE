import Card from '@/shared/components/ui/Card'
import React from 'react'
import ProfileImagePreview from '@/shared/components/ui/ProfileImagePreview'

interface KPI {
  label: string
  value: string | number
}

interface ManagerProfileSummaryCardProps {
  userName: string
  bio: string
  kpiList: KPI[]
  profileImageUrl?: string | null
}

const ManagerProfileSummaryCard: React.FC<ManagerProfileSummaryCardProps> = ({
  userName,
  bio,
  kpiList,
  profileImageUrl
}) => (
  <Card className="flex w-full items-center gap-8 rounded-xl bg-white p-8 shadow">
    <ProfileImagePreview
      src={profileImageUrl}
      size="xl"
      className="flex-shrink-0"
    />
    <div className="flex flex-1 flex-col gap-2">
      <div className="mb-2 text-xl font-bold">프로필 요약</div>
      <div className="mb-4 border-b border-gray-100"></div>
      <div className="text-2xl font-bold text-slate-800">{userName}</div>
      <div className="mb-2 text-base text-slate-500">{bio}</div>
      <div className="mt-2 flex gap-4">
        {kpiList.map(kpi => (
          <div
            key={kpi.label}
            className="flex min-w-[64px] flex-col items-center rounded-lg bg-slate-50 px-2 py-1"
          >
            <div className="text-base font-bold text-indigo-600">{kpi.value}</div>
            <div className="mt-1 text-xs text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>
    </div>
  </Card>
)

export default ManagerProfileSummaryCard
