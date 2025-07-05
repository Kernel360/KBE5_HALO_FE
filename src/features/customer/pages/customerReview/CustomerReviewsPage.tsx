import { useState, useEffect } from "react";
import { searchCustomerReviews } from "@/features/customer/api/CustomerReview";
import type { CustomerReviewRspType } from "../../types/CustomerReviewType";
import { getFormattedDate, formatTimeRange, formatDateWithDay } from "@/shared/utils/dateUtils";
import { Star, Pencil } from "lucide-react";
import { REVIEW_PAGE_SIZE } from "@/shared/constants/constants";
import { useNavigate } from "react-router-dom";
import Pagination from "@/shared/components/Pagination";
import { useAuthStore } from "@/store/useAuthStore";

const pageSize = REVIEW_PAGE_SIZE;

export const CustomerReviewsPage = () => {
  const [reviews, setReviews] = useState<CustomerReviewRspType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) return;
    
    const fetchReviews = async () => {
      try {
        const data = await searchCustomerReviews({ page: currentPage, size: REVIEW_PAGE_SIZE });
        setReviews(data.content);
        setTotalReviews(data.page.totalElements);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "리뷰 목록을 조회하는데 실패하였습니다.";
        alert(errorMessage);
      }
    };

    fetchReviews();
  }, [currentPage]);

  // 별점 졍렬 필터
  const filteredReviews = reviews.filter((r) => {
    const numericRating = typeof r.rating === "number" ? r.rating : Number(r.rating);
    
    if (selectedRating === null) return true; // 전체
    if (selectedRating === -1) return !r.reviewId || numericRating === 0; // 리뷰 작성 필요
    if (selectedRating === 5) return numericRating === 5; // 5점
    if (selectedRating === 4) return numericRating === 4; // 4점
    if (selectedRating === 3) return numericRating >= 1 && numericRating <= 3; // 3점 이하
    
    return false;
  });


  const handleFilterClick = (idx: number) => {
    let rating: number | null;
    switch (idx) {
      case 0: // 전체
        rating = null;
        break;
      case 1: // 리뷰 작성 필요
        rating = -1;
        break;
      case 2: // 5점
        rating = 5;
        break;
      case 3: // 4점
        rating = 4;
        break;
      case 4: // 3점 이하
        rating = 3;
        break;
      default:
        rating = null;
    }
    setSelectedRating(rating);
    setCurrentPage(0);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">리뷰 내역</h2>
      <div className="flex gap-2 mb-4">
        {["전체", "리뷰 작성 필요", "5점", "4점", "3점 이하"].map((label, idx) => {
          let isActive = false;
          switch (idx) {
            case 0:
              isActive = selectedRating === null;
              break;
            case 1:
              isActive = selectedRating === -1;
              break;
            case 2:
              isActive = selectedRating === 5;
              break;
            case 3:
              isActive = selectedRating === 4;
              break;
            case 4:
              isActive = selectedRating === 3;
              break;
          }
          
          return (
            <button
              key={label}
              onClick={() => handleFilterClick(idx)}
              className={`px-4 py-1 rounded-full border ${
                isActive
                  ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 리뷰 카드 */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>조회한 리뷰 내역이 없습니다.</p>
          </div>
        ) : (
          filteredReviews.map((review, idx) => (
            <ReviewCard key={idx} {...review} />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalReviews}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
      
    </div>
  );
};

// 리뷰 카드
const ReviewCard: React.FC<CustomerReviewRspType> = ({
    serviceCategoryName,
    requestDate,
    startTime,
    turnaround,
    managerName,
    content,
    rating,
    createdAt,
    reviewId,
    reservationId,
  }) => {
  const navigate = useNavigate();

  const handleWriteReview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/my/reviews/${reservationId}`, {
      state: {
        fromReservation: true,
        serviceName: serviceCategoryName,
        managerName,
      },
    });
  };

    return (
      <div className="border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        {/* 리뷰 내용 */}
        {reviewId && (
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < (rating ?? 0)
                      ? "fill-yellow-400 stroke-yellow-400 text-yellow-400"
                      : "stroke-gray-300 text-gray-300"
                  }
                />
              ))}
              <span className="text-lg font-bold text-gray-800">
                {typeof rating === "number" ? Math.floor(rating) : "0"}
              </span>
            </div>
            <span className="text-sm text-gray-500">작성일: {getFormattedDate(new Date(createdAt))}</span>
          </div>
        )}
        <p className="text-gray-800 text-sm whitespace-pre-line mb-[10px]">{content}</p>

        <hr className="border-gray-200" />

        {/* 예약 정보 + 매니저 정보 */}
        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-500 text-3xl">photo_camera</span>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">
                {formatDateWithDay(requestDate)} {formatTimeRange(startTime, turnaround)}
              </p>
              <p className="text-gray-400">{serviceCategoryName}</p>
              <p className="font-medium text-gray-800">{managerName}</p>
            </div>
          </div>

          {reviewId ? (
            <button
              onClick={handleWriteReview}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 text-sm transition-colors duration-200 cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              수정
            </button>
          ) : (
            <button
              onClick={handleWriteReview}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700 text-sm transition-colors duration-200 cursor-pointer"
            >
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              리뷰 작성
            </button>
          )}
        </div>
      </div>
    );
  };