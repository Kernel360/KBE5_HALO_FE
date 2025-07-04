import { useUserStore } from "@/store/useUserStore";
import { Fragment } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@/shared/utils/logout";

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const { userName } = useUserStore();
  const location = useLocation();

  const menuItems = [
    { name: "대시보드", path: "/admin" },
    { name: "관리자 계정", path: "/admin/accounts" },
    { name: "고객 정보", path: "/admin/customers" },
    { name: "매니저 정보", path: "/admin/managers" },
    { name: "문의 내역", path: "/admin/inquiries" },
    //{ name: "공지/이벤트", path: "/admin/boards" },
    // ( name: "배너 관리"), path: "/admin/banners"},
    //{ name: "예약 관리", path: "/admin/reservations" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/auth/login");
  };

  return (
    <Fragment>
      <div className="w-60 h-screen pb-6 bg-white border-r border-gray-200 flex flex-col justify-between">
        {/* 상단 영역 */}
        <div className="flex flex-col gap-6">
          <div
            className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/admin")}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex justify-center items-center">
              <div className="text-white text-base font-bold">H</div>
            </div>
            <div className="text-gray-900 text-lg font-bold">HaloCare</div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 flex gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="text-gray-900 text-sm font-semibold">
                {userName}
              </div>
              <div className="text-gray-500 text-xs">관리자</div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {menuItems.map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                className={() => {
                  let active;
                  if (path === "/admin") {
                    active = location.pathname === "/admin";
                  } else {
                    active =
                      location.pathname === path ||
                      location.pathname.startsWith(path + "/");
                  }
                  return `h-11 px-6 flex items-center gap-3 w-full ${
                    active
                      ? "bg-violet-50 border-l-[3px] border-indigo-600 text-indigo-600 font-semibold"
                      : "text-gray-500 font-medium hover:text-indigo-600 hover:font-semibold"
                  }`;
                }}
              >
                {name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* 하단 로그아웃 버튼 */}
        <div className="px-6 pt-4 flex justify-center">
          <button
            className="w-28 h-10 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-1 hover:bg-gray-50 cursor-pointer"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-base text-gray-600">
              logout
            </span>
            <span className="text-stone-500 text-sm font-medium">로그아웃</span>
          </button>
        </div>
      </div>
    </Fragment>
  );
};
