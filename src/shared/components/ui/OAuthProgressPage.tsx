import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { googleOAuthLogin } from '@/shared/utils/googleOAuth'
import { useAuthStore } from '@/store/useAuthStore'
import { useUserStore } from '@/store/useUserStore'

const logToLocalStorage = (message: string, data?: unknown) => {
  const prev = localStorage.getItem('debug-logs')
  const logs = prev ? JSON.parse(prev) : []
  logs.push({
    time: new Date().toISOString(),
    message,
    data
  })
  localStorage.setItem('debug-logs', JSON.stringify(logs))
}

const OAuthProgressPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending'
  )

  // 경로에서 role 추출 (예: /customer/oauth/success, /manager/oauth/success)
  const role = location.pathname.startsWith('/managers')
    ? 'managers'
    : 'customers'

  // 쿼리 파라미터에서 code, error 등 추출
  const searchParams = new URLSearchParams(location.search)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  useEffect(() => {
    logToLocalStorage('OAuthProgressPage useEffect 진입', {
      code,
      error,
      role
    })
    if (error) {
      logToLocalStorage('OAuthProgressPage: error 쿼리 감지', error)
      setStatus('error')
      navigate(`/oauth-fail?role=${role}`)
      return
    }
    if (!code) {
      logToLocalStorage('OAuthProgressPage: code 없음', null)
      setStatus('error')
      navigate(`/oauth-fail?role=${role}`)
      return
    }
    setStatus('pending')
    logToLocalStorage('OAuthProgressPage: googleOAuthLogin 호출', {
      role,
      code
    })
    googleOAuthLogin(role, code)
      .then(res => {
        logToLocalStorage('OAuthProgressPage: googleOAuthLogin 성공', res)
        const data = res.data || {}
        const isNew = !!data.new
        console.log('isNew', isNew)
        if (!isNew) {
          // accessToken: 헤더에서 추출
          const rawHeader = res.headers['authorization']
          const accessToken = rawHeader?.replace('Bearer ', '').trim()
          // user 정보
          const userName = data.userName || ''
          const email = data.email || ''
          const statusValue = data.status || ''
          logToLocalStorage('OAuthProgressPage: zustand 저장 직전', {
            accessToken,
            userName,
            email,
            statusValue
          })
          // zustand 저장
          const roleUpper = role === 'managers' ? 'MANAGER' : 'CUSTOMER'
          useAuthStore.getState().setTokens(accessToken, roleUpper)
          useUserStore.getState().setUser(email, userName, statusValue)
          logToLocalStorage('OAuthProgressPage: zustand 저장 완료', {
            auth: useAuthStore.getState(),
            user: useUserStore.getState()
          })
        }
        setStatus('success')
        // SuccessPage로 이동 시 isNew도 쿼리로 넘김
        const userName = data.userName || ''
        const email = data.email || ''
        const statusValue = data.status || ''
        const password = data.password || ''
        setTimeout(() => {
          logToLocalStorage('OAuthProgressPage: navigate to success', {
            role,
            isNew,
            userName,
            email,
            statusValue,
            password
          })
          navigate(
            `/oauth-success?role=${role}&isNew=${isNew ? 'true' : 'false'}&name=${encodeURIComponent(userName)}&email=${encodeURIComponent(email)}&status=${encodeURIComponent(statusValue)}&password=${encodeURIComponent(password)}`
          )
        }, 100)
      })
      .catch(err => {
        logToLocalStorage('OAuthProgressPage: googleOAuthLogin 실패', err)
        setStatus('error')
        navigate(`/oauth-fail?role=${role}`)
      })
  }, [code, error, navigate, role])

  if (status !== 'pending') return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-indigo-600">
          OAuth 로그인 진행 중
        </h2>
        <p>구글 인증 정보를 처리하고 있습니다...</p>
      </div>
    </div>
  )
}

export default OAuthProgressPage 