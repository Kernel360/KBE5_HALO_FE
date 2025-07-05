import React from "react";
import Modal from "@/shared/components/ui/modal/Modal";
import { Button } from "@/shared/components/ui/Button";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface ManagerAcceptModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const ManagerAcceptModal: React.FC<ManagerAcceptModalProps> = ({
  open,
  onClose,
  onAccept,
}) => (
  <Modal open={open} onClose={onClose}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircleIcon className="w-5 h-5 text-green-600" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800">예약 수락 확인</h2>
    </div>
    <div className="mb-4">
      <p className="text-sm text-slate-700">해당 예약을 수락하시겠습니까?</p>
    </div>
    <div className="flex justify-end gap-3">
      <Button
        onClick={onClose}
        className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
      >
        취소
      </Button>
      <Button
        onClick={() => {
          onClose();
          onAccept();
        }}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
      >
        <CheckCircleIcon className="w-4 h-4" />
        수락하기
      </Button>
    </div>
  </Modal>
);

export default ManagerAcceptModal; 