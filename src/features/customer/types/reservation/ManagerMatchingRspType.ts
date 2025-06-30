export interface ManagerMatchingRspType {
  managerId: number;
  managerName: string;
  averageRating: number;
  reviewCount: number;
  profileImageId: number;
  bio: string;
  feedbackType: 'GOOD' | 'BAD' | null; // enum 값에 맞게 조정
  recentReservationDate: string; // ISO 날짜 문자열
  reservationCount: number;
}
