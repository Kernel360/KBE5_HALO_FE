import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ReservationStepTwo from '@/features/customer/pages/reservation/ReservationStepTwo';
import type { ReservationMatchedRspType } from '@/features/customer/types/CustomerReservationType';

const ReservationStepTwoGuard: React.FC = () => {
  const location = useLocation();
  const reservationData = location.state as ReservationMatchedRspType;

  // 필수 데이터가 없으면 첫 번째 단계로 리다이렉트
  if (!reservationData ) {
    return <Navigate to="/reservations/new" replace />;
  }
  if (!reservationData.matchedManagers || reservationData.matchedManagers.length === 0) {
    alert('요청하신 일정에 가능한 매니저가 없습니다.');
  }

  const handleNext = (data: any) => {
    // Step 3으로 이동하거나 결제 프로세스 등
  };

  return (
    <ReservationStepTwo
      reservationData={reservationData}
      onNext={handleNext}
    />
  );
};

export default ReservationStepTwoGuard;