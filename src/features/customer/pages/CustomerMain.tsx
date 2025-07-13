import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Gift, Sparkles } from 'lucide-react'
import homeIcon from '@/assets/home.svg'
import airconIcon from '@/assets/aircon.svg'
import strollerIcon from '@/assets/stroller.svg'

export const CustomerMain = () => {
  const navigate = useNavigate()
  const { accessToken } = useAuthStore()

  return (
    <Fragment>
      {/* Hero Section */}
      <div className="flex min-h-[400px] flex-col items-start justify-center bg-gradient-to-l from-indigo-600 to-violet-600 px-4 py-12 sm:px-8 md:px-16 lg:px-28 lg:py-20">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6 text-2xl leading-tight font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
            전문 매니저와 깔끔한 생활,
            <br />
            지금 시작하세요!
          </div>
          <div className="mb-8 text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl">
            HaloCare와 함께라면 청소와 가사 걱정은 끝!
            <br />
            전문 매니저가 당신의 일상을 더 편안하게 만들어 드립니다.
          </div>
          <button
            onClick={() => {
              if (accessToken) {
                navigate('/reservations/new')
              } else {
                navigate('/auth/login')
              }
            }}
            className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-indigo-600 transition-colors sm:px-8 sm:py-4 sm:text-lg">
            지금 예약하기
          </button>
        </div>
      </div>

      {/* Event Banner */}
      <div className="bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 p-[2px] sm:rounded-2xl">
            <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-4 py-4 sm:flex-row sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 sm:h-12 sm:w-12">
                <Gift className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div className="flex flex-1 flex-col items-center gap-2 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Sparkles className="h-4 w-4 text-yellow-500 sm:h-6 sm:w-6" />
                  <span className="text-center text-sm font-bold text-gray-800 sm:text-left sm:text-xl">
                    런칭 기념 특별 이벤트
                  </span>
                  <Sparkles className="h-4 w-4 text-yellow-500 sm:h-6 sm:w-6" />
                </div>
                <div className="text-center text-sm font-bold text-purple-600 sm:text-left sm:text-xl">
                  🎉 신규 회원 1,000,000P 지급! 🎉
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              간편한 HaloCare 이용 방법
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              간편한 3단계로 청소 서비스를 이용해보세요
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white sm:mb-6 sm:h-20 sm:w-20 sm:text-3xl">
                1
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:mb-4 sm:text-xl">
                서비스 선택
              </h3>
              <p className="text-sm text-gray-600 sm:text-base">
                필요한 서비스와 날짜, 시간을 선택하세요.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white sm:mb-6 sm:h-20 sm:w-20 sm:text-3xl">
                2
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:mb-4 sm:text-xl">
                매니저 매칭
              </h3>
              <p className="text-sm text-gray-600 sm:text-base">
                검증된 전문 매니저가 배정됩니다.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white sm:mb-6 sm:h-20 sm:w-20 sm:text-3xl">
                3
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:mb-4 sm:text-xl">
                서비스 완료
              </h3>
              <p className="text-sm text-gray-600 sm:text-base">
                깔끔하게 정리된 공간을 확인하세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories Section */}
      <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              서비스 카테고리
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              다양한 청소 서비스 중 필요한 서비스를 선택하세요
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl bg-white p-6 text-center sm:rounded-2xl sm:p-8">
              <img
                src={homeIcon}
                alt="가사 아이콘"
                className="mb-4 h-16 w-16 object-contain sm:mb-6 sm:h-20 sm:w-20"
              />
              <h3 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">
                가사 서비스
              </h3>
              <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
                일상적인 집안일부터 대청소까지, 전문 매니저가 도와드립니다.
              </p>
              <button className="rounded-lg border-2 border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 sm:px-6 sm:py-3 sm:text-base">
                자세히 보기
              </button>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-white p-6 text-center sm:rounded-2xl sm:p-8">
              <img
                src={airconIcon}
                alt="에어컨 청소 아이콘"
                className="mb-4 h-16 w-16 object-contain sm:mb-6 sm:h-20 sm:w-20"
              />
              <h3 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">
                에어컨 청소
              </h3>
              <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
                에어컨 내부 세척부터 필터 교체까지, 쾌적한 공기를 위한
                서비스입니다.
              </p>
              <button className="rounded-lg border-2 border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 sm:px-6 sm:py-3 sm:text-base">
                자세히 보기
              </button>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-white p-6 text-center sm:rounded-2xl sm:p-8 md:col-span-2 lg:col-span-1">
              <img
                src={strollerIcon}
                alt="돌봄 아이콘"
                className="mb-4 h-16 w-16 object-contain sm:mb-6 sm:h-20 sm:w-20"
              />
              <h3 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">
                돌봄 서비스
              </h3>
              <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
                아이돌봄, 노인돌봄 등 맞춤형 돌봄 서비스를 제공합니다.
              </p>
              <button className="rounded-lg border-2 border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 sm:px-6 sm:py-3 sm:text-base">
                자세히 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
