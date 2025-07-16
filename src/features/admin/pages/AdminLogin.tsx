import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/shared/utils/login'
import { formatPhoneNumber } from '@/shared/utils/format'
import { isValidPhone } from '@/shared/utils/validation'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import { LoginCard } from '@/shared/components/ui/LoginCard'
import { FeatureCard } from '@/shared/components/ui/FeatureCard'

export const AdminLogin = () => {
  const [loginPhone, setPhone] = useState('')
  const [loginPassword, setPassword] = useState('')
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: ''
  })
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({})
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
    if (!loginPassword.trim()) {
      newErrors.password = '비밀번호를 입력하세요.'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    try {
      await login('ADMIN', loginPhone, loginPassword)
      navigate('/admin')
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
            title="관리자 주요 기능"
            features={[
              {
                title: '계정/권한 관리',
                desc: '관리자 계정 추가, 수정, 삭제 및 권한 관리',
                detail: '💡 관리자 계정을 추가/수정/삭제하고, 권한을 부여하거나 회수할 수 있습니다.'
              },
              {
                title: '고객/매니저 정보 관리',
                desc: '고객·매니저 정보, 계약, 평가, 예약 현황 관리',
                detail: '💡 고객과 매니저의 상세 정보, 계약 현황, 평가, 예약 내역을 한눈에 관리할 수 있습니다.'
              },
              {
                title: '문의/예약/배너/공지 관리',
                desc: '문의, 예약, 배너, 공지/이벤트 게시글 관리',
                detail: '💡 고객 문의에 답변하고, 예약 내역, 배너, 공지/이벤트 게시글을 효율적으로 관리할 수 있습니다.'
              }
            ]}
          />
          {/* 로그인 카드 */}
          <LoginCard
            title1="HaloCare"
            title2="관리자 포털"
            subtitle="HaloCare 운영을 위한 관리자 전용 공간입니다."
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
                관리자 계정이 없으신가요? <br /> 담당자에게 문의하세요.
              </>
            }
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
