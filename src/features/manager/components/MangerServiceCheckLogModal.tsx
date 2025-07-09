import { FileUploadSection } from '@/shared/components/FileUploadSection'
import { Fragment } from 'react'

interface MangerServiceCheckLogModalProps {
  open: boolean
  checkType: 'IN' | 'OUT'
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  onCheck: (checkType: 'IN' | 'OUT') => void
  onClose: () => void
  uploadedFiles: { name: string; url: string; size?: number }[]
  onRemoveUploadedFile?: (idx: number) => void
  isUploading?: boolean
  isUploadError?: boolean // 업로드 실패 상태
  onRetryUpload?: () => void // 재시도 핸들러
}

export const MangerServiceCheckLogModal = ({
  open,
  checkType,
  files,
  setFiles,
  onCheck,
  onClose,
  uploadedFiles,
  onRemoveUploadedFile,
  isUploading = false,
  isUploadError = false,
  onRetryUpload
}: MangerServiceCheckLogModalProps) => {
  if (!open) return null
  return (
    <Fragment>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50">
        <div className="flex max-h-[90vh] w-[30rem] flex-col gap-6 overflow-y-auto rounded-2xl bg-white p-[2rem] shadow-xl">
          <div className="inline-flex items-center justify-between self-stretch">
            <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-slate-800">
              {checkType === 'IN'
                ? '체크인을 진행하시겠습니까?'
                : '체크아웃을 진행하시겠습니까?'}
            </div>
            <div className="relative h-6 w-6 overflow-hidden">
              <button
                onClick={onClose}
                className="cursor-pointer text-slate-500 hover:text-slate-700">
                ✕
              </button>
            </div>
          </div>
          <div className="h-px self-stretch bg-slate-200" />
          {/* 첨부파일 */}
          <FileUploadSection
            files={files}
            setFiles={setFiles}
            multiple={checkType === 'IN' ? false : true}
            isRequired={false}
            uploadedFiles={uploadedFiles}
            onRemoveUploadedFile={onRemoveUploadedFile}
          />
          <div className="inline-flex items-center justify-end gap-3 self-stretch">
            {isUploading && (
              <span className="flex items-center gap-1 text-sm text-indigo-600">
                <svg
                  className="mr-1 h-4 w-4 animate-spin text-indigo-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                파일 업로드 중...
              </span>
            )}
            {isUploadError && (
              <button
                type="button"
                onClick={onRetryUpload}
                className="flex items-center justify-center rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 disabled:opacity-50"
                disabled={isUploading}
                aria-label="업로드 재시도"
                title="업로드 재시도"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356-2A9 9 0 106.582 9m13.356-2V4m0 0h-5"
                  />
                </svg>
              </button>
            )}
            <button
              type="submit"
              onClick={() => onCheck(checkType)}
              className={`flex h-11 w-24 cursor-pointer items-center justify-center rounded-lg ${isUploading || isUploadError ? 'cursor-not-allowed bg-gray-300' : 'bg-indigo-600'} `}
              disabled={isUploading || isUploadError}
            >
              <div className="justify-start font-['Inter'] text-sm leading-none font-medium text-white">
                {checkType === 'IN' ? '체크인' : '체크아웃'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  )
} 