import { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '@/shared/utils/login'
import { isValidPhone, isValidPassword } from '@/shared/utils/validation'
import { formatPhoneNumber } from '@/shared/utils/format'
import { useUserStore } from '@/store/useUserStore'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import { LoginCard } from '@/shared/components/ui/LoginCard'
import { FeatureCard } from '@/shared/components/ui/FeatureCard'

export const ManagerLogin = () => {
  const [loginPhone, setPhone] = useState('')
  const [loginPassword, setPassword] = useState('')
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {}
  )
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  // FeatureCard에서 내부적으로 팝오버 상태 관리
  const navigate = useNavigate()

  // 연락처 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value))
    setErrors(prev => ({ ...prev, phone: undefined }))
  }

  // 로그인 핸들러
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const newErrors: { phone?: string; password?: string } = {}
    if (!isValidPhone(loginPhone)) {
      newErrors.phone = '연락처 형식이 올바르지 않습니다. 예: 010-1234-5678'
    }
    if (!isValidPassword(loginPassword)) {
      newErrors.password =
        '비밀번호는 8~20자, 대/소문자/숫자/특수문자 중 3가지 이상 포함하여야 합니다.'
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
    } catch (err) {
      setToast({
        open: true,
        message: (err as { message?: string })?.message || '로그인 실패'
      })
    }
  }

  return (
    <Fragment>
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-2 py-8">
        <div className="flex w-full max-w-4xl flex-col-reverse items-center gap-8 md:flex-row md:gap-12">
          <FeatureCard
            icon={<>★</>}
            title="매니저 주요 기능"
            features={[
              {
                title: '예약 관리',
                desc: '예약 현황 확인 및 일정 관리',
                detail:
                  '💡 예약 현황을 한눈에 확인하고, 일정을 효율적으로 관리할 수 있습니다.'
              },
              {
                title: '고객 문의 응답',
                desc: '고객 문의 내역 확인 및 답변',
                detail:
                  '💡 고객 문의 내역을 확인하고, 신속하게 답변할 수 있습니다.'
              },
              {
                title: '내 정보/계약 관리',
                desc: '프로필, 계약, 정산 내역 확인',
                detail:
                  '💡 내 프로필, 계약 현황, 정산 내역을 쉽고 빠르게 확인할 수 있습니다.'
              }
            ]}
          />
          {/* 로그인 카드 */}
          <LoginCard
            title1="HaloCare"
            title2="매니저 포털"
            subtitle="HaloCare 서비스를 위한 매니저 전용 공간입니다."
            phoneValue={loginPhone}
            onPhoneChange={handlePhoneChange}
            phoneError={errors.phone}
            passwordValue={loginPassword}
            onPasswordChange={e => setPassword(e.target.value)}
            passwordError={errors.password}
            showPasswordToggle={true}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword(prev => !prev)}
            onSubmit={handleLogin}
            buttonText="로그인"
            bottomText={
              <>
                아직 계정이 없으신가요?{' '}
                <Link
                  to="/managers/auth/signup"
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  회원가입
                </Link>
              </>
            }
            googleRole="managers"
          />
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
