import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const OAuthFailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const error = searchParams.get('error')
  const message = searchParams.get('message')
  const role = searchParams.get('role') // 'customer' or 'manager'

  const [count, setCount] = useState(5)

  useEffect(() => {
    if (count === 0) {
      handleRetry()
      return
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count])

  const handleRetry = () => {
    if (role === 'customer') {
      navigate('/auth/login')
    } else if (role === 'manager') {
      navigate('/managers/auth/login')
    } else {
      navigate('/auth/login') // fallback: 무조건 고객 로그인 페이지로 이동
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600">
            로그인에 실패했습니다
          </h2>
        </div>
        <p className="mb-2 font-medium text-gray-700">
          {message || '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.'}
        </p>
        {error && (
          <p className="mb-4 text-xs text-gray-400">오류 코드: {error}</p>
        )}
        <p className="mb-4 text-sm text-gray-500">
          {count}초 뒤에 로그인 페이지로 돌아갑니다.
        </p>
        <button
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-indigo-700"
          onClick={handleRetry}
        >
          다시 로그인하기
        </button>
      </div>
    </div>
  )
}

export default OAuthFailPage 