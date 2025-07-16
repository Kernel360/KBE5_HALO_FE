import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const isNew = searchParams.get('isNew') === 'true'
  const role = (searchParams.get('role') || '').toUpperCase() as
    | 'CUSTOMER'
    | 'MANAGER'
    | null
  const name = searchParams.get('name') || ''
  const email = searchParams.get('email') || ''
  const password = searchParams.get('password') || ''
  const provider = searchParams.get('provider') || ''
  const providerId = searchParams.get('providerId') || ''
  // accessToken은 login 함수에서 처리됨

  const [count, setCount] = useState(3)

  console.log('role', role)

  useEffect(() => {
    if (!isNew) {
      // 기존 회원: 바로 메인(또는 매니저 메인)으로 이동
      if (role === 'CUSTOMER') {
        navigate('/')
      } else if (role === 'MANAGER') {
        navigate('/managers')
      } else {
        navigate('/')
      }
      return
    }
    if (count === 0) {
      handleNext()
      return
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, isNew, role, navigate])

  const handleNext = () => {
    if (role === 'CUSTOMER') {
      if (isNew) {
        navigate({
          pathname: '/auth/signup',
          search:
            `?name=${encodeURIComponent(name)}` +
            `&email=${encodeURIComponent(email)}` +
            `&password=${encodeURIComponent(password)}` +
            `&provider=${encodeURIComponent(provider)}` +
            `&providerId=${encodeURIComponent(providerId)}` +
            `&oauth=1`
        })
      } else {
        navigate('/')
      }
    } else if (role === 'MANAGER') {
      if (isNew) {
        navigate({
          pathname: '/managers/auth/signup',
          search:
            `?name=${encodeURIComponent(name)}` +
            `&email=${encodeURIComponent(email)}` +
            `&password=${encodeURIComponent(password)}` +
            `&provider=${encodeURIComponent(provider)}` +
            `&providerId=${encodeURIComponent(providerId)}` +
            `&oauth=1`
        })
      } else {
        navigate('/managers')
      }
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600">
            {isNew ? '추가 정보 입력이 필요합니다.' : '로그인 성공!'}
          </h2>
        </div>
        <p className="mb-2 font-medium text-gray-700">
          {isNew
            ? `${name}님, 회원가입 절차를 계속 진행해주세요.`
            : `${name}님, 환영합니다!`}
        </p>
        {isNew && (
          <>
            <p className="mb-4 text-sm text-gray-500">
              {count}초 뒤에 회원가입 페이지로 이동합니다.
            </p>
            <button
              className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-indigo-700"
              onClick={handleNext}
            >
              회원가입으로 이동
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default OAuthSuccessPage 