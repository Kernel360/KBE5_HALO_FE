import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Star, X } from "lucide-react";
import { createCustomerReview, getCustomerReviewByReservationId, updateCustomerReview } from "@/features/customer/api/CustomerReview";
import type { CustomerReviewRspType } from "@/features/customer/types/CustomerReviewType";
import { formatDateWithDay, formatTimeRange } from "@/shared/utils/dateUtils";

export const CustomerReviewForm: React.FC = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewFromReservation, setReviewFromReservation] = useState<CustomerReviewRspType | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // 올바른 경로로 접근했는지 체크
  useEffect(() => {
    if (!location.state?.fromReservation) {
      navigate('/my/reservations', { replace: true });
      return;
    }
  }, [location, navigate]);

   // 새로고침 또는 창 닫기 시, 리뷰 작성 중인 경우 경고 메시지 표시
   useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((!reviewFromReservation || !reviewFromReservation.reviewId) && content.trim().length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [reviewFromReservation, content]);

  useEffect(() => {
    // 리뷰 조회
    const fetchReview = async () => {
      if (!reservationId) return;
      
      try {
        const response = await getCustomerReviewByReservationId(Number(reservationId));
        if (response?.body) {
          setReviewFromReservation(response.body);
          if (response.body.rating !== null) {
            setRating(response.body.rating);
          }
          if (response.body.content !== null) {
            setContent(response.body.content);
          }
        }
      } catch (error) {
        alert("리뷰 조회에 실패했습니다.");
      }
    };

    if (location.state?.fromReservation) {
      fetchReview();
    }
  }, [reservationId, location.state]);

  const handleClose = () => {
    if (!reviewFromReservation?.reviewId) {
      alert("리뷰를 작성해주세요.");
      return;
    }
    navigate(-1);
  };

  // 등록하기 전, 리뷰 유효성 검사
  const handleSubmit = async () => {
    if (!reservationId) return;
    setAttemptedSubmit(true);
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }
    if (content.trim().length < 5 || content.trim().length > 600) {
      alert("리뷰 내용은 최소 5글자, 최대 600글자여야 합니다.");
      return;
    }

    try {
      const payload = { reservationId,rating, content };
      if (reviewFromReservation?.reviewId) {
        await updateCustomerReview(Number(reviewFromReservation.reviewId), payload);
        alert("리뷰가 수정되었습니다.");
      } else {
        await createCustomerReview(Number(reservationId), payload);
        alert("리뷰가 등록되었습니다.");
      }
      navigate(-1);
    } catch (error) {
      alert("리뷰 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-[400px] overflow-hidden">
        {/* 헤더 */}
        <div className="bg-[#6366F1] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">리뷰쓰기</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* 서비스 정보 */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-600 text-2xl">person</span>
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-sm mb-1">
                {reviewFromReservation && (
                  <>
                    {formatDateWithDay(reviewFromReservation.requestDate)} {formatTimeRange(reviewFromReservation.startTime, reviewFromReservation.turnaround)}
                  </>
                )}
              </div>
              <div className="text-gray-900">{reviewFromReservation?.serviceCategoryName}</div>
              <div className="text-gray-600">{reviewFromReservation?.managerName}</div>
            </div>
          </div>

          {/* 별점 */}
          <div className="mb-6">
            <div className="text-center mb-2 text-lg">서비스에 만족하셨나요?</div>
            <div className="flex justify-center gap-2 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    (hoveredRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200"
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <div className="text-center text-gray-600">{rating}점</div>
          </div>

          {/* 리뷰 내용 */}
          <div className="mb-6">
            <div className="text-gray-900 mb-2">리뷰 내용</div>
            <textarea
              className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none text-sm"
              placeholder="서비스에 대한 솔직한 후기를 남겨주세요.
(최소 5글자, 최대 600글자)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={600}
            />
            {attemptedSubmit && content.trim().length < 5 && (
              <div className="text-red-500 text-xs mt-1 ml-1">최소 5글자를 입력해주세요</div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            {reviewFromReservation?.reviewId && (
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl text-base hover:bg-gray-50 cursor-pointer"
              >
                취소
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 bg-[#6366F1] text-white rounded-xl text-base hover:bg-[#5558E3] cursor-pointer"
            >
              {reviewFromReservation?.reviewId ? "수정" : "등록"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
 