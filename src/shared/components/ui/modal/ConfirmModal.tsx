import React from 'react'
import Modal from './Modal'

interface ConfirmModalProps {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
  confirmLabel = '확인',
  cancelLabel = '취소'
}) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}>
      <div className="mb-6 text-center text-base whitespace-pre-line text-gray-800">
        {message}
      </div>
      <div className="flex w-full justify-center gap-4">
        <button
          className="rounded bg-gray-200 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-300"
          onClick={onCancel}>
          {cancelLabel}
        </button>
        <button
          className="rounded bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
          onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmModal
