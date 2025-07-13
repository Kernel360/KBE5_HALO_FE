import { useAuthStore } from '@/store/useAuthStore'
import {
  Fragment,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/useUserStore'
import { logout } from '@/shared/utils/logout'
import { getCustomerPoint } from '@/features/customer/api/customerAuth'
import { Menu, X } from 'lucide-react'

export const CustomerHeader = forwardRef((_, ref) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn())
  const { userName } = useUserStore()
  const navigate = useNavigate()

  const [point, setPoint] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchPoint = async () => {
      const res = await getCustomerPoint()
      setPoint(res.point)
    }

    if (isLoggedIn) {
      fetchPoint()
    }
  }, [isLoggedIn])

  const refreshPoint = async () => {
    try {
      const res = await getCustomerPoint()
      setPoint(res.point)
    } catch (e) {
      console.error('포인트 갱신 실패', e)
    }
  }

  useImperativeHandle(ref, () => ({
    refreshPoint
  }))

  const menuItems = [
    { name: '예약하기', path: '/reservations/new' },
    { name: '예약 내역', path: '/my/reservations' },
    { name: '리뷰 내역', path: '/my/reviews' },
    { name: '문의 내역', path: '/my/inquiries' },
    { name: '회원정보', path: '/my' }
  ]

  // 메뉴 클릭 핸들러 (로그인 체크)
  const handleMenuClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault()
    setIsMobileMenuOpen(false) // 모바일 메뉴 닫기
    if (!isLoggedIn) {
      navigate('/auth/login')
    } else {
      navigate(path)
    }
  }

  // 수요자 로그아웃
  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <Fragment>
      <div className="flex h-16 items-center justify-between border-b border-zinc-100 bg-white px-4 sm:h-20 sm:px-8 lg:px-28">
        {/* 좌측 로고 */}
        <button
          onClick={() => navigate('/')}
          className="flex cursor-pointer items-center justify-start gap-2 border-none bg-transparent p-0"
          type="button">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <div className="font-['Inter'] text-base leading-tight font-bold text-white">
              H
            </div>
          </div>
          <div className="font-['Inter'] text-lg leading-normal font-bold text-zinc-800 sm:text-xl">
            HaloCare
          </div>
        </button>

        {/* 데스크톱 메뉴 */}
        <div className="hidden items-center justify-center gap-6 lg:flex lg:gap-10">
          {menuItems.map(({ name, path }) => (
            <button
              key={path}
              onClick={e => handleMenuClick(path, e)}
              className="cursor-pointer border-none bg-transparent p-0 font-['Inter'] text-sm leading-tight font-medium text-zinc-800 transition-colors hover:text-indigo-600 lg:text-base">
              {name}
            </button>
          ))}
        </div>

        {/* 데스크톱 우측 메뉴 */}
        <div className="hidden lg:flex">
          {isLoggedIn ? (
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center justify-end gap-3">
                {/* 이름 */}
                <div
                  className="cursor-pointer font-['Inter'] text-sm leading-tight font-medium text-zinc-800 hover:underline lg:text-base"
                  onClick={() => navigate('/my')}>
                  {userName}님
                </div>
                {/* 포인트 */}
                {typeof point === 'number' && (
                  <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {point.toLocaleString()}P
                  </div>
                )}
              </div>
              <button
                className="flex h-9 w-20 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-gray-200 lg:h-10 lg:w-24"
                onClick={handleLogout}>
                <div className="cursor-pointer font-['Inter'] text-xs leading-none font-medium text-stone-500 lg:text-sm">
                  로그아웃
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2 lg:gap-4">
              <NavLink
                to={'/auth/login'}
                end
                className="font-['Inter'] text-sm leading-tight font-medium text-indigo-600 lg:text-base">
                로그인
              </NavLink>
              <div className="flex h-8 w-16 items-center justify-center rounded-md bg-indigo-600 lg:h-9 lg:w-20">
                <NavLink
                  to={'/auth/signup'}
                  end
                  className="font-['Inter'] text-xs leading-none font-semibold text-white lg:text-sm">
                  회원가입
                </NavLink>
              </div>
              <div className="flex h-8 w-20 items-center justify-center rounded-md bg-white outline outline-1 outline-offset-[-1px] outline-indigo-600 lg:h-9 lg:w-23">
                <NavLink
                  to={'/managers/auth/signup'}
                  end
                  className="font-['Inter'] text-xs leading-none font-semibold text-indigo-600 lg:text-sm">
                  매니저 모집
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* 모바일 햄버거 메뉴 & 간소화된 우측 메뉴 */}
        <div className="flex items-center gap-2 lg:hidden">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {/* 포인트 */}
              {typeof point === 'number' && (
                <div className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                  {point.toLocaleString()}P
                </div>
              )}
              {/* 이름 */}
              <div
                className="cursor-pointer font-['Inter'] text-sm leading-tight font-medium text-zinc-800"
                onClick={() => navigate('/my')}>
                {userName}님
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to={'/auth/login'}
                end
                className="font-['Inter'] text-sm leading-tight font-medium text-indigo-600">
                로그인
              </NavLink>
              <div className="flex h-8 w-16 items-center justify-center rounded-md bg-indigo-600">
                <NavLink
                  to={'/auth/signup'}
                  end
                  className="font-['Inter'] text-xs leading-none font-semibold text-white">
                  회원가입
                </NavLink>
              </div>
            </div>
          )}

          {/* 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="border-b border-zinc-100 bg-white lg:hidden">
          <div className="flex flex-col px-4 py-3">
            {menuItems.map(({ name, path }) => (
              <button
                key={path}
                onClick={e => handleMenuClick(path, e)}
                className="border-none bg-transparent p-3 text-left font-['Inter'] text-base font-medium text-zinc-800 hover:bg-gray-50 hover:text-indigo-600">
                {name}
              </button>
            ))}
            {isLoggedIn && (
              <>
                <div className="my-2 border-t border-gray-200"></div>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="border-none bg-transparent p-3 text-left font-['Inter'] text-base font-medium text-red-600 hover:bg-gray-50">
                  로그아웃
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <div className="my-2 border-t border-gray-200"></div>
                <button
                  onClick={() => {
                    navigate('/managers/auth/signup')
                    setIsMobileMenuOpen(false)
                  }}
                  className="border-none bg-transparent p-3 text-left font-['Inter'] text-base font-medium text-indigo-600 hover:bg-gray-50">
                  매니저 모집
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Fragment>
  )
})

CustomerHeader.displayName = 'CustomerHeader'
