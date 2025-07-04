import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAdminReservationById } from "../../api/adminReservation";
import type { AdminReservation } from "../../types/AdminReservationType";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import { Button } from "@/shared/components/ui/Button";
import { Label } from "@/shared/components/ui/Label";
import { Card } from "@/shared/components/ui/Card";
import Loading from "@/shared/components/ui/Loading";
import Toast from "@/shared/components/ui/toast/Toast";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import SuccessToast from "@/shared/components/ui/toast/SuccessToast";

export const AdminReservationDetail = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<AdminReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!reservationId) {
      setErrorToastMsg("예약 ID가 없습니다.");
      return;
    }

    const fetchReservation = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminReservationById(reservationId);
        
        const mappedReservation: AdminReservation = {
          id: data.reservationId,
          customerId: data.customerId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          managerId: data.managerId,
          managerName: data.managerName,
          managerPhone: data.managerPhone,
          serviceDate: data.serviceDate,
          serviceTime: data.serviceTime,
          serviceDuration: data.serviceDuration,
          serviceCategory: data.serviceCategory,
          serviceSubCategory: data.serviceSubCategory,
          roadAddress: data.roadAddress,
          detailAddress: data.detailAddress,
          latitude: data.latitude,
          longitude: data.longitude,
          totalAmount: data.totalAmount,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount,
          reservationStatus: data.reservationStatus,
          paymentStatus: data.paymentStatus,
          specialRequests: data.specialRequests,
          notes: data.notes,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        setReservation(mappedReservation);
      } catch (e: any) {
        const errorMsg = e?.response?.data?.message || e?.message;
        setErrorToastMsg(errorMsg || "예약 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  if (loading) {
    return (
      <div className="w-full h-screen">
        <Loading message="예약 정보를 불러오는 중..." size="lg" className="h-full" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg text-red-500">예약 정보를 찾을 수 없습니다.</div>
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
        <AdminPageHeader title={`예약 상세 정보 - ${reservation.customerName}님`} />

        <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
          <div className="w-full flex justify-between items-center">
            <Button
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              onClick={() => navigate("/admin/reservations")}
            >
              ← 목록으로
            </Button>
          </div>

          <Card className="w-full bg-white border rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">예약 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">고객명</Label>
                  <div className="p-2 bg-gray-50 rounded">{reservation.customerName}</div>
                </div>
                <div>
                  <Label htmlFor="managerName">관리사명</Label>
                  <div className="p-2 bg-gray-50 rounded">{reservation.managerName}</div>
                </div>
                <div>
                  <Label htmlFor="serviceDate">서비스 날짜</Label>
                  <div className="p-2 bg-gray-50 rounded">{reservation.serviceDate}</div>
                </div>
                <div>
                  <Label htmlFor="serviceTime">서비스 시간</Label>
                  <div className="p-2 bg-gray-50 rounded">{reservation.serviceTime}</div>
                </div>
                <div>
                  <Label htmlFor="serviceCategory">서비스 카테고리</Label>
                  <div className="p-2 bg-gray-50 rounded">{reservation.serviceCategory}</div>
                </div>
                <div>
                  <Label htmlFor="finalAmount">최종 금액</Label>
                  <div className="p-2 bg-gray-50 rounded">{reservation.finalAmount.toLocaleString()}원</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
