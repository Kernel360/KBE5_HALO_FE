import React from 'react'
import { ContractStatusBadge } from '@/shared/components/ui/ContractStatusBadge'
import type { AdminManagerDetail } from '@/features/admin/types/AdminManagerType'
import Button from '@/shared/components/ui/Button'
import type { SubmissionFileMeta } from './ManagerDetailInfo'
import { ManagerSubmissionFilesSection } from './ManagerDetailInfo'

interface ManagerContractInfoProps {
  manager: AdminManagerDetail
  onApprove: () => void
  onReject: () => void
  onTerminateApprove: () => void
  fileMetas?: SubmissionFileMeta[]
}

const ManagerContractInfo: React.FC<ManagerContractInfoProps> = ({
  manager,
  onApprove,
  onReject,
  onTerminateApprove,
  fileMetas = [],
}) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-8 shadow">
      <div className="text-lg font-semibold text-slate-800">계약 정보</div>
      <div className="inline-flex items-center justify-start gap-2">
        <div className="w-40 text-sm font-medium text-slate-500">계약 상태</div>
        <div className="flex-1">
          <ContractStatusBadge status={manager.contractStatus} />
        </div>
      </div>
      <div className="mt-2 mb-1 text-base font-semibold text-slate-500">
        이력
      </div>
      <div className="mb-2 h-px w-full bg-gray-200" />
      {/* 계약 해지 요청일 (TERMINATION_PENDING, TERMINATED) */}
      {(manager.contractStatus === 'TERMINATION_PENDING' || manager.contractStatus === 'TERMINATED') && (
        <div className="inline-flex items-center justify-start gap-2">
          <div className="w-40 text-sm font-medium text-slate-500">계약 해지 요청일</div>
          <div className="flex-1 text-sm font-medium text-slate-700">{manager.requestAt ? manager.requestAt : '-'}</div>
        </div>
      )}
      {/* 계약 해지 일시 (TERMINATED) */}
      {manager.contractStatus === 'TERMINATED' && (
        <div className="inline-flex items-center justify-start gap-2">
          <div className="w-40 text-sm font-medium text-slate-500">계약 해지 일시</div>
          <div className="flex-1 text-sm font-medium text-slate-700">{manager.terminatedAt ? manager.terminatedAt : '-'}</div>
        </div>
      )}
      {/* 계약 시작일 */}
      <div className="inline-flex items-center justify-start gap-2">
        <div className="w-40 text-sm font-medium text-slate-500">
          계약 시작일
        </div>
        <div className="flex-1 text-sm font-medium text-slate-700">
          {manager.contractAt ? manager.contractAt : '-'}
        </div>
      </div>
      {/* 가입일자 */}
      <div className="inline-flex items-center justify-start gap-2">
        <div className="w-40 text-sm font-medium text-slate-500">
          가입일자
        </div>
        <div className="flex-1 text-sm font-medium text-slate-700">
          {manager.createdAt ? manager.createdAt : '-'}
        </div>
      </div>
      {manager.status === 'TERMINATED' &&
        manager.terminatedAt &&
        manager.terminationReason && (
          <>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="w-40 text-sm font-medium text-slate-500">
                계약 해지일
              </div>
              <div className="flex-1 text-sm font-medium text-slate-700">
                {manager.terminatedAt}
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="w-40 text-sm font-medium text-slate-500">
                계약 해지 사유
              </div>
              <div className="flex-1 text-sm font-medium text-slate-700">
                {manager.terminationReason}
              </div>
            </div>
          </>
        )}
      {/* 계약 해지 사유 (TERMINATION_PENDING, TERMINATED) */}
      {(manager.contractStatus === 'TERMINATION_PENDING' || manager.contractStatus === 'TERMINATED') && (
        <>
          <div className="mt-4 mb-2 h-px w-full bg-gray-200" />
          <div className="inline-flex items-center justify-start gap-2">
            <div className="w-40 text-sm font-medium text-slate-500">계약 해지 사유</div>
            <div className="flex-1 text-sm font-medium text-slate-700">{manager.terminationReason ? manager.terminationReason : '-'}</div>
          </div>
        </>
      )}
      {/* 제출 서류(첨부파일) 영역 */}
      <ManagerSubmissionFilesSection fileMetas={fileMetas} />
      {manager.contractStatus === 'PENDING' && (
        <div className="mt-4 flex justify-end gap-2">
          <Button
            className="rounded border border-indigo-600 bg-white px-4 py-2 text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white"
            onClick={onApprove}
          >
            승인
          </Button>
          <Button
            className="rounded border border-red-500 bg-white px-4 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
            onClick={onReject}
          >
            거절
          </Button>
        </div>
      )}
      {manager.contractStatus === 'TERMINATION_PENDING' && (
        <div className="mt-4 flex justify-end gap-2">
          <Button
            className="rounded border border-red-500 bg-white px-4 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
            onClick={onTerminateApprove}
          >
            계약해지 승인
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManagerContractInfo;

