import React, { useEffect, useState, useRef } from 'react';
import { formatDateWithDay } from '@/shared/utils/dateUtils';
import { useLocation, useNavigate, useBlocker } from 'react-router-dom';
import type { ReservationMatchedRspType, ManagerMatchingRspType, ReservationConfirmReqType } from '@/features/customer/types/CustomerReservationType';
import { AlertCircle, Check, UserRound } from 'lucide-react';
import { ReservationStepIndicator } from '@/features/customer/components/ReservationStepIndicator';
import HalfStar from '@/shared/components/HalfStar'; 
import { confirmReservation, cancelBeforeConfirmReservation } from '@/features/customer/api/CustomerReservation';

interface ManagerWithLike extends ManagerMatchingRspType {
}

interface Props {
  reservationData: ReservationMatchedRspType;
  onNext: (data: any) => void;
}

const ReservationStepTwo: React.FC<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state as ReservationMatchedRspType;
  const [selectedManager, setSelectedManager] = useState<ManagerWithLike | null>(null);
  const [managers, setManagers] = useState<ManagerWithLike[]>([]); // 타입 변경
  const [isNavigating, setIsNavigating] = useState(false);
  const isNavigatingRef = useRef(false);

  useEffect(() => {

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '예약 진행 중입니다. 페이지를 떠나면 예약이 취소됩니다. 정말 나가시겠습니까?';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (isNavigatingRef.current) return false;
    return currentLocation.pathname !== nextLocation.pathname;
  });

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const shouldContinue = window.confirm('예약 진행 중입니다. 페이지를 떠나면 예약이 취소됩니다. 정말 나가시겠습니까?');
      if (shouldContinue) {
        (async () => {
          if (reservationData?.reservation?.reservationId) {
            try {
              await cancelBeforeConfirmReservation(
                reservationData.reservation.reservationId,
                { matchedManagers: managers.map(manager => manager.managerId) }
              );
            } catch (e) {
              console.error('예약 자동 취소 실패:', e);
            }
          }
          blocker.proceed();
          navigate('/');
        })();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  // 매니저 데이터 로드
  useEffect(() => {
    if (reservationData?.matchedManagers) {
      setManagers(reservationData.matchedManagers);
    }
  }, [reservationData]);


  const handleSubmit = async () => {
    if (!selectedManager) {
      alert('매니저를 선택해주세요.');
      return;
    }
    
    if (!reservationData.reservation?.reservationId) {
      alert('예약 ID를 찾을 수 없습니다. 다시 시도해주세요.');
      return;
    }

    setIsNavigating(true);
    isNavigatingRef.current = true;
    
    try {
      // 예약 확정 요청 데이터 구성
      const confirmRequest: ReservationConfirmReqType = {
        selectedManagerId: selectedManager.managerId,
        payReqDTO: {
          paymentMethod: "POINT",
          amount: reservationData.reservation?.price ?? 0
        }
      };

      // API 호출
      const finalReservationResponse = await confirmReservation(
        reservationData.reservation.reservationId,
        confirmRequest
      );
    
      // 성공 시 최종 페이지로 이동
    if (finalReservationResponse?.body?.reservationId) {
      const reservationId = finalReservationResponse.body.reservationId;
      
      // 경로 수정: 절대 경로로 변경
      navigate(`/reservations/${reservationId}/final`, {
        state: finalReservationResponse.body,
        replace: true // 뒤로가기 방지
      });

    } else {
      alert('예약 생성은 완료되었지만 예약 ID를 찾을 수 없습니다.');
    }

    } catch (error: any) {
      alert(`예약 확정에 실패했습니다: ${error.message}. 다시 시도해주세요.`);
      setIsNavigating(false);
      isNavigatingRef.current = false;
    }
  };

  const formatEndTime = () => {
    const { startTime, turnaround } = reservationData.reservation;
    if (!startTime || !turnaround) return '';
    const [hour, minute] = startTime.split(':').map(Number);
    const end = new Date();
    end.setHours(hour);
    end.setMinutes(minute);
    end.setHours(end.getHours() + turnaround);
    return `${startTime} ~ ${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')} (${turnaround}시간)`;
  };

  // 별점 렌더링을 위한 함수 (HalfStar 컴포넌트 사용)
  const renderStars = (rating: number | undefined) => {
    const actualRating = rating ?? 0;
    const filledStars = Math.floor(actualRating);
    const hasHalfStar = (actualRating % 1) >= 0.5; // 소수점 부분이 0.5 이상이면 반쪽 별
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    // 채워진 별
    for (let i = 0; i < filledStars; i++) {
      // HalfStar 컴포넌트를 재활용하여 둥근 별 모양을 일관되게 유지합니다.
      // fillColor와 emptyColor를 동일하게 설정하여 완전히 채워진 별처럼 보이게 합니다.
      stars.push(<HalfStar key={`full-${i}`} className="w-4 h-4" fillColor="text-yellow-400" emptyColor="text-yellow-400" />);
    }

    // 반쪽 별
    if (hasHalfStar) {
      stars.push(<HalfStar key="half" className="w-4 h-4" fillColor="text-yellow-400" emptyColor="text-gray-200" />);
    }

    // 빈 별
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<HalfStar key={`empty-${i}`} className="w-4 h-4" fillColor="text-gray-200" emptyColor="text-gray-200" />);
    }

    return stars;
  };


  return (
    <div className="w-full px-16 py-10 0 flex flex-col items-center">
      <ReservationStepIndicator step={2} />
      <div className="max-w-[1200px] w-full flex gap-8">
        {/* 왼쪽: 매니저 선택 */}
        <div className="flex-1">
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              예약 진행 중입니다. 다른 페이지로 이동하시면 예약이 취소됩니다.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">추천 매니저</h2>
          <p className="text-sm text-gray-500 mb-6">총 {managers.length}명의 매니저가 가능합니다.</p>

          <div className="flex flex-col gap-4">
            {managers.map((manager) => (
              <div
                key={manager.managerId}
                onClick={() => setSelectedManager(manager)}
                className={`bg-white p-6 rounded-xl border transition-all shadow-sm hover:shadow-md hover:border-indigo-400 cursor-pointer flex gap-6 ${
                  selectedManager?.managerId === manager.managerId ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-200'
                }`}
              >
                {/* Left section: Profile image, name, rating, and Select button */}
                <div className="w-48 inline-flex flex-col justify-start items-center gap-4">
                  <div className="w-28 h-28 bg-gray-100 rounded-[60px] flex flex-col justify-center items-center">
                    <UserRound className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-center gap-1">
                    <div className="self-stretch text-center justify-start text-gray-900 text-base font-semibold font-['Inter'] leading-tight">{manager.managerName} 매니저</div>
                    <div className="inline-flex justify-center items-center gap-1">
                      {/* 별점 렌더링 로직 적용 */}
                      {renderStars(manager.averageRating)}
                      <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">
                        {manager.averageRating?.toFixed(1) ?? '0.0'} ({manager.reviewCount >= 50 ? '50+' : manager.reviewCount})
                      </div>
                    </div>
                  </div>
                  {/* 선택 버튼 재추가 */}
                  <div className="w-44 inline-flex justify-center items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedManager(manager);
                      }}
                      className={`w-24 h-12 rounded-lg inline-flex flex-col justify-center items-center ${
                        selectedManager?.managerId === manager.managerId ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                      } text-base font-semibold font-['Inter'] leading-tight hover:opacity-90`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Right section: Stats, Description, Reviews */}
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-5">
                    {/* Stats line with like/dislike icon at the end */}
                    <div className="self-stretch inline-flex justify-start items-center gap-4">
                        
                        <div className="inline-flex flex-col justify-start items-start gap-1">
                            <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">예약 건수</div>
                            <div className="justify-start text-gray-900 text-base font-semibold font-['Inter'] leading-tight">{manager.reservationCount}건</div>
                        </div>
                        {manager.recentReservationDate && manager.recentReservationDate > '0001-01-01' && (
                          <div className="inline-flex flex-col justify-start items-start gap-1">
                              <div className="justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">최근 나의 예약 날짜</div>
                              <div className="justify-start text-gray-900 text-base font-semibold font-['Inter'] leading-tight">{manager.recentReservationDate}</div>
                          </div>
                        )}
                        {/* 좋아요/아쉬워요 아이콘 (조회용, 클릭 이벤트 없음) */}
                    </div>

                    {/* Manager Introduction */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">소개</div>
                        <div className="self-stretch justify-start text-gray-900 text-sm font-normal font-['Inter'] leading-none">{manager.bio}</div>
                    </div>

                    {/* Recent Reviews 
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch justify-start text-gray-500 text-sm font-medium font-['Inter'] leading-none">최근 후기</div>
                        <div className="self-stretch p-3 bg-gray-50 rounded-lg flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch inline-flex justify-between items-center">
                                <div className="justify-start text-gray-900 text-sm font-medium font-['Inter'] leading-none">이** 고객님</div>
                                <div className="flex justify-center items-center gap-1">
                                    {renderStars(5.0)} 
                                </div>
                            </div>
                            <div className="self-stretch justify-start text-gray-700 text-sm font-normal font-['Inter'] leading-none">정말 꼼꼼하게 청소해주셨어요. 특히 욕실 청소가 정말 깔끔했습니다. 다음에도 김청소 매니저님 지정해서 예약할게요!</div>
                        </div>
                        <div className="self-stretch p-3 bg-gray-50 rounded-lg flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch inline-flex justify-between items-center">
                                <div className="justify-start text-gray-900 text-sm font-medium font-['Inter'] leading-none">박** 고객님</div>
                                <div className="flex justify-center items-center gap-1">
                                    {renderStars(4.0)}
                                </div>
                            </div>
                            <div className="self-stretch justify-start text-gray-700 text-sm font-normal font-['Inter'] leading-none">친절하고 시간 약속도 잘 지켜주셨어요. 청소도 만족스럽게 잘 해주셨습니다.</div>
                        </div>
                    </div>
                    */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 예약 정보 요약 - 구조 수정 시작 */}
        <div className="w-96 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">예약 정보</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">서비스 종류</span>
                <span className="text-gray-900 font-medium">{reservationData.requestCategory?.serviceName || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">서비스 날짜</span>
                <span className="text-gray-900 font-medium">
                  {reservationData.reservation?.requestDate ? formatDateWithDay(reservationData.reservation.requestDate) : '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">서비스 시간</span>
                <span className="text-gray-900 font-medium">{formatEndTime()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">서비스 주소</span>
                <span className="text-gray-900 font-medium text-right">
                  {reservationData.reservation?.roadAddress}<br />
                  {reservationData.reservation?.detailAddress}
                </span>
              </div>
              {reservationData.reservation?.memo && (
                <div className="text-sm"> 
                  <div className="flex justify-between items-start"> 
                    <span className="text-gray-500">요청 사항</span>
                  </div>
                  <div className="text-gray-900 font-medium mt-1"> 
                    {reservationData.reservation.memo}
                  </div>
                </div>
              )}
            </div>

            {/* 서비스 내역 섹션 추가 */}
            <div className="mt-6 border-t border-gray-200 pt-4"> {/* 상단 마진과 패딩 추가 */}
              <h4 className="text-base font-semibold text-gray-900 mb-3">서비스 내역</h4>
              <div className="flex flex-col gap-3">
                {/* 메인 서비스 */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">메인 서비스</span>
                  <span className="text-gray-900 font-medium">
                    {reservationData.requestCategory?.serviceName || '-'}{' '}
                    <span className="text-gray-500">{reservationData.requestCategory.serviceTime}시간 </span>
                    {reservationData.requestCategory?.price?.toLocaleString() || 0}원
                  </span>
                </div>
                {/* 추가 서비스 (데이터가 있을 경우에만 렌더링) */}
                {reservationData.requestCategory?.children && reservationData.requestCategory.children.length > 0 && (
                  <>
                    {/* "추가 서비스" 라벨은 한 번만 표시 */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">추가 서비스</span>
                      <span></span>
                    </div>
                    {/* 각 추가 서비스 내역은 새로운 줄에 표시, 왼쪽 라벨 없음 */}
                    {reservationData.requestCategory.children.map((childService, index) => (
                      <div key={`additional-service-${index}`} className="flex justify-between text-sm pl-4"> {/* 왼쪽 여백 추가 (들여쓰기 효과) */}
                        {/* 왼쪽에는 아무것도 표시하지 않습니다 */}
                        <span></span>
                        <span className="text-gray-900 font-medium">
                          {childService.serviceName || '-'}{' '}
                          {childService.serviceTime!=0 && (
                            <span className="text-gray-500">{childService.serviceTime}시간 </span>
                          )}
                          {childService.price?.toLocaleString() || 0}원
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 my-4" /> {/* 구분선 마진 조정 */}
            <div className="flex justify-between text-base font-semibold">
              <span className="text-gray-900">총 결제 금액</span>
              <span className="text-indigo-600 text-lg font-bold">
                {reservationData.reservation?.price?.toLocaleString() || 0}원
              </span>
            </div>
          </div>

          <div className="flex gap-3">
          <button
              className={`flex-1 h-12 rounded-lg flex justify-center items-center text-base font-semibold transition-colors ${
                isNavigating
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer' 
              }`}
              onClick={handleSubmit}
              disabled={isNavigating}
            >
              {isNavigating ? '처리 중...' : '결제하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationStepTwo;