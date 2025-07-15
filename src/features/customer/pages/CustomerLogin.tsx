import { useState, Fragment, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { login } from '@/shared/utils/login'
import { isValidPhone, isValidPassword } from '@/shared/utils/validation'
import { formatPhoneNumber } from '@/shared/utils/format'
import { FeatureCard } from '@/shared/components/ui/FeatureCard'
import { LoginCard } from '@/shared/components/ui/LoginCard'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'

export const CustomerLogin = () => {
  const [loginPhone, setPhone] = useState('')
  const [loginPassword, setPassword] = useState('')
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({})
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [showSuccess, setShowSuccess] = useState(
    location.state?.signupSuccess ?? false
  )

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  // 사용자의 전화번호 입력값을 하이픈 포함 형식으로 자동 포맷하는 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value))
    setErrors(prev => ({ ...prev, phone: undefined }))
  }

  // 수요자 로그인
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
    setLoading(true)
    try {
      await login('CUSTOMER', loginPhone, loginPassword)
      navigate('/')
    } catch (err) {
      setToast({
        open: true,
        message: (err as { message?: string })?.message || '로그인 실패'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fragment>
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-2 py-8">
        <div className="flex w-full max-w-4xl flex-col-reverse items-center gap-8 md:flex-row md:gap-12">
          <FeatureCard
            icon={<>★</>}
            title="고객 주요 기능"
            features={[
              {
                title: '간편 예약',
                desc: '원하는 서비스 빠른 예약',
                detail: '💡 원하는 날짜와 시간에 맞춰 간편하게 서비스 예약이 가능합니다.'
              },
              {
                title: '실시간 문의',
                desc: '궁금한 점 바로 문의',
                detail: '💡 서비스 이용 중 궁금한 점을 실시간으로 문의하고 답변받을 수 있습니다.'
              },
              {
                title: '리뷰 및 평가',
                desc: '이용 경험 공유',
                detail: '💡 서비스 이용 후 리뷰를 남기고 별점을 매길 수 있습니다.'
              }
            ]}
          />
          <LoginCard
            title1="HaloCare"
            subtitle="HaloCare 서비스를 이용하려면 로그인해주세요."
            phoneValue={loginPhone}
            onPhoneChange={handlePhoneChange}
            phoneError={errors.phone}
            passwordValue={loginPassword}
            onPasswordChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            passwordError={errors.password}
            showPasswordToggle={true}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword(prev => !prev)}
            onSubmit={handleLogin}
            loading={loading}
            bottomText={
              <>
                아직 계정이 없으신가요?{' '}
                <Link
                  to="/auth/signup"
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  회원가입
                </Link>
              </>
            }
            googleRole="customers"
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
