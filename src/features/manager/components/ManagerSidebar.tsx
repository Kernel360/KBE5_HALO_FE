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
    { name: "마이페이지", path: "/managers/my" },
    { name: "예약 관리", path: "/managers/reservations" },
    { name: "리뷰 관리", path: "/managers/reviews" },
    { name: "문의 내역", path: "/managers/inquiries" },
    { name: "급여 관리", path: "/managers/payments" },
  ];

  const allowedMenusByStatus: Record<string, string[]> = {
    ACTIVE: ["대시보드", "마이페이지", "예약 관리", "리뷰 관리", "문의 내역", "급여 관리"],
    PENDING: ["마이페이지", "문의 내역"],
    REJECTED: ["마이페이지", "문의 내역"],
    TERMINATION_PENDING: ["대시보드", "마이페이지", "예약 관리", "리뷰 관리", "문의 내역", "급여 관리"]
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
      <div className="w-60 self-stretch pb-6 bg-white border-r border-gray-200 inline-flex flex-col justify-between">
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
                  className={`h-11 px-6 inline-flex items-center gap-3 w-full ${
                    isActive
                      ? "bg-violet-50 border-l-[3px] border-indigo-600 text-indigo-600 font-semibold"
                      : "text-gray-500 font-medium"
                  }`}
                >
                  {name}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="px-6 pt-4 flex justify-center">
          <button
            className="w-24 h-10 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center cursor-pointer"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-base text-gray-600">logout</span>
            <span className="text-stone-500 text-sm font-medium">로그아웃</span>
          </button>
        </div>
      </div>
    </Fragment>
  );
};
