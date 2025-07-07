import React from "react";
import Modal from "@/shared/components/ui/modal/Modal";
import { Button } from "@/shared/components/ui/Button";

interface ManagerRejectModalProps {
  open: boolean;
  onClose: () => void;
  onReject: () => void;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
}

const ManagerRejectModal: React.FC<ManagerRejectModalProps> = ({
  open,
  onClose,
  onReject,
  rejectReason,
  setRejectReason,
}) => (
  <Modal open={open} onClose={onClose}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-5 h-5 text-red-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-800">예약 거절 사유</h2>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        거절 사유를 입력해주세요
      </label>
      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        placeholder="예: 해당 시간에 다른 예약이 있어 서비스 제공이 어렵습니다."
        className="w-full h-32 p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
        rows={4}
      />
    </div>
    <div className="flex justify-end gap-3">
      <Button
        onClick={() => {
          onClose();
          setRejectReason("");
        }}
        className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
      >
        취소
      </Button>
      <Button
        onClick={onReject}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        거절하기
      </Button>
    </div>
  </Modal>
);

export default ManagerRejectModal; 