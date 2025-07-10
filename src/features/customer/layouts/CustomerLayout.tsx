import { Fragment, useRef, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CustomerHeader } from '@/features/customer/components/CustomerHeader'
import { CustomerFooter } from '@/features/customer/components/CustomerFooter'
import CustomerSidebar from '@/features/customer/components/CustomerSidebar'

export const CustomerLayout = () => {
  const { pathname } = useLocation()
  // 사이드바를 보여주고 싶은 경로 배열
  const showSidebar = pathname.startsWith('/my')

  const headerRef = useRef<{ refreshPoint: () => void }>(null)

  useEffect(() => {
    // headerRef.current?.refreshPoint()
  }, [])

  return (
    <Fragment>
      <div className="inline-flex min-h-screen w-full flex-col bg-white">
        <CustomerHeader ref={headerRef} />

        {/* 메인 컨테이너: 헤더와 푸터 사이에 위치하며, 콘텐츠 영역을 포함 */}
        <div className="min-h-[calc(100vh-200px)] w-full bg-gray-100 py-8">
          {' '}
          {/* 뷰포트 높이에서 헤더/푸터 높이를 제외한 최소 높이, 배경색 회색, 위아래 패딩 */}
          <div className="mx-auto max-w-screen-xl px-6">
            {' '}
            {/* 중앙 정렬 및 좌우 패딩 */}
            {/* 사이드바와 메인 콘텐츠 영역 (사이드바가 필요할 때만 좌우 레이아웃) */}
            {showSidebar ? (
              <div className="flex items-start space-x-6">
                <CustomerSidebar />
                <main className="flex-1 rounded-lg bg-white p-6 shadow-sm">
                  <Outlet context={{ headerRef }} />
                </main>
              </div>
            ) : (
              // 사이드바가 필요 없을 때의 메인 콘텐츠 영역
              <main className="rounded-lg bg-white p-6 shadow-sm">
                <Outlet context={{ headerRef }} />
              </main>
            )}
          </div>
        </div>

        <CustomerFooter />
      </div>
    </Fragment>
  )
}
