import { StarRating } from "@/shared/components/ui/StarRating";
import { ReviewForm } from "@/shared/components";
import { StarIcon, UserCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { ReviewCard } from "@/shared/components/ui/ReviewCard";

export function ReviewSection({
  reservation,
  rating,
  content,
  onRatingChange,
  onContentChange,
  onSubmit,
  improvedDesign,
}: any) {
  if (!(reservation.outTime && reservation.status === "COMPLETED")) return null;

  if (!improvedDesign) {
    return (
      <div className="flex flex-col items-start justify-start gap-2 self-stretch rounded-xl bg-white p-8 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
        <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
          수요자 리뷰
        </div>
        <ReviewCard
          rating={reservation.customerRating ?? 0}
          content={reservation.customerContent || ""}
          createdAt={reservation.customerCreateAt || ""}
          emptyMessage="아직 등록된 리뷰가 없습니다."
        />
        <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
          매니저 리뷰
        </div>
        {reservation.managerReviewId ? (
          <ReviewCard
            rating={reservation.managerRating ?? 0}
            content={reservation.managerContent || ""}
            createdAt={reservation.managerCreateAt || ""}
          />
        ) : (
          <ReviewForm
            rating={rating}
            content={content}
            onRatingChange={onRatingChange}
            onContentChange={onContentChange}
            onSubmit={onSubmit}
            placeholder="서비스에 대한 리뷰를 작성해주세요"
            submitText="리뷰 작성하기"
          />
        )}
      </div>
    );
  }

  // Improved design: info-block style (not card)
  return (
    <section className="pt-6 border-t border-slate-200 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
          <StarIcon className="w-5 h-5 text-yellow-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">리뷰</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 수요자 리뷰 */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <UserCircleIcon className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">수요자 리뷰</span>
          </div>
          {reservation.customerContent || reservation.customerRating ? (
            <>
              <div className="flex items-center gap-2">
                <StarRating rating={reservation.customerRating ?? 0} showValue className="!text-yellow-500" />
                <span className="text-xs text-slate-500">{reservation.customerCreateAt}</span>
              </div>
              <div className="text-base text-slate-700 whitespace-pre-line min-h-[32px]">
                {reservation.customerContent}
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-base">아직 등록된 리뷰가 없습니다.</div>
          )}
        </div>
        {/* 매니저 리뷰 */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <PencilSquareIcon className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700">매니저 리뷰</span>
          </div>
          {reservation.managerReviewId ? (
            <>
              <div className="flex items-center gap-2">
                <StarRating rating={reservation.managerRating ?? 0} showValue className="!text-yellow-500" />
                <span className="text-xs text-slate-500">{reservation.managerCreateAt}</span>
              </div>
              <div className="text-base text-slate-700 whitespace-pre-line min-h-[32px]">
                {reservation.managerContent}
              </div>
            </>
          ) : (
            <ReviewForm
              rating={rating}
              content={content}
              onRatingChange={onRatingChange}
              onContentChange={onContentChange}
              onSubmit={onSubmit}
              placeholder="서비스에 대한 리뷰를 작성해주세요"
              submitText="리뷰 작성하기"
            />
          )}
        </div>
      </div>
    </section>
  );
} 