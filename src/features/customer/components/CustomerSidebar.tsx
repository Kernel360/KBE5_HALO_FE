import React from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import ReservationSearchFilter from './search/ReservationSearchFilter'
import ReviewSearchFilter from './search/ReviewSearchFilter'
import InquirySearchFilter from './search/InquirySearchFilter'

interface MenuItems {
  name: string
  path: string
  searchType?: 'reservation' | 'review' | 'inquiry'
}

const CustomerSidebar: React.FC = () => {
  const menuItems: MenuItems[] = [
    { name: '마이페이지', path: '/my' },
    { name: '예약 내역', path: '/my/reservations', searchType: 'reservation' },
    { name: '리뷰 내역', path: '/my/reviews', searchType: 'review' },
    { name: '문의 내역', path: '/my/inquiries', searchType: 'inquiry' }
    //{ name: '좋아요/아쉬워요 매니저 목록', path: '/my/likes' },
  ]

  const location = useLocation()
  const [, setSearchParams] = useSearchParams()

  const getCurrentSearchType = ():
    | 'reservation'
    | 'review'
    | 'inquiry'
    | null => {
    const currentPath = location.pathname

    // 정확한 경로 매칭만 지원
    const currentMenu = menuItems.find(item => item.path === currentPath)
    if (currentMenu?.searchType) {
      return currentMenu.searchType
    }

    return null
  }

  const renderSearchSection = () => {
    const searchType = getCurrentSearchType()
    if (!searchType) return null

    return (
      <section className="flex w-full flex-col gap-6 rounded-2xl bg-white px-6 py-6 shadow-md outline outline-1 outline-offset-[-1px] outline-zinc-100">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base leading-tight font-semibold text-zinc-800">
            검색 조건
          </h2>
        </div>

        {searchType === 'reservation' && (
          <ReservationSearchFilter
            onSearch={filters => {
              const params = new URLSearchParams()
              
              // 날짜 범위
              if (filters.dateRange.start) {
                params.set('fromRequestDate', filters.dateRange.start)
              }
              if (filters.dateRange.end) {
                params.set('toRequestDate', filters.dateRange.end)
              }
              
              // 예약 상태
              filters.reservationStatus.forEach(status => {
                params.append('status', status)
              })
              
              // 매니저명
              if (filters.managerName) {
                params.set('managerName', filters.managerName)
              }
              
              setSearchParams(params)
            }}
            onReset={() => {
              setSearchParams(new URLSearchParams())
            }}
          />
        )}

        {searchType === 'review' && (
          <ReviewSearchFilter
            onRatingChange={(rating: number | null) => {
              const params = new URLSearchParams()
              if (rating !== null) params.set('rating', rating.toString())
              setSearchParams(params)
            }}
            selectedRating={(() => {
              const params = new URLSearchParams(location.search)
              const rating = params.get('rating')
              return rating ? parseInt(rating) : null
            })()}
          />
        )}

        {searchType === 'inquiry' && (
          <InquirySearchFilter
            onSearch={filters => {
              const params = new URLSearchParams()
              if (filters.dateRange.start)
                params.set('startDate', filters.dateRange.start)
              if (filters.dateRange.end)
                params.set('endDate', filters.dateRange.end)
              if (filters.replyStatus)
                params.set('replyStatus', filters.replyStatus)
              if (filters.titleKeyword)
                params.set('titleKeyword', filters.titleKeyword)
              if (filters.contentKeyword)
                params.set('contentKeyword', filters.contentKeyword)
              setSearchParams(params)
            }}
            onReset={() => {
              setSearchParams(new URLSearchParams())
            }}
          />
        )}
      </section>
    )
  }

  return (
    <aside className="flex w-full max-w-xs flex-col space-y-6">
      {renderSearchSection()}

      {/* Customer Service Section - Already has bg-white, rounded-2xl, shadow-md, outline */}
      <section className="flex w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-md outline outline-1 outline-offset-[-1px] outline-zinc-100">
        <h2 className="text-base leading-tight font-semibold text-zinc-800">
          고객센터
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-xl leading-normal font-bold text-zinc-800">
            1588-1234
          </p>
          <p className="text-sm leading-none text-stone-500">
            평일 09:00-18:00
          </p>
          <p className="text-sm leading-none text-stone-500">
            주말/공휴일 휴무
          </p>
        </div>
      </section>
    </aside>
  )
}

export default CustomerSidebar
