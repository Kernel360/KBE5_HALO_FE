// 매니저 정산 조회
export interface ManagerPayments {
  reservationId: number,
  customerName: string,
  requestDate: string,
  reservationTime: string,
  turnaround: number,
  serviceName: string,
  price: number,
  extraPrice: number,
  totalPrice: number,
  commission: number,
  settlementAmount: number,
  extraServices?: [
    {
      extraServiceId?: number,
      extraServiceName?: string,
      extraPrice?: number
    }
  ]
}