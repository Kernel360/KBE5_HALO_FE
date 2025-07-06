import { Fragment } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@/shared/utils/logout";
import { useUserStore } from "@/store/useUserStore";

export const ManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, status } = useUserStore();

  const menuItems = [
    { name: "대시보드", path: "/managers" },
    { name: "예약 관리", path: "/managers/reservations" },
    { name: "리뷰 관리", path: "/managers/reviews" },
    { name: "문의 내역", path: "/managers/inquiries" },
    { name: "마이페이지", path: "/managers/mypage" }
   // { name: "정산 관리", path: "/managers/payments" },
  ];

  const allowedMenusByStatus: Record<string, string[]> = {
    ACTIVE: ["대시보드", "마이페이지", "예약 관리", "리뷰 관리", "문의 내역", "정산 관리"],
  };

  const filteredMenuItems = menuItems.filter((item) =>
    (allowedMenusByStatus[status ?? ""] ?? []).includes(item.name)
  );

  const handleLogout = async () => {
    await logout();
    navigate("/managers/auth/login");
  };

  return (
    <Fragment>
      <div className="w-60 min-w-[240px] max-w-[240px] h-full bg-white border-r border-gray-200 flex flex-col">
        {/* 상단: 로고 + 프로필 */}
        <div>
          <div className="p-6 inline-flex justify-start items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-md inline-flex justify-center items-center">
              <div className="text-white text-base font-bold leading-tight">H</div>
            </div>
            <div className="text-gray-900 text-lg font-bold leading-snug">HaloCare</div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 flex gap-3 w-full">
            <div className="flex flex-col gap-0.5">
              <div className="text-gray-900 text-sm font-semibold">{userName}</div>
              <div className="text-gray-500 text-xs">매니저</div>
            </div>
          </div>
        </div>

        {/* 메뉴 + spacer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {filteredMenuItems.map(({ name, path }) => {
                const isActive =
                  path === "/managers"
                    ? location.pathname === path
                    : location.pathname.startsWith(path);
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={`h-11 px-6 flex items-center gap-3 w-full overflow-hidden ${
                      isActive
                        ? "bg-violet-50 border-l-[3px] border-indigo-600 text-indigo-600 font-semibold"
                        : "text-gray-500 font-medium hover:text-indigo-600 hover:font-semibold"
                    }`}
                  >
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* 하단: 로그아웃 버튼 */}
        <div className="px-6 py-4">
          <button
            onClick={handleLogout}
            className="w-full h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-base text-gray-600">logout</span>
            <span className="text-stone-500 text-sm font-medium">로그아웃</span>
          </button>
        </div>
      </div>
    </Fragment>
  );
};
