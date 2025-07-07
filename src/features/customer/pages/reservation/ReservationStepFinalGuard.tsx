import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ReservationStepFinal from '@/features/customer/pages/reservation/ReservationStepFinal';
import type { ReservationConfirmRspType } from '@/features/customer/types/CustomerReservationType';

const ReservationStepFinalGuard: React.FC = () => {
  const location = useLocation();
  const finalReservationData = location.state as ReservationConfirmRspType;

  // 필수 데이터가 없으면 예약 첫 번째 단계로 리다이렉트
  if (!finalReservationData) {
    alert('예약 정보를 찾을 수 없습니다. 다시 예약해주세요.');
    return <Navigate to="/reservations/new" replace />;
  }

  // 필수 필드들이 누락되었는지 확인
  if (!finalReservationData.reservationId 
    //||   !finalReservationData.managerName || 
    //  !finalReservationData.serviceName
    ) {
    alert('예약 정보가 완전하지 않습니다. 다시 예약해주세요.');
    return <Navigate to="/reservations/new" replace />;
  }

  return <ReservationStepFinal />;
};

export default ReservationStepFinalGuard;