
import type { ManagerMatchingRspType } from '@/features/customer/types/CustomerReservationType';

export interface ReservationMatchedRspType {
  reservation: ReservationRspType;
  requestCategory: ServiceCategoryTreeType;
  matchedManagers: ManagerMatchingRspType[];
}
