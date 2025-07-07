import api from '@/services/axios'
import type { ServiceCategoryTreeType } from "@/features/customer/types/reservation/ServiceCategoryTreeType";

// 매니저 정보 조회
export const getManager = async () => {
  const res = await api.get('/managers/auth/my')

  if (!res.data.success) {
    // 성공 여부 수동 체크 후 에러 던지기
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '매니저 정보 조회에 실패했습니다.')
  }

  return res.data.body
}

// 매니저 정보 수정
export const updateManager = async (requestBody: any) => {
  const res = await api.patch('/managers/auth/my', requestBody)

  if (!res.data.success) {
    // 성공 여부 수동 체크 후 에러 던지기
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '매니저 정보 수정에 실패했습니다.')
  }

  return res.data.body
}

// 계약 해지 요청
export const requestTermination = async (terminationReason: string) => {
  const res = await api.patch('/managers/auth/my/request-termination', {
    terminationReason
  })

  if (!res.data.success) {
    // 성공 여부 수동 체크 후 에러 던지기
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '매니저 계약 해지 요청에 실패했습니다.')
  }

  return res.data.body
}

// 서비스 카테고리 조회 (공통)
export const getServiceCategories = async (): Promise<ServiceCategoryTreeType[]> => {
  const res = await api.get('/common/serviceCategory')
  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '서비스 카테고리 조회에 실패했습니다.')
  }
  return res.data.body
}
