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

export const CustomerHeader = forwardRef((_, ref) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn())
  const { userName } = useUserStore()
  const navigate = useNavigate()

  const [point, setPoint] = useState<number | null>(null)

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
      <div className="inline-flex h-20 items-center justify-between self-stretch border-b border-zinc-100 bg-white px-28">
        {/* 좌측 로고 */}
        <button
          onClick={() => navigate('/')}
          className="flex cursor-pointer items-center justify-start gap-2 border-none bg-transparent p-0"
          type="button">
          <div className="inline-flex h-8 w-8 flex-col items-center justify-center rounded-lg bg-indigo-600">
            <div className="justify-start font-['Inter'] text-base leading-tight font-bold text-white">
              H
            </div>
          </div>
          <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-zinc-800">
            HaloCare
          </div>
        </button>

        {/* 중간 메뉴 */}
        <div className="flex items-center justify-center gap-10">
          {menuItems.map(({ name, path }) => (
            <button
              key={path}
              onClick={e => handleMenuClick(path, e)}
              className="cursor-pointer justify-start border-none bg-transparent p-0 font-['Inter'] text-base leading-tight font-medium text-zinc-800 hover:text-indigo-600">
              {name}
            </button>
          ))}
        </div>

        {/* 우측 메뉴 */}
        {isLoggedIn ? (
          <div className="inline-flex items-center justify-end gap-4">
            <div className="flex items-center justify-end gap-3">
              {/* 이름 */}
              <div
                className="cursor-pointer font-['Inter'] text-base leading-tight font-medium text-zinc-800 hover:underline"
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
              className="inline-flex h-10 w-24 flex-col items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-gray-200"
              onClick={handleLogout}>
              <div className="cursor-pointer justify-start font-['Inter'] text-sm leading-none font-medium text-stone-500">
                로그아웃
              </div>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-4">
            <NavLink
              to={'/auth/login'}
              end
              className={
                "justify-start font-['Inter'] text-base leading-tight font-medium text-indigo-600"
              }>
              로그인
            </NavLink>
            <div className="inline-flex h-9 w-20 flex-col items-center justify-center rounded-md bg-indigo-600">
              <NavLink
                to={'/auth/signup'}
                end
                className={
                  "justify-start font-['Inter'] text-sm leading-none font-semibold text-white"
                }>
                회원가입
              </NavLink>
            </div>
            <div className="inline-flex h-9 w-23 flex-col items-center justify-center rounded-md bg-white outline outline-1 outline-offset-[-1px] outline-indigo-600">
              <NavLink
                to={'/managers/auth/signup'}
                end
                className={
                  "justify-start font-['Inter'] text-sm leading-none font-semibold text-indigo-600"
                }>
                매니저 모집
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  )
})

CustomerHeader.displayName = 'CustomerHeader'
