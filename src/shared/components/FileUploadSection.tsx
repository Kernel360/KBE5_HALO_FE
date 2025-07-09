import { useRef, useState } from 'react'
import WarningToast from '@/shared/components/ui/toast/WarningToast'

interface FileUploadSectionProps {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  title?: string
  errors?: string
  multiple?: boolean
  isRequired?: boolean
  uploadedFiles?: { name: string; url: string; size?: number }[]
  onRemoveUploadedFile?: (idx: number) => void
}

const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const MAX_FILE_COUNT = 5

export const FileUploadSection = ({
  files,
  setFiles,
  title,
  errors,
  multiple = true,
  isRequired = true,
  uploadedFiles = [],
  onRemoveUploadedFile
}: FileUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selectedFiles = Array.from(e.target.files)

    const validFiles = selectedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setToastMessage(`'${file.name}' 파일은 ${MAX_FILE_SIZE_MB}MB를 초과합니다.`)
        setToastOpen(true)
        return false
      }
      return true
    })

    // uploadedFiles가 있을 경우 총합 체크
    const uploadedCount = uploadedFiles ? uploadedFiles.length : 0
    const totalFiles = multiple
      ? files.length + uploadedCount + validFiles.length
      : validFiles.length + uploadedCount
    if (totalFiles > MAX_FILE_COUNT) {
      setToastMessage(`파일은 최대 ${MAX_FILE_COUNT}개까지 첨부할 수 있습니다.`)
      setToastOpen(true)
      e.target.value = ''
      return
    }

    setFiles(prev => (multiple ? [...prev, ...validFiles] : validFiles))
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileURL = (file: File) => URL.createObjectURL(file)

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
      return 'image'
    }
    if (ext === 'pdf') {
      return 'picture_as_pdf'
    }
    return 'description'
  }

  const formatFileSize = (size: number) => `${(size / (1024 * 1024)).toFixed(1)}MB`

  return (
    <div className="cuser-pointer flex flex-col gap-2 self-stretch">
      <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
        {title ? title : '첨부파일'}
        {isRequired && <span> *</span>}
      </label>
      <div className="flex flex-col gap-3 self-stretch rounded-lg bg-slate-50 p-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <ul className="flex w-full flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-slate-700">
              <div className="flex grow items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base text-slate-500">
                  {getFileIcon(file.name)}
                </span>
                <a
                  href={getFileURL(file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-[11.25rem] truncate text-blue-600 hover:underline">
                  {file.name}
                </a>
                <span className="text-xs text-slate-400">({formatFileSize(file.size)})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-sm text-red-500 transition hover:text-red-600"
                  title="삭제">
                  <span className="material-symbols-outlined align-text-bottom text-sm">
                    close_small
                  </span>
                </button>
              </div>
            </li>
          ))}
          {uploadedFiles.length > 0 && uploadedFiles.map((file, idx) => (
            <li
              key={`uploaded-${idx}`}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <div className="flex grow items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base text-slate-500">
                  {getFileIcon(file.name)}
                </span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-[11.25rem] truncate text-blue-600 hover:underline">
                  {file.name}
                </a>
                {typeof file.size === 'number' && (
                  <span className="text-xs text-slate-400">({formatFileSize(file.size)})</span>
                )}
                {onRemoveUploadedFile && (
                  <button
                    type="button"
                    onClick={() => onRemoveUploadedFile(idx)}
                    className="text-sm text-red-500 transition hover:text-red-600"
                    title="삭제"
                  >
                    <span className="material-symbols-outlined align-text-bottom text-sm">
                      close_small
                    </span>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={handleFileButtonClick}
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 self-stretch rounded-lg bg-white px-4 outline outline-1 outline-offset-[-1px] outline-indigo-600">
          <span className="material-symbols-outlined text-[#4f39f6]">add</span>
          <span className="font-['Inter'] text-sm leading-none font-medium text-indigo-600">
            파일 추가하기
          </span>
        </button>
        <div className="font-['Inter'] text-xs leading-none font-normal text-slate-500">
          JPG, PNG, PDF 파일 (각 최대 {MAX_FILE_SIZE_MB}MB
          {multiple ? `, 최대 ${MAX_FILE_COUNT}개` : ''})
        </div>
        {errors && files.length === 0 && (
          <p className="text-xs text-red-500">{errors}</p>
        )}
        <WarningToast open={toastOpen} message={toastMessage} onClose={() => setToastOpen(false)} />
      </div>
    </div>
  )
}
