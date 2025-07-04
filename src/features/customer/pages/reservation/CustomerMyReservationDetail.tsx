import { useEffect, useState } from "react";
import HalfStar from "@/shared/components/HalfStar";
import { Star, Pencil } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerReservationDetail, cancelReservationByCustomer } from "@/features/customer/api/CustomerReservation";
import type { CustomerReservationDetailRspType, CustomerReservationCancelReqType, ReservationStatus } from "@/features/customer/types/CustomerReservationType";
import { serviceCategoryIcons } from "@/shared/constants/ServiceIcons";
import { DefaultServiceIcon } from "@/shared/constants/ServiceIcons";


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
  let classes = 'px-3 py-1 rounded-md text-base font-bold ';
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


export const CustomerMyReservationDetail = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<CustomerReservationDetailRspType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReservationDetail = async () => {
    if (!reservationId) return;
    
    try {
      const response = await getCustomerReservationDetail(Number(reservationId));
      
      if (response?.body) {
        setReservation(response.body);
      } else {
        setError('예약 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('예약 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchReservationDetail();
  }, [reservationId]);

  const handleCancelReservation = async () => {
    if (!reservationId || !reservation) return;
    
    const confirmCancel = window.confirm('예약을 취소하시겠습니까?');
    if (!confirmCancel) return;

    const reason = window.prompt('예약 취소 사유를 입력해주세요.');
    if (reason === null) return; // 사용자가 취소 버튼을 누른 경우
    if (reason.trim() === '') {
      alert('예약 취소 사유를 입력해주세요.');
      return;
    }

    try {
      const payload: CustomerReservationCancelReqType = {
        cancelReason: reason.trim()
      };
      await cancelReservationByCustomer(Number(reservationId), payload);
      alert('예약이 취소되었습니다.');
      // 예약 정보 새로고침
      fetchReservationDetail();
    } catch (err) {
      console.error('예약 취소 실패:', err);
      alert('예약 취소에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleWriteReview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!reservationId || !reservation) return;
    navigate(`/my/reviews/${reservationId}`, {
      state: { 
        fromReservation: true,
        serviceName: reservation.serviceName,
        managerName: reservation.managerName
      }
    });
  };

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }


  const IconComponent = reservation?.serviceCategoryId
  ? serviceCategoryIcons[reservation.serviceCategoryId] || DefaultServiceIcon
  : DefaultServiceIcon;

  {/* 아이콘 영역 */}
  if (!reservation) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-3">
      {/* 헤더 */}
      <div className="text-xl font-bold text-gray-900 flex items-center justify-between">
        <span>예약 상세 정보</span>
        <div className="flex items-center gap-4">
          {reservation.reservationStatus === 'COMPLETED' && (
            reservation.review ? (
              <button
                onClick={handleWriteReview}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 text-sm transition-colors duration-200 cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                리뷰 수정
              </button>
            ) : (
              <button
                onClick={handleWriteReview}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700 text-sm transition-colors duration-200 cursor-pointer"
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                리뷰 작성
              </button>
            )
          )}
          <span className={getStatusBadgeClasses(reservation.reservationStatus)}>
            {getKoreanStatus(reservation.reservationStatus)}
          </span>
        </div>
      </div>

      {/* 예약 정보 */}
      <div className="text-base font-semibold text-gray-900 mb-4 mt-3">예약 정보</div>
      <div className="py-4 px-6 bg-white rounded-xl shadow text-sm text-slate-800">

      <div className="flex flex-col gap-6">
        <div className="flex gap-40">
          {/* 왼쪽 정보 블럭 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-indigo-500 mt-1">event</span>
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">이용 날짜</div>
                <div className="text-gray-800">
                  {(() => {
                    const date = new Date(reservation.requestDate);
                    const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'short' });
                    return `${reservation.requestDate} (${dayOfWeek})`;
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-indigo-500 mt-1">schedule</span>
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">예약 시간</div>
                <div className="text-gray-800">
                  {(() => {
                    const [hourStr, minuteStr] = reservation.startTime.split(":");
                    const hour = Number(hourStr);
                    const minute = Number(minuteStr);
                    const endHour = hour + reservation.turnaround;
                    const formattedStart = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                    const formattedEnd = `${String(endHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                    return `${formattedStart} ~ ${formattedEnd} (${reservation.turnaround}시간)`;
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-indigo-500 mt-1">location_on</span>
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">서비스 주소</div>
                <div className="text-gray-800">{reservation.roadAddress} {reservation.detailAddress}</div>
              </div>
            </div>
          </div>

          {/* 오른쪽 정보 블럭 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-indigo-500 mt-1">call</span>
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">예약 핸드폰 번호</div>
                <div className="text-gray-800">{reservation.phone}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl text-indigo-500 mt-1">
                  {IconComponent && <IconComponent  />}
                </span>
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">서비스 종류</div>
                <div className="text-gray-800">{reservation.serviceName}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-3xl text-indigo-500 mt-1">edit_note</span>
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-1">메모</div>
                <div className="text-gray-800">{reservation.memo}</div>
              </div>
            </div>
          </div>
        </div>

      {/* 매니저 정보 카드 */}
      {reservation.managerName && (
        <div className="p-4 mt-2 bg-gray-50 rounded-lg flex items-center justify-between">
          {/* 왼쪽: 프로필 아이콘 */}
          <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-lg">
            <span className="material-symbols-outlined text-3xl">person</span>
          </div>

          {/* 가운데: 이름 + 소개 */}
          <div className="ml-4 flex-1">
            <div className="text-base font-semibold text-gray-900">{reservation.managerName}</div>
            <div className="text-sm text-gray-500">{reservation.bio}</div>
          </div>

          {/* 오른쪽: 평점 */}
          <div className="flex items-center gap-1">
            {[...Array(Math.floor(reservation.mangerStatistic.averageRating))].map((_, idx) => (
              <Star key={`full-${idx}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
            {reservation.mangerStatistic.averageRating % 1 >= 0.25 && reservation.mangerStatistic.averageRating % 1 < 0.75 && (
              <HalfStar key="half" className="w-4 h-4" fillColor="text-yellow-400" emptyColor="text-gray-200" />
            )}
            {[...Array(5 - Math.ceil(reservation.mangerStatistic.averageRating))].map((_, idx) => (
              <Star key={`empty-${idx}`} className="w-4 h-4 text-gray-200" />
            ))}
            <span className="text-sm text-gray-700 font-medium ml-1">
              {reservation.mangerStatistic.averageRating.toFixed(1)} ({reservation.mangerStatistic.reviewCount}{reservation.mangerStatistic.reviewCount >= 50 ? '+' : ''})
            </span>
          </div>
        </div>
      )}

      {/* 리뷰 섹션 */}
      {reservation.reservationStatus === 'COMPLETED' && reservation.review && (
        <div>
          <div className="text-base font-semibold text-gray-900 mb-3">나의 리뷰</div>
          <div className="py-4 px-6 bg-white rounded-xl shadow text-sm text-slate-800">
            <div className="flex justify-between items-start">
              <div className="text-gray-700 whitespace-pre-wrap">{reservation.review.content}</div>
              <div className="flex items-center gap-1 ml-4">
                {[...Array(Math.floor(reservation.review.rating ?? 0))].map((_, idx) => (
                  <Star key={`review-full-${idx}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
                {reservation.review.rating && reservation.review.rating % 1 >= 0.25 && reservation.review.rating % 1 < 0.75 && (
                  <HalfStar key="review-half" className="w-4 h-4" fillColor="text-yellow-400" emptyColor="text-gray-200" />
                )}
                {[...Array(5 - Math.ceil(reservation.review.rating ?? 0))].map((_, idx) => (
                  <Star key={`review-empty-${idx}`} className="w-4 h-4 text-gray-200" />
                ))}
                <span className="ml-1 text-sm text-gray-700 font-medium">
                  {reservation.review.rating?.toFixed(1)} 
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
      </div>

      {/* 결제 정보 */}
      <div className="text-base font-semibold text-gray-900 mb-2 mt-5">결제 정보</div>
      <div className="py-4 px-6 bg-white rounded-xl shadow text-sm text-slate-800">

        {/* 기본 서비스 */}
        <div className="mb-4">
          <div className="text-sm text-gray-800 mb-1">기본 서비스</div>
          <div key={reservation.serviceCategoryId} className="flex justify-between text-sm py-1 pl-16">
            <span className="text-gray-800">
              {reservation.serviceName}
              {reservation.serviceTime !== 0 && (
                <span className="text-gray-500 ml-1">({reservation.serviceTime}시간)</span>
              )}
            </span>
            <span className="text-gray-900">
              {reservation.price.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 추가 서비스 */}
        {reservation.extraServices?.length > 0 && (
          <div>
            <div className="text-sm text-gray-800 mb-1">추가 서비스</div>
            <div className="flex flex-col gap-1 pl-16">
              {reservation.extraServices.map((item) => (
                <div key={item.extraServiceId} className="flex justify-between text-sm py-1">
                  <span className="text-gray-800">
                    {item.extraServiceName}
                    {item.extraServiceTime > 0 && (
                      <span className="text-gray-500 ml-1">(+{item.extraServiceTime}시간)</span>
                    )}
                  </span>
                  <span className="text-gray-900">{item.extraServicePrice?.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 총 결제 금액 */}
        <div className="border-t mt-4 pt-2 flex justify-between font-bold text-indigo-600">
          <span>총 결제 금액</span>
          <span>{(reservation.price + (reservation.extraServices?.reduce((acc, item) => acc + (item.extraServicePrice ?? 0), 0) ?? 0)).toLocaleString()}원</span>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2">
        {['REQUESTED', 'CONFIRMED'].includes(reservation.reservationStatus) && (
          <button
            onClick={handleCancelReservation}
            className="px-3 py-2 rounded-2xl bg-red-50 text-red-500 text-sm font-base hover:bg-red-100 transition"
          >
            예약 취소
          </button>
        )}
         {/* {reservation.reservationStatus === 'COMPLETED' &&
          new Date(reservation.requestDate) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <button
              onClick={handleRefundRequest}
              className="px-3 py-2 rounded-2xl bg-blue-50 text-blue-600 text-sm font-base hover:bg-blue-100 transition"
            >
              환불 신청
            </button>
        )}*/}
      </div>
    </div>
  );
};