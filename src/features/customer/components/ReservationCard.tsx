// src/components/ReservationCard.tsx

import React from 'react'
import { Link } from 'react-router-dom'
import type {
  CustomerReservationListRspType,
  ReservationStatus
} from '@/features/customer/types/CustomerReservationType'
import {
  serviceCategoryIcons,
  DefaultServiceIcon
} from '@/shared/constants/ServiceIcons'
import { Star } from 'lucide-react'

interface ReservationCardProps {
  reservation: CustomerReservationListRspType
  onCancelReservation?: (reservationId: number) => void
  onWriteReview: (e: React.MouseEvent) => void
}

const getKoreanStatus = (status: ReservationStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return '예약 완료'
    case 'COMPLETED':
      return '방문 완료'
    case 'REQUESTED':
      return '예약 요청'
    case 'CANCELED':
      return '예약 취소'
    case 'IN_PROGRESS':
      return '서비스 진행 중'
    default:
      return status
  }
}

const getStatusBadgeClasses = (status: ReservationStatus) => {
  // 상태 배지 글씨 크기를 키우기 위해 text-base로 변경
  let classes = 'px-3 py-1 rounded-md text-base font-bold ' // text-sm -> text-base 로 변경

  switch (status) {
    case 'CONFIRMED':
      classes += ' text-blue-600'
      break
    case 'CANCELED':
      classes += ' text-red-400'
      break
    case 'COMPLETED':
    case 'REQUESTED':
    case 'IN_PROGRESS':
    default:
      classes += ' text-gray-600'
      break
  }
  return classes
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onWriteReview
}) => {
  const displayStartTime = reservation.startTime
    ? reservation.startTime.substring(0, 5)
    : ''
  const date = new Date(reservation.requestDate)
  const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'short' })

  const IconComponent = reservation.serviceCategoryId
    ? serviceCategoryIcons[reservation.serviceCategoryId] || DefaultServiceIcon
    : DefaultServiceIcon

  const displayAddress =
    `${reservation.roadAddress || ''} ${reservation.detailAddress || ''}`.trim()

  return (
    <Link
      to={`/my/reservations/${reservation.reservationId}`}
      className="relative mb-5 block cursor-pointer rounded-lg border border-transparent bg-white p-4 shadow-md transition-all duration-100 hover:border-indigo-500 sm:p-6">
      {/* 상단 날짜/시간 및 상태 배지 */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="m-0 text-sm font-semibold text-gray-800 sm:text-base">
          {reservation.requestDate.replace(/-/g, '. ')} ({dayOfWeek}){' '}
          {displayStartTime}
        </span>
        <span
          className={getStatusBadgeClasses(
            reservation.reservationStatus as ReservationStatus
          )}>
          {getKoreanStatus(reservation.reservationStatus as ReservationStatus)}
        </span>
      </div>

      {/* 아이콘과 서비스 상세 정보 섹션 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
        {/* 아이콘 영역 (좌측) */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 sm:h-20 sm:w-20">
          {IconComponent && (
            <IconComponent className="h-10 w-10 text-blue-600" />
          )}
        </div>

        {/* 텍스트 상세 내역 (우측) */}
        <div className="flex-1 pt-1 text-sm text-gray-700 sm:text-base">
          <div className="mb-2 flex flex-col sm:flex-row">
            <span className="w-24 flex-shrink-0 text-gray-500">서비스</span>
            <span className="flex-grow break-words">
              {reservation.serviceName}
            </span>
          </div>
          <div className="mb-2 flex flex-col sm:flex-row">
            <span className="w-24 flex-shrink-0 text-gray-500">소요 시간</span>
            <span className="flex-grow">{reservation.turnaround}시간</span>
          </div>
          <div className="mb-2 flex flex-col sm:flex-row">
            <span className="w-24 flex-shrink-0 text-gray-500">
              서비스 주소
            </span>
            <span className="flex-grow break-words">
              {displayAddress || '주소 정보 없음'}
            </span>
          </div>
          <div className="mb-2 flex flex-col sm:flex-row">
            <span className="w-24 flex-shrink-0 text-gray-500">
              담당 매니저
            </span>
            <span className="flex-grow">
              {reservation.managerName || '배정 예정'}
            </span>
          </div>
          <div className="mb-2 flex flex-col sm:flex-row">
            <span className="w-24 flex-shrink-0 text-gray-500">금액</span>
            <span className="flex-grow">
              {reservation.price != null
                ? reservation.price.toLocaleString()
                : '0'}
              원
            </span>
          </div>
        </div>
      </div>

      {/* 버튼 영역 (이벤트 버블링 방지) */}
      <div
        className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end"
        onClick={e => e.stopPropagation()}>
        {reservation.reservationStatus === 'COMPLETED' &&
          !reservation.reviewId && (
            <button
              onClick={onWriteReview}
              className="flex cursor-pointer items-center gap-1 rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-indigo-700">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              리뷰 작성
            </button>
          )}
      </div>
    </Link>
  )
}

export default ReservationCard
