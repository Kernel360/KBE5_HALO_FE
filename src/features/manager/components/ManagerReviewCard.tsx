import {
  UserCircleIcon,
  CalendarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import React from "react";

interface ManagerReviewCardProps {
  review: {
    reviewId: number;
    serviceName: string;
    authorName: string;
    createdAt: string;
    rating: number;
    content: string;
  };
  onClick?: () => void;
}

const MAX_PREVIEW_LENGTH = 100;

const ManagerReviewCard: React.FC<ManagerReviewCardProps> = ({
  review,
  onClick,
}) => {
  // Truncate content for preview
  const preview =
    review.content.length > MAX_PREVIEW_LENGTH
      ? review.content.slice(0, MAX_PREVIEW_LENGTH) + "..."
      : review.content;
  return (
    <div
      className="relative rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-transform hover:scale-[1.03] p-6 flex flex-col flex-1 min-w-[260px] min-h-[260px] md:min-h-[280px] cursor-pointer"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label="리뷰 상세 보기"
    >
      {/* 서비스명 뱃지 */}
      <div className="absolute -top-4 left-2 md:left-6 z-10 inline-block rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 text-white px-3 md:px-4 py-1 text-xs font-semibold shadow border border-white">
        {review.serviceName}
      </div>
      {/* 상단 정보 */}
      <div className="flex flex-col md:flex-row md:items-center gap-y-1 md:gap-x-2 mb-2 mt-2 w-full">
        <div className="flex items-center gap-1 min-w-0">
          <UserCircleIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <span className="font-bold text-slate-800 text-sm md:text-base truncate max-w-[90px] md:max-w-[120px]">
            {review.authorName}
          </span>
        </div>
        <div className="flex items-center gap-1 min-w-0 md:ml-3">
          <CalendarIcon className="w-4 h-4 text-slate-300 flex-shrink-0" />
          <span className="text-xs md:text-sm text-slate-400 truncate max-w-[80px] md:max-w-[120px]">
            {review.createdAt}
          </span>
        </div>
        <span className="flex items-center gap-1 md:ml-auto mt-1 md:mt-0">
          <StarIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span className="font-semibold text-slate-700 text-sm md:text-base">
            {review.rating.toFixed(1)}
          </span>
        </span>
      </div>
      {/* 리뷰 내용 (미리보기) */}
      <div className="relative text-lg text-slate-700 font-medium italic line-clamp-3 pl-8 mt-2 mb-4">
        <span className="absolute left-0 top-0 text-3xl text-indigo-200 select-none">"</span>
        {preview}
      </div>
      {/* 하단 부가정보 */}
      <div className="flex items-center justify-between mt-auto pt-2 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <ChatBubbleLeftRightIcon className="w-4 h-4 text-slate-300" />
          리뷰ID {review.reviewId}
        </span>
        {/* 더보기 등 부가정보 자리 */}
      </div>
    </div>
  );
};

export type { ManagerReviewCardProps };
export default ManagerReviewCard; 