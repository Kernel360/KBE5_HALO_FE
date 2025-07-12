import React, { useState, useEffect } from 'react'
import { Check, Calendar, MessageSquare } from 'lucide-react'
import type {
  ManagerMatchingRspType,
  PageInfo
} from '@/features/customer/types/CustomerReservationType'
import HalfStar from '@/shared/components/HalfStar'
import Pagination from '@/shared/components/Pagination'
import ProfileImagePreview from '@/shared/components/ui/ProfileImagePreview'

type SortOption = 'averageRating' | 'reviewCount' | 'reservationCount'

interface ManagerSelectorProps {
  managers: ManagerMatchingRspType[]
  selectedManager: ManagerMatchingRspType | null
  onManagerSelect: (manager: ManagerMatchingRspType) => void
  pageInfo?: PageInfo
  onPageChange?: (page: number) => void
  onSortChange?: (sortBy: string) => void
  currentSort?: string
}

export const ManagerSelector: React.FC<ManagerSelectorProps> = ({
  managers,
  selectedManager,
  onManagerSelect,
  pageInfo,
  onPageChange,
  onSortChange,
  currentSort
}) => {
  const [sortBy, setSortBy] = useState<SortOption>(
    (currentSort as SortOption) || 'averageRating'
  )

  // profileImageId 배열 문자열을 파싱하여 첫 번째 URL 반환
  const getProfileImageUrl = (profileImageId: string | null): string | null => {
    if (!profileImageId) return null

    try {
      // JSON 배열 형태의 문자열을 파싱
      const parsed = JSON.parse(profileImageId)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]
      }
    } catch {
      // 파싱 실패 시 원본 문자열이 URL인지 확인
      if (
        typeof profileImageId === 'string' &&
        profileImageId.startsWith('http')
      ) {
        return profileImageId
      }
    }

    return null
  }

  // currentSort가 변경될 때마다 sortBy state 업데이트
  useEffect(() => {
    if (currentSort && currentSort !== sortBy) {
      setSortBy(currentSort as SortOption)
    }
  }, [currentSort, sortBy])

  const sortOptions = [
    { value: 'averageRating', label: '별점 높은순' },
    { value: 'reservationCount', label: '예약건수 높은순' },
    { value: 'reviewCount', label: '리뷰많은순' }
  ]

  // 별점 렌더링을 위한 함수 (HalfStar 컴포넌트 사용)
  const renderStars = (rating: number | undefined) => {
    const actualRating = rating ?? 0
    const filledStars = Math.floor(actualRating)
    const hasHalfStar = actualRating % 1 >= 0.5 // 소수점 부분이 0.5 이상이면 반쪽 별
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0)

    const stars = []

    // 채워진 별
    for (let i = 0; i < filledStars; i++) {
      // HalfStar 컴포넌트를 재활용하여 둥근 별 모양을 일관되게 유지합니다.
      // fillColor와 emptyColor를 동일하게 설정하여 완전히 채워진 별처럼 보이게 합니다.
      stars.push(
        <HalfStar
          key={`full-${i}`}
          className="h-4 w-4"
          fillColor="text-yellow-400"
          emptyColor="text-yellow-400"
        />
      )
    }

    // 반쪽 별
    if (hasHalfStar) {
      stars.push(
        <HalfStar
          key="half"
          className="h-4 w-4"
          fillColor="text-yellow-400"
          emptyColor="text-gray-200"
        />
      )
    }

    // 빈 별
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <HalfStar
          key={`empty-${i}`}
          className="h-4 w-4"
          fillColor="text-gray-200"
          emptyColor="text-gray-200"
        />
      )
    }

    return stars
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            추천 매니저
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            총 {pageInfo?.totalElements || managers.length}명의 매니저가
            가능합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">정렬:</span>
          <select
            value={sortBy}
            onChange={e => {
              const newSortBy = e.target.value as SortOption
              setSortBy(newSortBy)
              onSortChange?.(newSortBy)
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none">
            {sortOptions.map(option => (
              <option
                key={option.value}
                value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {managers.map(manager => (
          <div
            key={manager.managerId}
            onClick={() => onManagerSelect(manager)}
            className={`group relative overflow-visible rounded-2xl border-2 bg-white p-4 shadow-sm transition-all hover:shadow-lg sm:p-6 ${
              selectedManager?.managerId === manager.managerId
                ? 'border-indigo-500 shadow-lg shadow-indigo-100'
                : 'border-gray-200 hover:border-indigo-300'
            }`}>
            {selectedManager?.managerId === manager.managerId && (
              <div className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg">
                <Check className="h-4 w-4" />
              </div>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              {/* Left section: Profile image and basic info */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <ProfileImagePreview
                    src={getProfileImageUrl(manager.profileImageUrl)}
                    alt={`${manager.managerName} 매니저 프로필`}
                    size="lg"
                    className="shadow-sm ring-2 ring-white"
                  />
                </div>

                <div className="text-center">
                  <h3 className="font-semibold text-gray-900">
                    {manager.managerName} 매니저
                  </h3>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    {renderStars(manager.averageRating)}
                    <span className="text-sm font-medium text-gray-600">
                      {manager.averageRating?.toFixed(1) ?? '0.0'}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({manager.reviewCount >= 50 ? '50+' : manager.reviewCount}
                      )
                    </span>
                  </div>
                </div>
              </div>

              {/* Right section: Stats and Description */}
              <div className="flex-1">
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        예약 건수
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {manager.reservationCount}건
                      </p>
                    </div>
                  </div>

                  {manager.recentReservationDate &&
                    manager.recentReservationDate > '0001-01-01' && (
                      <div className="flex items-center gap-3 rounded-lg p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            최근 예약
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {manager.recentReservationDate}
                          </p>
                        </div>
                      </div>
                    )}
                </div>

                {/* Manager Introduction */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      소개
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {manager.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(() => {
        if (pageInfo && onPageChange) {
          return (
            <div className="mt-6">
              <Pagination
                currentPage={pageInfo.number}
                totalItems={pageInfo.totalElements}
                pageSize={pageInfo.size}
                onPageChange={page => {
                  onPageChange(page)
                }}
              />
            </div>
          )
        } else {
          return null
        }
      })()}
    </div>
  )
}
