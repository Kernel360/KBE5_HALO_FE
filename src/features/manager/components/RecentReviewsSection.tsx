import { useEffect, useState } from "react";
import { searchManagerReviews } from "@/features/manager/api/managerReview";
import ManagerReviewCard from "./ManagerReviewCard";
import { useNavigate } from "react-router-dom";
import ManagerReviewDetailModal from "./ManagerReviewDetailModal";
import type { SearchManagerReviews as ManagerReviewType } from "@/features/manager/types/ManagerReviewlType";

export const RecentReviewsSection = () => {
  const [reviews, setReviews] = useState<ManagerReviewType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<ManagerReviewType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchManagerReviews({ page: 0, size: 3 })
      .then((data) => {
        setReviews(data.content || []);
      })
      .catch((err) => {
        setError(err.message || "리뷰 데이터를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCardClick = (review: ManagerReviewType) => {
    setSelectedReview(review);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReview(null);
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-8 lg:p-12 shadow flex flex-col gap-6 min-h-[220px] md:min-h-[260px] lg:min-h-[300px]">
      <button
        type="button"
        className="text-lg md:text-xl font-bold text-slate-800 mb-2 flex items-center gap-2 hover:underline focus:outline-none"
        onClick={() => navigate("/managers/reviews")}
      >
        <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-400" />
        최근 리뷰
      </button>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-slate-400 text-center py-8">불러오는 중...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-slate-400 text-center py-8">최근 리뷰가 없습니다.</div>
        ) : (
          reviews.map((review) => (
            <ManagerReviewCard
              key={review.reviewId}
              review={{
                reviewId: review.reviewId,
                serviceName: review.serviceName || "-",
                authorName: review.authorName || "고객",
                createdAt: review.createdAt?.slice(0, 10) || "",
                rating: review.rating ?? 0,
                content: review.content || "",
              }}
              onClick={() => handleCardClick(review)}
            />
          ))
        )}
      </div>
      <ManagerReviewDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        review={selectedReview}
      />
    </div>
  );
}; 