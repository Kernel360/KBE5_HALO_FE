import { useAuthStore } from "@/store/useAuthStore";
import { Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { logout } from "@/shared/utils/logout";

export const CustomerHeader = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const { userName } = useUserStore();
  const navigate = useNavigate();

  const menuItems = [
    { name: "예약하기", path: "/reservations/new" },
    { name: "마이페이지", path: "/my" },
  ];

  // 메뉴 클릭 핸들러 (로그인 체크)
  const handleMenuClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/auth/login");
    } else {
      navigate(path);
    }
  };

  // 수요자 로그아웃
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Fragment>
      <div className="self-stretch h-20 px-28 bg-white border-b border-zinc-100 inline-flex justify-between items-center">
        {/* 좌측 로고 */}
        <button
          onClick={() => navigate("/")}
          className="flex justify-start items-center gap-2 cursor-pointer bg-transparent border-none p-0"
          type="button"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg inline-flex flex-col justify-center items-center">
            <div className="justify-start text-white text-base font-bold font-['Inter'] leading-tight">
              H
            </div>
          </div>
          <div className="justify-start text-zinc-800 text-xl font-bold font-['Inter'] leading-normal">
            HaloCare
          </div>
        </button>

        {/* 중간 메뉴 */}
        <div className="flex justify-center items-center gap-10">
          {menuItems.map(({ name, path }) => (
            <button
              key={path}
              onClick={(e) => handleMenuClick(path, e)}
              className="justify-start text-zinc-800 text-base font-medium font-['Inter'] leading-tight bg-transparent border-none cursor-pointer hover:text-indigo-600 p-0"
            >
              {name}
            </button>
          ))}
        </div>

        {/* 우측 메뉴 */}
        {isLoggedIn ? (
          <div className="inline-flex justify-end items-center gap-4">
            <div className="flex justify-end items-center gap-2">
              <div
                className="justify-start text-zinc-800 text-base font-medium font-['Inter'] leading-tight cursor-pointer hover:underline"
                onClick={() => navigate("/my")}
              >
                {userName}님
              </div>
            </div>
            <button
              className="w-24 h-10 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-center items-center"
              onClick={handleLogout}
            >
              <div className="justify-start text-stone-500 text-sm font-medium font-['Inter'] leading-none cursor-pointer">
                로그아웃
              </div>
            </button>
          </div>
        ) : (
          <div className="flex justify-end items-center gap-4">
            <NavLink
              to={"/auth/login"}
              end
              className={
                "justify-start text-indigo-600 text-base font-medium font-['Inter'] leading-tight"
              }
            >
              로그인
            </NavLink>
            <div className="w-28 h-10 bg-indigo-600 rounded-lg inline-flex flex-col justify-center items-center">
              <NavLink
                to={"/auth/signup"}
                end
                className={
                  "justify-start text-white text-sm font-semibold font-['Inter'] leading-none"
                }
              >
                회원가입
              </NavLink>
            </div>
            <div className="w-36 h-10 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-indigo-600 inline-flex flex-col justify-center items-center">
              <NavLink
                to={"/managers/auth/signup"}
                end
                className={
                  "justify-start text-indigo-600 text-sm font-semibold font-['Inter'] leading-none"
                }
              >
                매니저 모집
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};
