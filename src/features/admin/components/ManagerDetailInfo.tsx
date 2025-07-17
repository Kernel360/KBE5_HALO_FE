import React, { useEffect, useState } from 'react'
import type { AdminManagerDetail } from '@/features/admin/types/AdminManagerType'
import ManagerAvailableTimeClock from './ManagerAvailableTimeClock'
import ManagerAddressMap from './ManagerAddressMap'
import Card from '@/shared/components/ui/Card'

interface ManagerDetailInfoProps {
  manager: AdminManagerDetail
  weekDays: { label: string; key: string }[]
  groupedTimes: Record<string, string[]>
}

interface FileMeta {
  url: string
  name: string
  type: string
  size: number
}

// 파일 확장자별 아이콘 반환 함수
export const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return 'image'
  if (ext === 'pdf') return 'picture_as_pdf'
  return 'description'
}

export interface SubmissionFileMeta {
  url: string
  name: string
  type: string
  size: number
}

interface ManagerSubmissionFilesSectionProps {
  fileMetas: SubmissionFileMeta[]
}

export const ManagerSubmissionFilesSection: React.FC<ManagerSubmissionFilesSectionProps> = ({ fileMetas }) => (
  <div className="mb-4">
    <div className="font-bold mb-2">제출 서류</div>
    {(!fileMetas || fileMetas.length === 0) ? (
      <div className="text-gray-400">제출 서류 없음</div>
    ) : (
      <ul className="flex flex-col gap-2">
        {fileMetas.map((file, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="material-symbols-outlined text-base text-slate-500">
              {getFileIcon(file.name)}
            </span>
            <a
              href={file.url}
              download={file.name}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[11.25rem] truncate text-slate-700 hover:text-slate-900 hover:underline transition"
              title={file.name}
            >
              {file.name}
            </a>
            <span className="text-xs text-slate-400">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : '-'}</span>
            <a
              href={file.url}
              download={file.name}
              className="ml-2 text-slate-400 hover:text-indigo-600"
              title="다운로드"
            >
              <span className="material-symbols-outlined text-base align-text-bottom">download</span>
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
)

const ManagerDetailInfo: React.FC<ManagerDetailInfoProps> = ({
  manager,
  weekDays,
  groupedTimes,
}) => {
  const [fileMetas, setFileMetas] = useState<FileMeta[]>([])

  // 타입 단언: filePaths, phoneNumber 등 확장 필드 안전하게 접근
  const managerExt = manager as unknown as {
    filePaths?: string[] | string
    phone?: string
    phoneNumber?: string
    email?: string
  }

  useEffect(() => {
    let filePaths: string[] = []
    try {
      if (managerExt.filePaths) {
        if (typeof managerExt.filePaths === 'string') {
          const parsed = JSON.parse(managerExt.filePaths)
          if (Array.isArray(parsed)) filePaths = parsed
        } else if (Array.isArray(managerExt.filePaths)) {
          filePaths = managerExt.filePaths
        }
      }
    } catch {
      filePaths = []
    }
    if (!Array.isArray(filePaths)) filePaths = []

    const fetchMetas = async () => {
      try {
        const metas: FileMeta[] = await Promise.all(
          filePaths.map(async (url: string) => {
            try {
              const res = await fetch(url, { method: 'HEAD' });
              const name = decodeURIComponent(url.split('/').pop()?.split('?')[0] || '파일')
              const type = res.headers.get('Content-Type') || '-'
              const size = Number(res.headers.get('Content-Length') || 0)
              return { url, name, type, size }
            } catch {
              return { url, name: '알 수 없음', type: '-', size: 0 }
            }
          })
        )
        setFileMetas(metas)
      } catch {
        setFileMetas([])
      }
    }
    fetchMetas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager])

  return (
    <Card className="flex w-full flex-col gap-6 rounded-xl bg-white p-8 shadow">
      <div className="text-lg font-semibold text-slate-800">상세 정보</div>
      <div className="text-base font-medium text-slate-500">기본 정보</div>
      <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
        <div className="mb-2 text-base font-bold text-slate-800">연락처</div>
        <div className="text-sm text-slate-700">전화번호: {managerExt.phone}</div>
        <div className="text-sm text-slate-700">이메일: {managerExt.email}</div>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-slate-500 text-base font-medium">
          주소 및 서비스 지역
        </div>
        <div className="p-4 bg-slate-50 rounded-lg flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-slate-700 text-sm font-medium">
              주소: {manager.roadAddress}
            </div>
            <div className="text-slate-700 text-sm font-medium">
              상세주소: {manager.detailAddress}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-slate-600 text-sm font-medium">
                서비스 가능 지역
              </span>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <div className="text-indigo-700 text-sm font-medium mb-1">
                위 주소 기준 반경 5km 이내
              </div>
              <div className="text-indigo-600 text-xs">
                매니저가 직접 방문하여 서비스를 제공할 수 있는 지역입니다.
              </div>
            </div>
            <ManagerAddressMap
              address={manager.roadAddress}
              detailAddress={manager.detailAddress}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-slate-500 text-base font-medium">
          업무 가능 시간
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <ManagerAvailableTimeClock
            weekDays={weekDays}
            groupedTimes={groupedTimes}
          />
        </div>
      </div>
    </Card>
  );
};

export default ManagerDetailInfo;
