import React from "react";
import Modal from "./Modal";

interface AlertModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
  confirmLabel?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  message,
  onClose,
  confirmLabel = "확인",
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-gray-800 text-base mb-6 text-center whitespace-pre-line">
        {message}
      </div>
      <div className="flex justify-center w-full">
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          onClick={onClose}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default AlertModal;
