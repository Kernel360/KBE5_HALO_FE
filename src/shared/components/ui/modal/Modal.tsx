import React from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div
        className="max-w-[90vw] min-w-[320px] rounded-lg bg-white p-6 shadow-lg"
        onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default Modal
