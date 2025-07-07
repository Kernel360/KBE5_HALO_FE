import React, { useState } from "react";
import { X } from "lucide-react";
import { chargePoints } from "@/features/customer/api/customerAuth";
import ErrorToast from "@/shared/components/ui/toast/ErrorToast";

interface PointChargingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoints: number;
  onSuccess: (chargedAmount: number) => void; // 충전 성공 후 포인트 새로고침용 (충전 금액 전달)
}

export const PointChargingModal: React.FC<PointChargingModalProps> = ({
  isOpen,
  onClose,
  currentPoints,
  onSuccess
}) => {
  const [chargeAmount, setChargeAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Toast 상태 관리 (에러 토스트만 사용)
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);

  // 최대 충전 가능 금액 (1,000,000 - 현재 포인트)
  const maxChargeAmount = 1000000 - currentPoints;


  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    
    // 충전 가능 금액을 초과하는 경우 입력 제한
    if (numValue > maxChargeAmount) {
      // 충전 가능 금액으로 제한
      const limitedValue = maxChargeAmount.toString();
      setCustomAmount(limitedValue);
      setChargeAmount(maxChargeAmount);
    } else {
      setCustomAmount(value);
      setChargeAmount(numValue);
    }
    
    setIsCustomInput(true);
  };

  const handleSubmit = async () => {
    setAttemptedSubmit(true);

    // 유효성 검사
    if (chargeAmount <= 0) {
      setErrorToastMsg("충전 금액을 선택해주세요.");
      return;
    }

    if (chargeAmount > maxChargeAmount) {
      setErrorToastMsg(`최대 ${maxChargeAmount.toLocaleString()}P까지 충전 가능합니다.`);
      return;
    }

    if (chargeAmount < 1000) {
      setErrorToastMsg("최소 1,000P 이상 충전해주세요.");
      return;
    }

    setLoading(true);

    try {
      await chargePoints({ point: chargeAmount });
      
      // 성공 후 즉시 처리
      onSuccess(chargeAmount); // 포인트 새로고침 및 성공 토스트 표시
      handleClose(); // 모달 즉시 닫기
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "충전 중 오류가 발생했습니다.";
      setErrorToastMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setChargeAmount(0);
    setCustomAmount("");
    setIsCustomInput(false);
    setAttemptedSubmit(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl w-[400px] overflow-hidden border border-indigo-300">        
            {/* Header */}
          <div className="bg-[#6366F1] text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">포인트 충전</h2>
            <button onClick={handleClose} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* 현재 포인트 정보 */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm text-gray-500 mb-1">현재 포인트</div>
                <div className="text-xl font-bold text-gray-900">{currentPoints.toLocaleString()} P</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">충전 가능 금액</div>
                <div className="text-lg font-semibold text-indigo-600">{maxChargeAmount.toLocaleString()} P</div>
              </div>
            </div>

            {/* 충전 금액 선택 */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-3">충전할 포인트를 선택해주세요</div>

              {/* 직접 입력 */}
              <div className="mb-4">
                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder={`직접 입력 (최대: ${maxChargeAmount.toLocaleString()}P)`}
                  className={`w-full p-3 border rounded-xl text-sm ${
                    isCustomInput && chargeAmount > 0
                      ? chargeAmount > maxChargeAmount
                        ? "border-red-500 bg-red-50"
                        : "border-indigo-500 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                />
                {isCustomInput && chargeAmount > maxChargeAmount && (
                  <div className="text-red-500 text-xs mt-1">
                    최대 {maxChargeAmount.toLocaleString()}P까지 충전 가능합니다.
                  </div>
                )}
              </div>

              {/* 충전 후 예상 포인트 - 항상 표시 */}
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="text-sm text-indigo-600 mb-1">충전 후 예상 포인트</div>
                <div className="text-lg font-bold text-indigo-600">
                  {(currentPoints + (chargeAmount || 0)).toLocaleString()} P
                </div>
              </div>

              {/* 에러 메시지 */}
              {attemptedSubmit && chargeAmount <= 0 && (
                <div className="text-red-500 text-xs mt-2">충전 금액을 선택해주세요.</div>
              )}
              
              {attemptedSubmit && chargeAmount > 0 && chargeAmount < 1000 && (
                <div className="text-red-500 text-xs mt-2">최소 1,000P 이상 충전해주세요.</div>
              )}
              
              {attemptedSubmit && chargeAmount > maxChargeAmount && (
                <div className="text-red-500 text-xs mt-2">최대 {maxChargeAmount.toLocaleString()}P까지 충전 가능합니다.</div>
              )}
            </div>

            {/* 안내사항 */}
            <div className="mb-6 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="text-xs text-yellow-800">
                • 최대 1,000,000P까지 보유 가능합니다.<br/>
                • 충전된 포인트는 환불이 불가능합니다.<br/>
                • 결제는 즉시 처리됩니다.
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl text-base hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || chargeAmount <= 0}
                className="flex-1 py-3 px-4 bg-[#6366F1] text-white rounded-xl text-base hover:bg-[#5558E3] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "충전 중..." : `${chargeAmount > 0 ? chargeAmount.toLocaleString() + "P " : ""}충전하기`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 에러 토스트만 표시 */}
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ""}
        onClose={() => setErrorToastMsg(null)}
      />
    </>
  );
};