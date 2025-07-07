import { Fragment, useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '@/shared/utils/login'
import { isValidPhone, isValidPassword } from '@/shared/utils/validation'
import { formatPhoneNumber } from '@/shared/utils/format'
import { useUserStore } from '@/store/useUserStore'
import { Card } from '@/shared/components/ui/Card'
import { CardContent } from '@/shared/components/ui/CardContent'
import { Button } from '@/shared/components/ui/Button'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import FormField from '@/shared/components/ui/FormField'
import { Input } from "@/shared/components/ui/Input";
import { Eye, EyeOff } from "lucide-react";

export const ManagerLogin = () => {
  const [loginPhone, setPhone] = useState('')
  const [loginPassword, setPassword] = useState('')
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({})
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' })
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  // 매니저 주요 기능 설명
  const featureDetails = [
    '💡 예약 현황을 한눈에 확인하고, 일정을 효율적으로 관리할 수 있습니다.',
    '💡 고객 문의 내역을 확인하고, 신속하게 답변할 수 있습니다.',
    '💡 내 프로필, 계약 현황, 정산 내역을 쉽고 빠르게 확인할 수 있습니다.',
  ]

  // 팝오버 바깥 클릭 시 닫힘 처리
  useEffect(() => {
    if (openFeatureIndex === null) return
    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setOpenFeatureIndex(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openFeatureIndex])

  // 사용자의 전화번호 입력값을 하이픈 포함 형식으로 자동 포맷하는 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value))
    setErrors((prev) => ({ ...prev, phone: undefined }))
  }

  // 매니저 로그인
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    // 유효성 검사
    const newErrors: { phone?: string; password?: string } = {}
    if (!isValidPhone(loginPhone)) {
      newErrors.phone = '연락처 형식이 올바르지 않습니다. 예: 010-1234-5678'
    }
    if (!isValidPassword(loginPassword)) {
      newErrors.password = '비밀번호는 8~20자, 대/소문자/숫자/특수문자 중 3가지 이상 포함하여야 합니다.'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    try {
      await login('MANAGER', loginPhone, loginPassword)
      const status = useUserStore.getState().status
      switch (status) {
        case 'ACTIVE':
        case 'TERMINATION_PENDING':
          navigate('/managers')
          break
        default:
          navigate('/managers/my')
          break
      }
    } catch (err: any) {
      setToast({ open: true, message: err?.message || '로그인 실패' })
    }
  }

  return (
    <Fragment>
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-2 py-8">
        <div className="flex w-full max-w-4xl flex-col-reverse items-center gap-8 md:flex-row md:gap-12">
          {/* 매니저 주요 기능 안내 카드 */}
          <Card
            ref={cardRef}
            className="mt-6 flex w-full max-w-xs flex-col gap-0 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-0 shadow md:mt-0 md:max-w-[400px]"
          >
            <div className="flex flex-col gap-2 px-6 pt-8 pb-4 md:px-10 md:pt-10">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                  ★
                </span>
                <span className="font-['Inter'] text-lg font-extrabold tracking-tight text-indigo-700 md:text-xl">
                  매니저 주요 기능
                </span>
              </div>
              <div className="mt-1 font-['Inter'] text-sm font-semibold text-gray-600 md:text-base">
                무엇을 할 수 있나요?
              </div>
            </div>
            <CardContent className="flex flex-col gap-3 p-4 pt-2 md:p-8">
              {[
                {
                  title: '예약 관리',
                  desc: '예약 현황 확인 및 일정 관리',
                },
                {
                  title: '고객 문의 응답',
                  desc: '고객 문의 내역 확인 및 답변',
                },
                {
                  title: '내 정보/계약 관리',
                  desc: '프로필, 계약, 정산 내역 확인',
                },
              ].map((item, idx) => (
                <div
                  key={item.title}
                  className="group relative flex cursor-pointer items-center gap-3 rounded-lg bg-indigo-50/0 px-2 py-2 transition hover:bg-indigo-50 md:px-3"
                  onClick={() => setOpenFeatureIndex(openFeatureIndex === idx ? null : idx)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                    {['①', '②', '③'][idx]}
                  </span>
                  <div>
                    <div className="text-base font-bold text-gray-900 md:text-base">{item.title}</div>
                    <div className="text-xs text-gray-500 md:text-sm">{item.desc}</div>
                  </div>
                  {/* 팝오버 말풍선 */}
                  {openFeatureIndex === idx && (
                    <div
                      className={`absolute top-full left-1/2 z-20 mt-2 w-[90vw] max-w-xs -translate-x-1/2 md:top-1/2 md:left-full md:mt-0 md:ml-4 md:-translate-x-0 md:-translate-y-1/2`}>
                      <div className="animate-fade-in relative w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-lg md:px-4 md:py-3 md:text-sm">
                        {/* 꼬리(삼각형) */}
                        <div
                          className={`absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-0 border-b-8 border-x-transparent border-b-white md:top-1/2 md:left-[-8px] md:-translate-x-0 md:-translate-y-1/2 md:border-x-8 md:border-y-8 md:border-r-8 md:border-b-0 md:border-l-0 md:border-x-transparent md:border-y-transparent md:border-r-white`}
                        ></div>
                        {featureDetails[idx]}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          {/* 로그인 카드 */}
          <Card variant="login" className="w-[480px] flex-col gap-0 p-0">
            {/* 상단 영역 */}
            <div className="flex flex-col items-center gap-1 rounded-t-2xl border-b border-gray-100 bg-gradient-to-b from-indigo-50 to-white pt-10 pb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-indigo-700">HaloCare</span>
                <span className="text-lg font-semibold tracking-wide text-gray-500">매니저 포털</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">HaloCare 서비스를 위한 매니저 전용 공간입니다.</div>
            </div>
            {/* 폼 영역 */}
            <CardContent className="flex flex-col gap-7 rounded-b-2xl bg-white p-10">
              <form className="flex flex-col gap-7" onSubmit={handleLogin}>
                {/* 연락처 */}
                <FormField
                  label="연락처"
                  name="manager-login-phone"
                  type="tel"
                  value={loginPhone}
                  onChange={handlePhoneChange}
                  placeholder="숫자만 입력하세요 (예: 01012345678)"
                  required
                  error={errors.phone}
                />
                {/* 비밀번호 (커스텀 구현) */}
                <div className="mb-4">
                  <label className="mb-1 block font-medium text-gray-700">
                    비밀번호 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      name="manager-login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      required
                      className={`appearance-none invalid:shadow-none invalid:outline-none focus:outline-none h-11 w-full rounded-md border bg-gray-50 px-4 text-sm text-gray-900 transition ${
                        errors.password
                          ? "border-red-400 ring-1 ring-red-100 focus:border-red-500"
                          : "border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="relative mt-1">
                      <div className="w-fit max-w-full rounded-xl border border-red-200 bg-white px-3 py-1 text-xs text-red-500 shadow">
                        {errors.password}
                      </div>
                      <div className="absolute -top-2 left-4 h-0 w-0 border-x-8 border-t-0 border-b-8 border-x-transparent border-b-white"></div>
                    </div>
                  )}
                </div>
                {/* 로그인 버튼 */}
                <Button
                  type="submit"
                  className="h-12 w-full rounded-lg text-lg font-bold text-white shadow transition bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700"
                >
                  로그인
                </Button>
              </form>
              {/* 안내 문구 및 회원가입 */}
              <div className="mt-2 text-center text-xs text-gray-400">
                아직 계정이 없으신가요?{' '}
                <Link to="/managers/auth/signup" className="font-semibold text-indigo-600 hover:underline">
                  회원가입
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <ErrorToast
          open={toast.open}
          message={toast.message}
          onClose={() => setToast({ open: false, message: '' })}
        />
      </div>
    </Fragment>
  )
}
