import { StarRating } from "@/shared/components/ui/StarRating";
import { ReviewForm } from "@/shared/components";
import {
  StarIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { ReviewCard } from "@/shared/components/ui/ReviewCard";

// TODO: Replace 'any' with a proper type for reservation (ManagerReservationDetail)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ReviewSectionProps {
  reservation: any;
  rating: number;
  content: string;
  onRatingChange: (rating: number) => void;
  onContentChange: (content: string) => void;
  onSubmit: () => void;
  improvedDesign?: boolean;
}

export function ReviewSection({
  reservation,
  rating,
  content,
  onRatingChange,
  onContentChange,
  onSubmit,
  improvedDesign,
}: ReviewSectionProps) {
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
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-1">
            <UserCircleIcon className="w-8 h-8 text-yellow-400" />
            <span className="text-base font-bold text-yellow-700">
              {reservation.userName || "고객"}
            </span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
              수요자 리뷰
            </span>
          </div>
          {reservation.customerContent || reservation.customerRating ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <StarRating
                  rating={reservation.customerRating ?? 0}
                  showValue
                  className="!text-yellow-500 !text-2xl"
                />
                <span className="text-xs text-slate-500">
                  {reservation.customerCreateAt}
                </span>
              </div>
              <blockquote className="italic text-lg text-yellow-900 border-l-4 border-yellow-300 pl-4 bg-yellow-100/60 rounded min-h-[32px]">
                {reservation.customerContent}
              </blockquote>
            </>
          ) : (
            <div className="text-slate-400 text-base">
              아직 등록된 리뷰가 없습니다.
            </div>
          )}
        </div>
        {/* 매니저 리뷰 */}
        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-1">
            <PencilSquareIcon className="w-8 h-8 text-indigo-400" />
            <span className="text-base font-bold text-indigo-700">매니저</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
              매니저 리뷰
            </span>
          </div>
          {reservation.managerReviewId ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <StarRating
                  rating={reservation.managerRating ?? 0}
                  showValue
                  className="!text-yellow-500 !text-2xl"
                />
                <span className="text-xs text-slate-500">
                  {reservation.managerCreateAt}
                </span>
              </div>
              <blockquote className="italic text-lg text-indigo-900 border-l-4 border-indigo-300 pl-4 bg-indigo-100/60 rounded min-h-[32px]">
                {reservation.managerContent}
              </blockquote>
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