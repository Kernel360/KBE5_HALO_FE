import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { googleOAuthLogin } from '@/shared/utils/googleOAuth'
import { useAuthStore } from '@/store/useAuthStore'
import { useUserStore } from '@/store/useUserStore'

const OAuthProgressPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // OAuth 진행 상태 관리: pending(진행중), success(성공), error(실패)
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending'
  )

  // 경로에서 role 추출 (예: /customer/oauth/success, /manager/oauth/success)
  const role = location.pathname.startsWith('/managers')
    ? 'manager'
    : 'customer'

  // 쿼리 파라미터에서 code, error 등 추출
  const searchParams = new URLSearchParams(location.search)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  useEffect(() => {
    // 에러 쿼리 감지 시 실패 처리 및 실패 페이지 이동
    if (error) {
      setStatus('error')
      navigate(`/oauth-fail?role=${role}`)
      return
    }
    // code가 없으면 실패 처리 및 실패 페이지 이동
    if (!code) {
      setStatus('error')
      navigate(`/oauth-fail?role=${role}`)
      return
    }
    setStatus('pending')
    // 구글 OAuth 로그인 API 호출
    googleOAuthLogin(role, code)
      .then(res => {
        const data = res.data || {}
        const isNew = !!data.new // 신규 가입자인지 여부
        if (!isNew) {
          // accessToken: 헤더에서 추출
          const rawHeader = res.headers['authorization']
          const accessToken = rawHeader?.replace('Bearer ', '').trim()
          // user 정보
          const userName = data.userName || ''
          const email = data.email || ''
          const statusValue = data.status || ''
          // provider, providerId 추가 (백엔드에서 전달 시)
          const provider = data.provider || ''
          const providerId = data.providerId || ''
          // zustand 전역 상태에 토큰 및 유저 정보 저장
          const roleUpper = role === 'manager' ? 'MANAGER' : 'CUSTOMER'
          useAuthStore
            .getState()
            .setTokens(accessToken, roleUpper)
          useUserStore
            .getState()
            .setUser(email, userName, statusValue, provider, providerId)
        }
        setStatus('success')
        // SuccessPage로 이동 시 isNew도 쿼리로 넘김
        const userName = data.userName || ''
        const email = data.email || ''
        const statusValue = data.status || ''
        const password = data.password || ''
        // provider, providerId 추가 (백엔드에서 전달 시)
        const provider = data.provider || ''
        const providerId = data.providerId || ''
        setTimeout(() => {
          // 성공 페이지로 이동 (필요 정보 쿼리로 전달)
          navigate(
            `/oauth-success?role=${role}` +
              `&isNew=${isNew ? 'true' : 'false'}` +
              `&name=${encodeURIComponent(userName)}` +
              `&email=${encodeURIComponent(email)}` +
              `&status=${encodeURIComponent(statusValue)}` +
              `&password=${encodeURIComponent(password)}` +
              `&provider=${encodeURIComponent(provider)}` +
              `&providerId=${encodeURIComponent(providerId)}`
          )
        }, 100)
      })
      .catch(() => {
        // 로그인 실패 시 실패 페이지로 이동
        setStatus('error')
        navigate(`/oauth-fail?role=${role}`)
      })
  }, [code, error, navigate, role])

  // 진행중이 아니면 아무것도 렌더링하지 않음
  if (status !== 'pending') return null

  // 진행중 UI 렌더링
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