import api from '@/services/axios'
import type { CustomerProfile, CustomerReservationHistory, CustomerStatistics } from '../types/CustomerProfileType'

// 고객 프로필 조회
export const getCustomerProfile = async (customerId: number): Promise<CustomerProfile> => {
  const res = await api.get(`/managers/customers/${customerId}/profile`)
  
  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '고객 프로필 조회에 실패했습니다.')
  }
  
  return res.data.body
}

// 고객 예약 히스토리 조회
export const getCustomerReservationHistory = async (customerId: number): Promise<CustomerReservationHistory[]> => {
  const res = await api.get(`/managers/customers/${customerId}/reservations`)
  
  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '고객 예약 히스토리 조회에 실패했습니다.')
  }
  
  return res.data.body
}

// 고객 통계 조회
export const getCustomerStatistics = async (customerId: number): Promise<CustomerStatistics> => {
  const res = await api.get(`/managers/customers/${customerId}/statistics`)
  
  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '고객 통계 조회에 실패했습니다.')
  }
  
  return res.data.body
}

// 고객 메모 추가
export const addCustomerNote = async (customerId: number, note: string) => {
  const res = await api.post(`/managers/customers/${customerId}/notes`, { note })
  
  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '고객 메모 추가에 실패했습니다.')
  }
  
  return res.data.body
}

// 고객 등급 업데이트
export const updateCustomerGrade = async (customerId: number, grade: string) => {
  const res = await api.patch(`/managers/customers/${customerId}/grade`, { grade })
  
  if (!res.data.success) {
    if (res.data.message?.trim()) alert(res.data.message)
    throw new Error(res.data.message || '고객 등급 업데이트에 실패했습니다.')
  }
  
  return res.data.body
} 