import React, { useEffect, useState } from 'react';
import type { CustomerDetailInfoType } from '../types/CustomerInfoType';
import { getCustomerInfo } from '../api/customerAuth';
import { User, MapPin } from 'lucide-react';
import { PointChargingModal } from '@/features/customer/modal/PointChargingModal';
import SuccessToast from '@/shared/components/ui/toast/SuccessToast';

const genderDisplayMap = {
  MALE: '남',
  FEMALE: '여',
} as const;

export const CustomerMyInfo: React.FC = () => {
  const [info, setInfo] = useState<CustomerDetailInfoType | null>(null);
  const [isChargingModalOpen, setIsChargingModalOpen] = useState(false);
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const res = await getCustomerInfo();
        setInfo({
          ...res.body,
          gender: genderDisplayMap[res.body.gender as keyof typeof genderDisplayMap],
          point: res.body.point,
        });
      } catch (error) {
        alert('회원 정보를 불러오지 못했습니다.');
      }
    };
    fetchCustomerInfo();
  }, []);

  const handleChargingSuccess = (chargedAmount: number) => {
    // 충전 성공 후 포인트 정보 새로고침
    const fetchUpdatedInfo = async () => {
      try {
        const res = await getCustomerInfo();
        setInfo({
          ...res.body,
          gender: genderDisplayMap[res.body.gender as keyof typeof genderDisplayMap],
          point: res.body.point,
        });
        
        // 성공 토스트 표시
        setSuccessToastMsg(`${chargedAmount.toLocaleString()}P가 충전되었습니다.`);
      } catch (error) {
        console.error('포인트 정보 새로고침 실패:', error);
      }
    };
    fetchUpdatedInfo();
  };


  if (!info) return <div>로딩 중...</div>;

  return (
    <main className="w-full bg-white py-6">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-zinc-800">회원 정보</h2>

        {/* 기본 정보 */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-zinc-800">회원 정보</h3>
          </div>
          <div className="flex gap-8">
            {/* 왼쪽: 이름, 연락처 */}
            <div className="flex-1 space-y-4">
              <div className="w-full">
                <label className="text-sm font-medium text-zinc-700">이름 (한글)</label>
                <input name="userName" className="input" value={info.userName} disabled />
              </div>
              <div className="w-full">
                <label className="text-sm font-medium text-zinc-700">연락처</label>
                <input name="phone" className="input" value={info.phone} disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">이메일</label>
                <input name="email" className="input bg-gray-100" value={info.email} disabled />
              </div>
            </div>

            {/* 오른쪽: 생년월일, 성별, 포인트 */}
            <div className="flex-1 space-y-4">
              <div className="w-full">
                <label className="text-sm font-medium text-zinc-700">생년월일</label>
                <input type="date" name="birthDate" className="input" value={info.birthDate} disabled />
              </div>
              <div className="w-full">
                <label className="text-sm font-medium text-zinc-700">성별</label>
                <input name="gender" className="input" value={info.gender} disabled />
              </div>
              <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-bold text-indigo-600">포인트</label>
                <button 
                  onClick={() => setIsChargingModalOpen(true)}
                  className="px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded hover:bg-indigo-600 transition-colors"
                >
                  충전
                </button>
              </div>
              <input
                name="point"
                className="input bg-gray-100"
                value={`${info.point.toLocaleString()} P`}
                disabled
              />
            </div>
            </div>
          </div>
        </div>

        {/* 주소 정보 */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-zinc-800">주소</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700">도로명 주소</label>
              <input name="roadAddress" className="input" value={info.roadAddress} disabled />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">상세 주소</label>
              <input name="detailAddress" className="input" value={info.detailAddress} disabled />
            </div>
          </div>
        </div>
      </div>
      
      {/* 포인트 충전 모달 */}
      {info && (
        <PointChargingModal
          isOpen={isChargingModalOpen}
          onClose={() => setIsChargingModalOpen(false)}
          currentPoints={info.point}
          onSuccess={handleChargingSuccess}
        />
      )}
      
      {/* 성공 토스트 */}
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ""}
        onClose={() => setSuccessToastMsg(null)}
      />
    </main>
  );
};