import React from "react";
import Modal from "@/shared/components/ui/modal/Modal";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { StarRating } from "@/shared/components/ui/StarRating";
import type { SearchManagerReviews as ManagerReviewType } from "@/features/manager/types/ManagerReviewlType";

interface ManagerReviewDetailModalProps {
  open: boolean;
  onClose: () => void;
  review: ManagerReviewType | null;
}

const ManagerReviewDetailModal: React.FC<ManagerReviewDetailModalProps> = ({
  open,
  onClose,
  review,
}) => {
  if (!review) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative max-w-3xl w-full max-h-[80vh] flex flex-col bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border-b bg-white rounded-t-lg">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-lg text-slate-800 truncate max-w-[160px]">
                {review.authorName}
              </span>
              <span className="text-xs text-slate-400">{review.createdAt}</span>
              <span className="inline-block ml-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 text-white px-3 py-1 text-xs font-semibold shadow border border-white">
                {review.serviceName}
              </span>
            </div>
            <StarRating
              rating={review.rating}
              size="lg"
              showValue
              className="mt-1"
            />
          </div>
          <button
            className="ml-auto p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={onClose}
            aria-label="닫기"
          >
            <XMarkIcon className="w-7 h-7 text-slate-400" />
          </button>
        </div>
        {/* Content */}
        <div
          className="flex-1 overflow-y-auto px-8 py-6 bg-slate-50 whitespace-pre-line break-words text-base text-slate-700"
          style={{ minHeight: 200 }}
        >
          {review.content}
        </div>
      </div>
    </Modal>
  );
};

export default ManagerReviewDetailModal; 