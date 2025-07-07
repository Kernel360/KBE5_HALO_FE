import React from 'react'
import type { CustomerProfile } from '@/features/manager/types/CustomerProfileType'
import { Card } from './Card'
import { Badge } from './Badge'
import { StarRating } from './StarRating'

interface CustomerProfileCardProps {
  profile: CustomerProfile
  onAddNote?: () => void
  onViewHistory?: () => void
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'VIP':
      return 'bg-purple-100 text-purple-800'
    case 'GOLD':
      return 'bg-yellow-100 text-yellow-800'
    case 'SILVER':
      return 'bg-gray-100 text-gray-800'
    case 'BRONZE':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

const getGradeIcon = (grade: string) => {
  switch (grade) {
    case 'VIP':
      return '👑'
    case 'GOLD':
      return '🥇'
    case 'SILVER':
      return '🥈'
    case 'BRONZE':
      return '🥉'
    default:
      return '👤'
  }
}

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({
  profile,
  onAddNote,
  onViewHistory
}) => {
  const completionRate = profile.totalReservations > 0 
    ? ((profile.completedReservations / profile.totalReservations) * 100).toFixed(1)
    : '0'

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {getGradeIcon(profile.customerGrade)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {profile.customerName}
            </h3>
            <p className="text-sm text-gray-500">
              {profile.customerPhone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getGradeColor(profile.customerGrade)}>
            {profile.customerGrade}
          </Badge>
          {!profile.isActive && (
            <Badge className="bg-red-100 text-red-800">
              비활성
            </Badge>
          )}
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {profile.totalReservations}
          </div>
          <div className="text-xs text-gray-500">총 예약</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {completionRate}%
          </div>
          <div className="text-xs text-gray-500">완료율</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <StarRating rating={profile.averageRating} size="sm" interactive={false} />
            <span className="text-sm font-medium text-gray-700">
              {profile.averageRating.toFixed(1)}
            </span>
          </div>
          <div className="text-xs text-gray-500">평균 평점</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {profile.totalReviews}
          </div>
          <div className="text-xs text-gray-500">리뷰 수</div>
        </div>
      </div>

      {/* 신뢰도 지표 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">정시 도착률</span>
            <span className="text-sm font-medium text-green-600">
              {(profile.onTimeRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${profile.onTimeRate * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">노쇼율</span>
            <span className="text-sm font-medium text-red-600">
              {(profile.noShowRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ width: `${profile.noShowRate * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="text-xs text-gray-500 mb-4">
        <div className="flex justify-between">
          <span>첫 이용: {profile.firstReservationDate ? new Date(profile.firstReservationDate).toLocaleDateString() : '없음'}</span>
          <span>최근 이용: {profile.lastReservationDate ? new Date(profile.lastReservationDate).toLocaleDateString() : '없음'}</span>
        </div>
        {profile.favoriteManager && (
          <div className="mt-1">
            <span>선호 매니저: {profile.favoriteManager}</span>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            히스토리
          </button>
        )}
        {onAddNote && (
          <button
            onClick={onAddNote}
            className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            메모 추가
          </button>
        )}
      </div>
    </Card>
  )
}

export default CustomerProfileCard 