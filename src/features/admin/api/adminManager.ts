import api from '@/services/axios'
import qs from 'qs'
import type { AdminManagerReview } from '@/features/admin/types/AdminManagerType'

// 전체 매니저 목록 조회
export const fetchAdminManagers = async (params?: {
  userName?: string
  phone?: string
  email?: string
  status?: string
  minRating?: number
  maxRating?: number
  page?: number
  size?: number
  excludeStatus?: string[]
  contractStatus?: string | string[]
}) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([, value]) => value !== undefined && value !== ''
    )
  )
  const res = await api.get('/admin/managers', {
    params: cleanedParams,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
  })
  if (!res.data.success)
    throw new Error(res.data.message || '매니저 목록 조회에 실패했습니다.')
  return res.data.body
}

// 단일 매니저 상세 조회
export const fetchAdminManagerById = async (managerId: string | number) => {
  const res = await api.get(`/admin/managers/${managerId}`);
  if (!res.data.success)
    throw new Error(res.data.message || '매니저 상세 조회에 실패했습니다.')
  return res.data.body
}

// 매니저 승인
export const approveManager = async (managerId: number) => {
  const res = await api.patch(`/admin/managers/applies/${managerId}`, {
    status: 'ACTIVE'
  })
  if (!res.data.success)
    throw new Error(res.data.message || '매니저 승인에 실패했습니다.')
  return res.data.body
}

// 매니저 거절
export const rejectManager = async (managerId: number) => {
  const res = await api.patch(`/admin/managers/applies/${managerId}`, {
    status: 'REJECTED'
  })
  if (!res.data.success)
    throw new Error(res.data.message || '매니저 거절에 실패했습니다.')
  return res.data.body
}

// 계약해지대기 승인
export const approveTerminateManager = async (managerId: number) => {
  const res = await api.patch(`/admin/managers/terminate/${managerId}`)
  if (!res.data.success)
    throw new Error(res.data.message || '계약해지 승인에 실패했습니다.')
  return res.data.body
}

// 매니저 리뷰 목록 조회
export const fetchAdminManagerReviews = async (
  managerId: number | string,
  params?: Record<string, string | number>
): Promise<{ content: AdminManagerReview[]; page?: Record<string, any> }> => {
  const res = await api.get(`/admin/reviews/${managerId}`, { params })
  if (!res.data.success)
    throw new Error(res.data.message || '매니저 리뷰 조회에 실패했습니다.')
  return res.data.body
}
