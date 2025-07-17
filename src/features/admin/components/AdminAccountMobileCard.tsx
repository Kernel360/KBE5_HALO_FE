import React from 'react'
import Button from '@/shared/components/ui/Button'
import AccountStatusBadge from '@/shared/components/ui/AccountStatusBadge'

interface AdminAccountMobileCardProps {
  row: Record<string, unknown>
  myPhone: string
  setEditTarget: (row: Record<string, unknown>) => void
  setEditModalOpen: (open: boolean) => void
  setErrorToastMsg: (msg: string) => void
  handleDeleteClick: (adminId: string | number) => void
}

const AdminAccountMobileCard: React.FC<AdminAccountMobileCardProps> = ({
  row,
  myPhone,
  setEditTarget,
  setEditModalOpen,
  setErrorToastMsg,
  handleDeleteClick
}) => {
  const phone = typeof row.phone === 'string' ? row.phone : ''
  const userName = typeof row.userName === 'string' ? row.userName : ''
  const adminId = row.adminId as string | number

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-gray-900">{userName}</div>
        <AccountStatusBadge status={row.status as string} />
      </div>
      <div className="text-sm break-all text-gray-700">
        이메일: {typeof row.email === 'string' ? row.email : ''}
      </div>
      <div className="text-sm break-all text-gray-700">연락처: {phone}</div>
      <div className="mt-2 flex items-center justify-center gap-2">
        <Button
          className="h-8 rounded-xl bg-indigo-500 px-4 text-xs font-semibold text-white shadow hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
          onClick={e => {
            e.stopPropagation()
            setEditTarget(row)
            setEditModalOpen(true)
          }}
        >
          수정
        </Button>
        <Button
          className="h-8 rounded-xl bg-red-500 px-4 text-xs font-semibold text-white shadow hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
          disabled={!!(phone === myPhone || (userName && typeof userName === 'string' && userName.includes('테스트')))}
          onClick={e => {
            e.stopPropagation()
            if (phone === myPhone) {
              setErrorToastMsg('본인 계정은 삭제할 수 없습니다.')
              return
            }
            if (
              userName &&
              typeof userName === 'string' &&
              userName.includes('테스트')
            ) {
              setErrorToastMsg('테스트 계정은 삭제할 수 없습니다.')
              return
            }
            handleDeleteClick(adminId)
          }}
        >
          삭제
        </Button>
      </div>
    </div>
  )
}

export default AdminAccountMobileCard 