import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAdminCustomerById,
  deleteAdminCustomer,
} from "../../api/adminCustomer";
import type { AdminCustomer } from "../../types/AdminCustomerType";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import AccountStatusBadge from "@/shared/components/ui/AccountStatusBadge";
import { Button } from "@/shared/components/ui/Button";
import { Label } from "@/shared/components/ui/Label";
import { Card } from "@/shared/components/ui/Card";
import Loading from "@/shared/components/ui/Loading";
import Toast from "@/shared/components/ui/toast/Toast";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";
import SuccessToast from "@/shared/components/ui/toast/SuccessToast";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

export const AdminCustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<AdminCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Toast 상태
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  // 고객 정보 조회
  useEffect(() => {
    if (!customerId) {
      setErrorToastMsg("고객 ID가 없습니다.");
      return;
    }

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminCustomerById(customerId);

        const mappedCustomer: AdminCustomer = {
          id: data.customerId,
          name: data.userName,
          phone: data.phone,
          email: data.email,
          status:
            data.accountStatus === "ACTIVE"
              ? "활성"
              : data.accountStatus === "DELETED"
                ? "비활성"
                : data.accountStatus === "REPORTED"
                  ? "신고됨"
                  : "활성",
          count: data.count,
          gender: data.gender,
          birthDate: data.birthDate,
          roadAddress: data.roadAddress,
          detailAddress: data.detailAddress,
          latitude: data.latitude,
          longitude: data.longitude,
          point: data.point,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        setCustomer(mappedCustomer);
      } catch (e: any) {
        const errorMsg = e?.response?.data?.message || e?.message;
        setErrorToastMsg(errorMsg || "고객 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  // 삭제 확인
  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  // 삭제 실행
  const handleDelete = async () => {
    if (!customerId) return;

    try {
      await deleteAdminCustomer(customerId);
      setSuccessToastMsg("고객이 성공적으로 삭제되었습니다.");
      setTimeout(() => {
        navigate("/admin/customers");
      }, 1000);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || e?.message;
      setErrorToastMsg(errorMsg || "삭제에 실패했습니다.");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen">
        <Loading
          message="고객 정보를 불러오는 중..."
          size="lg"
          className="h-full"
        />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg text-red-500">
          고객 정보를 찾을 수 없습니다.
        </div>
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
        <AdminPageHeader title={`고객 상세 정보 - ${customer.name}님`} />

        <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-6">
          {/* 액션 버튼들 */}
          <div className="w-full flex justify-between items-center">
            <Button
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              onClick={() => navigate("/admin/customers")}
            >
              ← 목록으로
            </Button>

            <div className="flex gap-2">
              <Button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                삭제
              </Button>
            </div>
          </div>

          {/* 기본 정보 */}
          <Card className="w-full bg-white border rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                <AccountStatusBadge
                  status={
                    customer.status === "활성"
                      ? "ACTIVE"
                      : customer.status === "비활성"
                        ? "SUSPENDED"
                        : customer.status
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름</Label>
                  <div className="p-2 bg-gray-50 rounded">{customer.name}</div>
                </div>

                <div>
                  <Label htmlFor="phone">연락처</Label>
                  <div className="p-2 bg-gray-50 rounded">{customer.phone}</div>
                </div>

                <div>
                  <Label htmlFor="email">이메일</Label>
                  <div className="p-2 bg-gray-50 rounded">{customer.email}</div>
                </div>

                <div>
                  <Label htmlFor="gender">성별</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {customer.gender === "MALE"
                      ? "남성"
                      : customer.gender === "FEMALE"
                        ? "여성"
                        : customer.gender}
                  </div>
                </div>

                <div>
                  <Label htmlFor="birthDate">생년월일</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {customer.birthDate}
                  </div>
                </div>

                <div>
                  <Label htmlFor="point">포인트</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {customer.point.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 주소 정보 */}
          <Card className="w-full bg-white border rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">주소 정보</h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="roadAddress">도로명 주소</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {customer.roadAddress}
                  </div>
                </div>

                <div>
                  <Label htmlFor="detailAddress">상세 주소</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {customer.detailAddress}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">위도</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {customer.latitude}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="longitude">경도</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {customer.longitude}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 시스템 정보 */}
          <Card className="w-full bg-white border rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">시스템 정보</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>등록일</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {new Date(customer.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <Label>최종 수정일</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {new Date(customer.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        message={`정말로 ${customer.name}님의 정보를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
      />
    </>
  );
};
