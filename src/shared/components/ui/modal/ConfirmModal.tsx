import React from "react";
import Modal from "./Modal";

interface ConfirmModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "확인",
  cancelLabel = "취소",
}) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="text-gray-800 text-base mb-6 text-center whitespace-pre-line">
        {message}
      </div>
      <div className="flex justify-center gap-4 w-full">
        <button
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
