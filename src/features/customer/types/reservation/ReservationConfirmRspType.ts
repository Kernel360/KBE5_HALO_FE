import type { ServiceCategoryTreeType } from '@/features/customer/types/reservation/ServiceCategoryTreeType'

export interface ReservationConfirmRspType {
  reservationId: number
  managerName: string
  reservationStatus: string
  serviceName: string
  requestDate: string
  startTime: string
  turnaround: number
  roadAddress: string
  detailAddress: string
  extraServices: ServiceCategoryTreeType
  price: number
}
