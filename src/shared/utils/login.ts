import { loginCustomer } from '@/features/customer/api/customerAuth'
import { loginManager } from '@/features/manager/api/managerAuth'
import { loginAdmin } from '@/features/admin/api/adminAuth'

import { useAuthStore } from '@/store/useAuthStore'
import { useUserStore } from '@/store/useUserStore'

type Role = 'CUSTOMER' | 'MANAGER' | 'ADMIN'

export const login = async (role: Role, phone: string, password: string) => {
  let res

  try {
    switch (role) {
      case 'CUSTOMER':
        res = await loginCustomer(phone, password)
        break
      case 'MANAGER':
        res = await loginManager(phone, password)
        break
      case 'ADMIN':
        res = await loginAdmin(phone, password)
        break
      default:
        throw new Error('알 수 없는 사용자 역할')
    }
  } catch (error: any) {
    console.error('Login error:', error) // 디버깅용 로그 추가

    // axios 에러 객체에서 서버가 내려준 message 꺼내기
    let serverMessage = '로그인에 실패했습니다.' // 기본 메시지

    if (error.response?.data) {
      // 백엔드에서 보내는 ErrorResponse 구조에 맞게 수정
      serverMessage =
        error.response.data.message ||
        error.response.data.body?.message ||
        serverMessage
    } else if (error.message) {
      serverMessage = error.message
    }

    throw new Error(serverMessage)
  }

  // 응답 헤더에서 값 추출 (헤더 이름은 소문자로)
  const rawHeader = res.headers['authorization']
  const accessToken = rawHeader?.replace('Bearer ', '').trim()
  const userName = res.data.body.userName
  const status = res.data.body.status
  console.log()

  if (!accessToken || !userName) {
    throw new Error('로그인 응답이 올바르지 않습니다.')
  }

  // 상태 저장
  useAuthStore.getState().setTokens(accessToken, role)
  useUserStore.getState().setUser(phone, userName, status)

  return { accessToken, userName }
}
