import { useAuthStore } from '@/store/useAuthStore'
import { useUserStore } from '@/store/useUserStore'
import { logoutCustomer } from '@/features/customer/api/customerAuth'
import { logoutManager } from '@/features/manager/api/managerAuth'
import { logoutAdmin } from '@/features/admin/api/adminAuth'

export const logout = async () => {
  const handleLogoutResponse = (res: any) => {
    if (!res.data.success) {
      if (res.data.message?.trim()) alert(res.data.message)
      throw new Error(res.data.message || '로그아웃에 실패했습니다.')
    }
    return res.data.message
  }

  const role = useAuthStore.getState().role

  try {
    switch (role) {
      case 'CUSTOMER': {
        const res = await logoutCustomer()
        handleLogoutResponse(res)
        break
      }
      case 'MANAGER': {
        const res = await logoutManager()
        handleLogoutResponse(res)
        break
      }
      case 'ADMIN': {
        const res = await logoutAdmin()
        handleLogoutResponse(res)
        break
      }
      default:
        throw new Error('알 수 없는 사용자 역할')
    }
  } catch (err) {
    console.warn('catch 진입', err)
    console.warn('서버 로그아웃 실패 (무시하고 클라이언트 초기화 진행)', err)
  } finally {
    useAuthStore.getState().clearTokens()
    useUserStore.getState().clearUser()
  }
}
