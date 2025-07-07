// src/components/ReservationCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import type { CustomerReservationListRspType, ReservationStatus } from "@/features/customer/types/CustomerReservationType";
import { serviceCategoryIcons, DefaultServiceIcon } from '@/shared/constants/ServiceIcons';
import { Star } from "lucide-react";

interface ReservationCardProps {
  reservation: CustomerReservationListRspType;
  onCancelReservation?: (reservationId: number) => void;
  onWriteReview: (e: React.MouseEvent) => void;
}

const getKoreanStatus = (status: ReservationStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return '예약 완료';
    case 'COMPLETED':
      return '방문 완료';
    case 'REQUESTED':
      return '예약 요청';
    case 'CANCELED':
      return '예약 취소';
    case 'IN_PROGRESS':
      return '서비스 진행 중';
    default:
      return status;
  }
};

const getStatusBadgeClasses = (status: ReservationStatus) => {
  // 상태 배지 글씨 크기를 키우기 위해 text-base로 변경
  let classes = 'px-3 py-1 rounded-md text-base font-bold '; // text-sm -> text-base 로 변경

  switch (status) {
    case 'CONFIRMED':
      classes += ' text-blue-600';
      break;
    case 'CANCELED':
      classes += ' text-red-400';
      break;
    case 'COMPLETED':
    case 'REQUESTED':
    case 'IN_PROGRESS':
    default:
      classes += ' text-gray-600';
      break;
  }
  return classes;
};

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onWriteReview,
}) => {
  const displayStartTime = reservation.startTime ? reservation.startTime.substring(0, 5) : '';
  const date = new Date(reservation.requestDate);
  const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'short' });

  const IconComponent = reservation.serviceCategoryId
    ? serviceCategoryIcons[reservation.serviceCategoryId] || DefaultServiceIcon
    : DefaultServiceIcon;

  const displayAddress = `${reservation.roadAddress || ''} ${reservation.detailAddress || ''}`.trim();


  return (
    <Link
      to={`/my/reservations/${reservation.reservationId}`}
      className="block bg-white rounded-lg shadow-md mb-5 p-6 relative cursor-pointer
                 border border-transparent hover:border-indigo-500 transition-all duration-100"
    >
      {/* 상단 날짜/시간 및 상태 배지 */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-800 text-semibold m-0"> 
          {reservation.requestDate.replace(/-/g, '. ')} ({dayOfWeek}) {displayStartTime}
        </span>
        <span className={getStatusBadgeClasses(reservation.reservationStatus as ReservationStatus)}>
          {getKoreanStatus(reservation.reservationStatus as ReservationStatus)}
        </span>
      </div>

      {/* 아이콘과 서비스 상세 정보 섹션 */}
      <div className="flex items-start gap-4">
        {/* 아이콘 영역 (좌측) */}
        <div className="flex-shrink-0 w-35 h-35 rounded-lg flex items-center justify-center">
          {IconComponent && <IconComponent className="w-10 h-10 text-blue-600" />}
        </div>

        {/* 텍스트 상세 내역 (우측) */}
        <div className="flex-1 text-sm text-gray-700 pt-1">
          <div className="flex mb-2">
            <span className="w-24 text-gray-500 flex-shrink-0">서비스</span>
            <span className="flex-grow">{reservation.serviceName}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-24 text-gray-500 flex-shrink-0">소요 시간</span>
            <span className="flex-grow">{reservation.turnaround}시간</span>
          </div>
          <div className="flex mb-2">
            <span className="w-24 text-gray-500 flex-shrink-0">서비스 주소</span>
            <span className="flex-grow">{displayAddress || '주소 정보 없음'}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-24 text-gray-500 flex-shrink-0">담당 매니저</span>
            <span className="flex-grow">{reservation.managerName || '배정 예정'}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-24 text-gray-500 flex-shrink-0">금액</span>
            <span className="flex-grow">
              {reservation.price != null ? reservation.price.toLocaleString() : '0'}원
            </span>
          </div>
        </div>
      </div>

      {/* 버튼 영역 (이벤트 버블링 방지) */}
      <div className="flex justify-end gap-3 mt-5" onClick={(e) => e.stopPropagation()}>
        
        {reservation.reservationStatus === 'COMPLETED' && !reservation.reviewId && (
          <button
            onClick={onWriteReview}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700 text-sm transition-colors duration-200 cursor-pointer"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            리뷰 작성
          </button>
        )}
      </div>
    </Link>
  );
};

export default ReservationCard;