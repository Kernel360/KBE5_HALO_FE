import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const AdminNotFound = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoggedIn) {
      navigate("/admin"); // 관리자 홈
    } else {
      navigate("/admin/auth/login"); // 로그인 페이지
    }
  };

  return (
    <div className="w-full min-h-screen px-6 py-10 bg-slate-50 flex flex-col justify-center items-center">
      {/* 404 카드 */}
      <div className="w-full max-w-2xl p-16 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] outline-zinc-100 flex flex-col justify-start items-center gap-8">
        <div className="flex flex-col justify-start items-center gap-6">
          <div className="w-28 h-28 bg-violet-50 rounded-[60px] flex flex-col justify-center items-center">
            <div className="text-indigo-600 text-5xl font-bold">404</div>
          </div>
          <div className="flex flex-col justify-start items-center gap-3">
            <div className="text-center text-zinc-800 text-3xl font-bold">
              페이지를 찾을 수 없습니다
            </div>
            <div className="text-center text-stone-500 text-base">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
              <br />
              잠시 후 다시 시도해보시거나 홈페이지로 이동해주세요.
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="inline-flex justify-start items-start gap-4">
          <button
            onClick={handleClick}
            className="w-40 h-12 bg-indigo-600 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition cursor-pointer"
          >
            <span className="text-white text-base font-semibold">
              홈으로 이동
            </span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-40 h-12 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center hover:bg-gray-50 transition cursor-pointer"
          >
            <span className="text-stone-500 text-base font-medium">
              이전 페이지
            </span>
          </button>
        </div>
      </div>

      {/* 도움말 섹션 */}
      <div className="w-full max-w-2xl mt-10 p-8 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] outline-zinc-100 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="text-zinc-800 text-xl font-bold">
            도움이 필요하신가요?
          </div>
          <div className="text-stone-500 text-sm">
            문제가 지속되면 고객센터로 문의해주세요.
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-full flex justify-center items-center">
              <span className="material-symbols-outlined text-indigo-600">
                call
              </span>
            </div>
            <div className="flex flex-col">
              <div className="text-stone-500 text-sm font-medium">고객센터</div>
              <div className="text-zinc-800 text-lg font-bold">1588-1234</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-full flex justify-center items-center">
              <span className="material-symbols-outlined text-indigo-600">
                schedule
              </span>
            </div>
            <div className="flex flex-col">
              <div className="text-stone-500 text-sm font-medium">운영시간</div>
              <div className="text-zinc-800 text-base font-semibold">
                평일 09:00-18:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotFound;
