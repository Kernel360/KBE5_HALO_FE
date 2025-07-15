import { Fragment } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '@/shared/utils/logout'
import { useUserStore } from '@/store/useUserStore'

export const ManagerSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userName, status } = useUserStore()

  const menuItems = [
    { name: '대시보드', path: '/managers' },
    { name: '예약 관리', path: '/managers/reservations' },
    { name: '정산 관리', path: '/managers/payments' },
    { name: '리뷰 관리', path: '/managers/reviews' },
    { name: '문의 내역', path: '/managers/inquiries' },
    { name: '마이페이지', path: '/managers/my' }
  ]

  const allowedMenusByStatus: Record<string, string[]> = {
    ACTIVE: [
      '대시보드',
      '마이페이지',
      '예약 관리',
      '리뷰 관리',
      '문의 내역',
      '정산 관리'
    ],
    PENDING: ['마이페이지', '문의 내역'],
    REJECTED: ['마이페이지', '문의 내역'],
    TERMINATION_PENDING: [
      '대시보드',
      '마이페이지',
      '예약 관리',
      '리뷰 관리',
      '문의 내역',
      '정산 관리'
    ]
  }

  const filteredMenuItems = menuItems.filter(item =>
    (allowedMenusByStatus[status ?? ''] ?? []).includes(item.name)
  )

  const handleLogout = async () => {
    await logout()
    navigate('/managers/auth/login')
  }

  return (
    <Fragment>
      <div className="flex h-full w-60 max-w-[240px] min-w-[240px] flex-col border-r border-gray-200 bg-white">
        {/* 상단: 로고 + 프로필 */}
        <div>
          <div className="inline-flex items-center justify-start gap-3 p-6">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600">
              <div className="text-base leading-tight font-bold text-white">
                H
              </div>
            </div>
            <div className="text-lg leading-snug font-bold text-gray-900">
              HaloCare
            </div>
          </div>

          <div className="flex w-full gap-3 border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col gap-0.5">
              <div className="text-sm font-semibold text-gray-900">
                {userName}
              </div>
              <div className="text-xs text-gray-500">매니저</div>
            </div>
          </div>
        </div>

        {/* 메뉴 + spacer */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {filteredMenuItems.map(({ name, path }) => {
                const isActive =
                  path === '/managers'
                    ? location.pathname === path
                    : location.pathname.startsWith(path)
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={`flex h-11 w-full items-center gap-3 overflow-hidden px-6 ${
                      isActive
                        ? 'border-l-[3px] border-indigo-600 bg-violet-50 font-semibold text-indigo-600'
                        : 'font-medium text-gray-500 hover:font-semibold hover:text-indigo-600'
                    }`}>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {name}
                    </span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>

        {/* 하단: 로그아웃 버튼 */}
        <div className="px-6 py-4">
          <button
            onClick={handleLogout}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
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
