import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminReservations } from "../../api/adminReservation";
import type { AdminReservation } from "../../types/AdminReservationType";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import Loading from "@/shared/components/ui/Loading";
import Toast from "@/shared/components/ui/toast/Toast";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import SuccessToast from "@/shared/components/ui/toast/SuccessToast";

export const AdminReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminReservations();
        
        const mappedReservations: AdminReservation[] = (data.content || []).map((reservation) => ({
          id: reservation.reservationId,
          customerId: reservation.customerId,
          customerName: reservation.customerName,
          customerPhone: reservation.customerPhone,
          customerEmail: reservation.customerEmail,
          managerId: reservation.managerId,
          managerName: reservation.managerName,
          managerPhone: reservation.managerPhone,
          serviceDate: reservation.serviceDate,
          serviceTime: reservation.serviceTime,
          serviceDuration: reservation.serviceDuration,
          serviceCategory: reservation.serviceCategory,
          serviceSubCategory: reservation.serviceSubCategory,
          roadAddress: reservation.roadAddress,
          detailAddress: reservation.detailAddress,
          latitude: reservation.latitude,
          longitude: reservation.longitude,
          totalAmount: reservation.totalAmount,
          discountAmount: reservation.discountAmount,
          finalAmount: reservation.finalAmount,
          reservationStatus: reservation.reservationStatus,
          paymentStatus: reservation.paymentStatus,
          specialRequests: reservation.specialRequests,
          notes: reservation.notes,
          createdAt: reservation.createdAt,
          updatedAt: reservation.updatedAt,
        }));

        setReservations(mappedReservations);
      } catch (error: unknown) {
        const errorMsg = error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "예약 목록을 불러오지 못했습니다.";
        setErrorToastMsg(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleRowClick = (reservation: AdminReservation) => {
    navigate(`/admin/reservations/${reservation.id}`);
  };

  if (loading) {
    return (
      <div className="w-full h-screen">
        <Loading message="예약 목록을 불러오는 중..." size="lg" className="h-full" />
      </div>
    );
  }

  return (
    <>
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ""}
        onClose={() => setSuccessToastMsg(null)}
      />
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ""}
        onClose={() => setErrorToastMsg(null)}
      />
      <Toast
        open={!!toastMsg}
        message={toastMsg || ""}
        onClose={() => setToastMsg(null)}
      />

      <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
        <AdminPageHeader title="예약 관리" />

        <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
          <div className="w-full bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">예약 목록</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">고객명</th>
                      <th className="text-left p-3">관리사명</th>
                      <th className="text-left p-3">서비스 날짜</th>
                      <th className="text-left p-3">서비스 시간</th>
                      <th className="text-left p-3">서비스 카테고리</th>
                      <th className="text-left p-3">예약 상태</th>
                      <th className="text-left p-3">결제 상태</th>
                      <th className="text-left p-3">최종 금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center p-8 text-gray-500">
                          예약 내역이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      reservations.map((reservation) => (
                        <tr
                          key={reservation.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleRowClick(reservation)}
                        >
                          <td className="p-3">{reservation.customerName}</td>
                          <td className="p-3">{reservation.managerName}</td>
                          <td className="p-3">{reservation.serviceDate}</td>
                          <td className="p-3">{reservation.serviceTime}</td>
                          <td className="p-3">{reservation.serviceCategory}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              reservation.reservationStatus === "완료"
                                ? "bg-green-100 text-green-800"
                                : reservation.reservationStatus === "취소"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}>
                              {reservation.reservationStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              reservation.paymentStatus === "결제완료"
                                ? "bg-green-100 text-green-800"
                                : reservation.paymentStatus === "결제실패"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {reservation.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">{reservation.finalAmount.toLocaleString()}원</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
