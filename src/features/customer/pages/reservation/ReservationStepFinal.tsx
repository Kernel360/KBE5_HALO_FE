import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import type { ReservationConfirmRspType } from '@/features/customer/types/CustomerReservationType';

// 체크 이모지
const CheckCircleIcon: React.FC<{ colorClass?: string }> = ({ colorClass = "text-green-100" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-16 h-16 ${colorClass}`} 
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.532-1.755-1.755a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

const ReservationStepFinal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // location.state에서 결제 완료 데이터를 가져옵니다.
  const finalReservationData = location.state as ReservationConfirmRspType;

  // 상태 관리 (필요에 따라 추가)
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {

    // Guard에서 이미 검증했으므로 데이터가 있다고 가정
    if (finalReservationData) {
      setDataLoaded(true);
    }
  }, [finalReservationData]);


  // 시간 함수
  const formatReservationTime = (startTime?: string, turnaround?: number): string => {
    if (!startTime || !turnaround) return '-';
  
    const [hourStr, minuteStr] = startTime.split(':');
    const startHour = parseInt(hourStr, 10);
    const startMinute = parseInt(minuteStr, 10);
    
    const endDate = new Date();
    endDate.setHours(startHour);
    endDate.setMinutes(startMinute + turnaround * 60);
  
    const endHour = String(endDate.getHours()).padStart(2, '0');
    const endMinute = String(endDate.getMinutes()).padStart(2, '0');
  
    return `${startHour.toString().padStart(2, '0')}:${minuteStr} ~ ${endHour}:${endMinute} (${turnaround}시간)`;
  };
  

  if (!dataLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>예약 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-16 py-10 flex flex-col items-center">
      <div className="self-stretch text-center text-gray-900 text-3xl font-bold leading-loose">서비스 예약</div>

      <div className="max-w-[800px] w-full flex flex-col items-center gap-8 bg-white p-8 rounded-xl ">
      <CheckCircleIcon colorClass="text-indigo-400" /> 
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">예약이 완료되었습니다</h2>
        <p className="text-base text-gray-600 text-center mb-6">
          예약 내역은 마이페이지에서 확인하실 수 있습니다
        </p>

        {/* 예약 정보 요약 카드 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-6">
          {/* 예약 번호 및 예약 상태 */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              예약 확정
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            {/* 서비스 정보 섹션 */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-gray-900">서비스 정보</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">서비스 종류</span>
                <span className="text-gray-900 font-medium">{finalReservationData.serviceName || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">서비스 날짜</span>
                <span className="text-gray-900 font-medium">{finalReservationData.requestDate || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">서비스 시간</span>
                <span className="text-gray-900 font-medium">
                  {formatReservationTime(finalReservationData.startTime, finalReservationData.turnaround)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">서비스 주소</span>
                <span className="text-gray-900 font-medium text-right">
                  {finalReservationData.roadAddress}<br />
                  {finalReservationData.detailAddress}
                </span>
              </div>
            </div>

            {/* 담당 매니저 섹션 */}
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">담당 매니저</h3>
              <div className="w-20 h-20 bg-gray-100 rounded-full flex justify-center items-center mb-2">
              <div className="w-28 h-28 rounded-[60px] flex flex-col justify-center items-center">
                    <UserRound className="w-10 h-10 text-gray-400" />
                  </div>              </div>
              <div className="text-gray-900 text-base font-semibold">{finalReservationData.managerName} 매니저</div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4" />

          {/* 결제 정보 섹션 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-gray-900">결제 정보</h3>

            {/* 메인 서비스 */}
            <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-semibold">메인 서비스</span>
            <span />
            </div>
              <div className="flex justify-between text-sm pl-4">
                <span className="text-gray-500">{finalReservationData.serviceName} </span>
                <span className="text-gray-900 font-medium">{finalReservationData.extraServices?.serviceTime}시간 {finalReservationData.extraServices?.price.toLocaleString()}원</span>
              </div>

            {/* 추가 서비스 */}
            {finalReservationData.extraServices?.children?.length > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-semibold">추가 서비스</span>
                  <span />
                </div>
                {finalReservationData.extraServices.children.map((child, index) => (
                  <div key={index} className="flex justify-between text-sm pl-4">
                    <span className="text-gray-500">{child.serviceName}</span>
                    <span className="text-gray-900 font-medium">
                      {child.serviceTime}시간 {child.price?.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </>
            )}

  {/* 총 결제 금액 */}
  <div className="border-t border-gray-200 my-3" />
  <div className="flex justify-between text-base font-semibold">
    <span className="text-gray-900">총 결제 금액</span>
    <span className="text-indigo-600 text-lg font-bold">
      {finalReservationData.price?.toLocaleString() || 0}원
    </span>
  </div>
</div>


          <div className="border-t border-gray-200 mt-4 pt-4" />

          {/* 취소 및 환불 정책 섹션 
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-900">취소 및 환불 정책</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {finalReservationData.cancellationPolicy?.map((policy, index) => (
                <li key={index}>{policy}</li>
              ))}
            </ul>
          </div>*/}
        </div>

        {/* 하단 버튼 */}
        <div className="w-full flex justify-center gap-3 mt-4">
          <button
            onClick={() => navigate(`/my/reservations/${finalReservationData.reservationId}`)} // 마이페이지 예약 내역으로 이동
            className="w-48 h-12 bg-gray-200 rounded-lg flex justify-center items-center text-gray-700 text-base font-semibold hover:bg-gray-300"
          >
            예약 내역 확인
          </button>
          <button
            onClick={() => navigate('/')} // 홈으로 이동
            className="w-48 h-12 bg-indigo-600 rounded-lg flex justify-center items-center text-white text-base font-semibold hover:bg-indigo-700"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationStepFinal;