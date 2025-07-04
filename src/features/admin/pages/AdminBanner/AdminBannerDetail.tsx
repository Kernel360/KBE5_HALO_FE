import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { AdminBannerDetail as AdminBannerType } from "@/features/admin/types/AdminBannerType";
import {
  getAdminBanner,
  deleteAdminBanner,
} from "@/features/admin/api/adminBanners";
import bannerExample from "@/assets/배너예시.png";
import Loading from "@/shared/components/ui/Loading";

export const AdminBannerDetail = () => {
  const { bannerId } = useParams();
  const [banner, setBanner] = useState<AdminBannerType | null>(null);
  const navigate = useNavigate();

  // 배너 조회
  useEffect(() => {
    if (!bannerId) return;
    getAdminBanner(Number(bannerId)).then(setBanner);
  }, [bannerId]);
  if (!banner) {
    return (
      <Loading
        message="배너 정보를 불러오는 중..."
        size="lg"
        className="h-screen"
      />
    );
  }

  // 배너 수정
  const handleEdit = () => {
    if (!bannerId) return;
    navigate(`/admin/banners/${bannerId}/edit`, {
      state: { banner }, // banner 전체 객체를 state로 전달
    });
  };

  // 배너 삭제
  const handleDelete = async () => {
    if (!bannerId) return;
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteAdminBanner(Number(bannerId));
      alert("삭제가 완료되었습니다.");
      navigate("/admin/banners");
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <Fragment>
      <div className="w-full min-h-screen flex flex-col">
        {/* 상단 헤더 */}
        <div className="h-16 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="text-gray-900 text-xl font-bold">배너 상세</div>
          <div className="flex gap-2">
            <Link
              to="/admin/banners"
              className="h-10 px-4 flex justify-center items-center border rounded-md text-sm text-gray-500 hover:bg-gray-100"
            >
              목록으로
            </Link>
            <Fragment>
              <button
                onClick={handleEdit}
                className="h-10 px-4 bg-[#4f39f6] text-white rounded-md text-sm font-semibold hover:bg-[#3d2ee6]"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="h-10 px-4 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
              >
                삭제
              </button>
            </Fragment>
          </div>
        </div>

        {/* 본문 */}
        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
          <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">
              배너 정보
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">
                번호
              </div>
              <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">
                {banner.bannerId}
              </div>
            </div>

            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">
                제목
              </div>
              <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">
                {banner.title}
              </div>
            </div>

            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">
                게시기간
              </div>
              <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">
                {banner.startAt} ~ {banner.endAt}
              </div>
            </div>

            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">
                경로
              </div>
              <a
                href={banner.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 hover:underline text-sm font-medium font-['Inter'] leading-none transition-all"
              >
                {banner.path}
              </a>
            </div>

            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">
                조회수
              </div>
              <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">
                {banner.views}
              </div>
            </div>

            {/* <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-40 justify-start text-slate-500 text-sm font-medium font-['Inter'] leading-none">작성일시</div>
              <div className="flex-1 justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-none">{ banner.createdAt }</div>
            </div> */}
          </div>

          <div className="self-stretch p-8 bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-800 text-lg font-semibold font-['Inter'] leading-snug">
              배너 이미지
            </div>

            <img
              src={bannerExample}
              alt="배너 이미지"
              className="w-full object-cover rounded-lg border border-slate-200"
            />

            {/* {banner.fileId ? (
              <img
                src={banner.fileId}
                alt="배너 이미지"
                className="w-full max-h-64 object-cover rounded-lg border border-slate-200"
              />
            ) : (
              <div className="w-full h-32 flex items-center justify-center text-slate-400 bg-slate-100 rounded-lg border border-dashed border-slate-300">
                이미지 없음
              </div>
            )} */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
