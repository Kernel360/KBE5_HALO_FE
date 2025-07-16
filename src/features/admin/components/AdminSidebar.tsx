import { useUserStore } from '@/store/useUserStore'
import { Fragment } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '@/shared/utils/logout'

export const AdminSidebar = () => {
  const navigate = useNavigate()
  const { userName } = useUserStore()
  const location = useLocation()

  const menuItems = [
    { name: '대시보드', path: '/admin' },
    { name: '문의 내역', path: '/admin/inquiries' },
    { name: '정산 내역', path: '/admin/settlements' },
    { name: '매니저 정보', path: '/admin/managers' },
    { name: '고객 정보', path: '/admin/customers' },
    { name: '관리자 계정', path: '/admin/accounts' }

    //{ name: "공지/이벤트", path: "/admin/boards" },
    // ( name: "배너 관리"), path: "/admin/banners"},
    //{ name: "예약 관리", path: "/admin/reservations" },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/admin/auth/login')
  }

  return (
    <Fragment>
      <div className="flex h-screen w-60 flex-col justify-between border-r border-gray-200 bg-white pb-6">
        {/* 상단 영역 */}
        <div className="flex flex-col gap-6">
          <div
            className="flex cursor-pointer items-center gap-3 p-6 transition-opacity hover:opacity-80"
            onClick={() => navigate('/admin')}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600">
              <div className="text-base font-bold text-white">H</div>
            </div>
            <div className="text-lg font-bold text-gray-900">HaloCare</div>
          </div>

          <div className="flex gap-3 border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col gap-0.5">
              <div className="text-sm font-semibold text-gray-900">
                {userName}
              </div>
              <div className="text-xs text-gray-500">관리자</div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {menuItems.map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                className={() => {
                  let active
                  if (path === '/admin') {
                    active = location.pathname === '/admin'
                  } else {
                    active =
                      location.pathname === path ||
                      location.pathname.startsWith(path + '/')
                  }
                  return `flex h-11 w-full items-center gap-3 px-6 ${
                    active
                      ? 'border-l-[3px] border-indigo-600 bg-violet-50 font-semibold text-indigo-600'
                      : 'font-medium text-gray-500 hover:font-semibold hover:text-indigo-600'
                  }`
                }}>
                {name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* 하단 로그아웃 버튼 */}
        <div className="flex justify-center px-6 pt-4">
          <button
            className="flex h-10 w-28 cursor-pointer items-center justify-center gap-1 rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-gray-200 hover:bg-gray-50"
            onClick={handleLogout}>
            <span className="material-symbols-outlined text-base text-gray-600">
              logout
            </span>
            <span className="text-sm font-medium text-stone-500">로그아웃</span>
          </button>
        </div>
      </div>
    </Fragment>
  )
}
