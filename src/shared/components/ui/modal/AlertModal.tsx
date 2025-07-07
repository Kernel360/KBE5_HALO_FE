import React from 'react'
import Modal from './Modal'

interface AlertModalProps {
  open: boolean
  message: string
  onClose: () => void
  confirmLabel?: string
}

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  message,
  onClose,
  confirmLabel = '확인'
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}>
      <div className="mb-6 text-center text-base whitespace-pre-line text-gray-800">
        {message}
      </div>
      <div className="flex w-full justify-center">
        <button
          className="rounded bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
          onClick={onClose}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default AlertModal
