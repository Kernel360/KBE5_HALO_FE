import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getManager } from '@/features/manager/api/managerMy'
import type { ManagerInfo } from '@/features/manager/types/ManagerMyType'
import { Loading } from '@/shared/components/ui/Loading'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { AddressMapCard } from '@/features/manager/components/AddressMapCard'
import { ProfileImagePreview } from '@/shared/components/ui/ProfileImagePreview'


export const ManagerMy = () => {
  const [manager, setManager] = useState<ManagerInfo | null>(null)
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null)

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const body = await getManager()
        setManager(body)
      } catch {
        setErrorToastMsg('매니저 정보 조회 중 오류가 발생하였습니다.')
      }
    }
    fetchManager()
  }, [])

  // 로딩 화면은 여기서 처리
  if (!manager) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loading />
        <ErrorToast
          open={!!errorToastMsg}
          message={errorToastMsg || ''}
          onClose={() => setErrorToastMsg(null)}
        />
      </div>
    )
  }

  return (
    <Fragment>
      <ErrorToast
        open={!!errorToastMsg}
        message={errorToastMsg || ''}
        onClose={() => setErrorToastMsg(null)}
      />
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
        {/* 상단 우측 정보 수정 버튼 */}
        <div className="mb-4 flex justify-end">
          <Link
            to="/managers/my/edit"
            className="flex h-10 items-center rounded bg-indigo-600 px-5 font-semibold text-white transition hover:bg-indigo-700">
            정보 수정
          </Link>
        </div>
        {/* 1. 프로필/상태 */}
        <Card className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow">
          {/* 프로필 이미지/이니셜 */}
          <div className="mb-2">
            {(() => {
              // profileImagePath가 JSON 배열 형태의 문자열인 경우 파싱
              let imageUrl = null
              if (manager.profileImagePath) {
                try {
                  const parsedPath = JSON.parse(manager.profileImagePath)
                  imageUrl = Array.isArray(parsedPath)
                    ? parsedPath[0]
                    : parsedPath
                } catch {
                  // 파싱 실패 시 그대로 사용
                  imageUrl = manager.profileImagePath
                }
              }

              return imageUrl ? (
                <ProfileImagePreview
                  src={imageUrl}
                  alt={`${manager.userName} 프로필`}
                  size="md"
                  className="bg-indigo-100 text-indigo-600"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
                  {manager.userName?.charAt(0) || '?'}
                </div>
              )
            })()}
          </div>
          {/* 이름 + 상태 뱃지 */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-800">
              {manager.userName}
            </span>
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                manager.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : manager.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700'
                    : manager.status === 'TERMINATION_PENDING'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-200 text-gray-500'
              }`}>
              {manager.status === 'ACTIVE'
                ? '활성화'
                : manager.status === 'PENDING'
                  ? '대기'
                  : manager.status === 'TERMINATION_PENDING'
                    ? '계약 정지 대기'
                    : manager.statusName}
            </span>
          </div>
          {/* 주요 정보 */}
          <div className="flex flex-col items-center gap-1 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">mail</span>
              {manager.email}
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">call</span>
              {manager.phone}
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                person
              </span>
              {manager.genderName}
              <span className="material-symbols-outlined text-base">cake</span>
              {manager.birthDate}
            </div>
          </div>
          {/* 상태 메시지 */}
          {manager.bio && (
            <div className="mt-2 text-center text-sm text-slate-500">
              {manager.bio}
            </div>
          )}
        </Card>

        {/* 2. 업무 가능 시간 */}
        <Card className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <div className="mb-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-blue-500">
              schedule
            </span>
            <span className="text-xl font-bold text-slate-800">
              업무 가능 시간
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(() => {
              const dayNames = {
                MONDAY: '월요일',
                TUESDAY: '화요일',
                WEDNESDAY: '수요일',
                THURSDAY: '목요일',
                FRIDAY: '금요일',
                SATURDAY: '토요일',
                SUNDAY: '일요일'
              }

              const groupedTimes = manager.availableTimes.reduce(
                (acc, time) => {
                  if (!acc[time.dayOfWeek]) acc[time.dayOfWeek] = []
                  acc[time.dayOfWeek].push(time.time)
                  return acc
                },
                {} as Record<string, string[]>
              )

              const dayOrder = [
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
                'SUNDAY'
              ]

              return dayOrder
                .map(day => {
                  const times = groupedTimes[day] || []
                  if (times.length === 0) return null

                  const sortedTimes = times.sort()
                  const startTime = sortedTimes[0].slice(0, 5)
                  const endTime = sortedTimes[sortedTimes.length - 1].slice(
                    0,
                    5
                  )

                  return (
                    <div
                      key={day}
                      className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="font-semibold text-slate-700">
                        {dayNames[day as keyof typeof dayNames]}
                      </div>
                      <div className="text-sm text-slate-600">
                        {startTime} ~ {endTime}
                      </div>
                      <div className="text-xs text-slate-500">
                        {times.length}개 시간대
                      </div>
                    </div>
                  )
                })
                .filter(Boolean)
            })()}
          </div>
        </Card>

        {/* 3. 서비스 지역(주소+지도) */}
        <Card className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <AddressMapCardForCustomer
            reservation={{
              roadAddress: manager.roadAddress,
              detailAddress: manager.detailAddress
            }}
          />
        </Card>

        {/* 4. 첨부파일 */}
        {manager.fileId && (
          <Card className="flex flex-col gap-2 p-6">
            <div className="mb-2 text-base font-semibold text-slate-800">
              첨부파일
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500">
                description
              </span>
              <span className="text-sm font-medium text-slate-700">
                {manager.fileName}
              </span>
            </div>
          </Card>
        )}

        {/* 5. 계약 정보 */}
        <Card className="flex flex-col gap-4 rounded-2xl border border-indigo-200 bg-white p-8 shadow-lg">
          <div className="mb-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-indigo-500">
              gavel
            </span>
            <span className="text-xl font-bold text-slate-800">계약 정보</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-32 font-medium text-slate-500">계약 상태</span>
              <span className="flex items-center">
                <span className="mr-2">
                  <Button
                    className={`cursor-default px-3 py-1 text-xs font-medium ${
                      manager.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : manager.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : manager.status === 'TERMINATION_PENDING'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}>
                    {manager.status === 'ACTIVE'
                      ? '활성화'
                      : manager.status === 'PENDING'
                        ? '대기'
                        : manager.status === 'TERMINATION_PENDING'
                          ? '계약 정지 대기'
                          : manager.statusName}
                  </Button>
                </span>
              </span>
            </div>
            {manager.status === 'ACTIVE' && (
              <div className="flex items-center gap-3">
                <span className="w-32 font-medium text-slate-500">
                  계약 시작일
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {manager.contractAt}
                </span>
              </div>
            )}
            {manager.status === 'TERMINATION_PENDING' && (
              <div className="flex flex-col gap-2">
                <div className="w-32 font-medium text-slate-500">
                  계약 해지 사유
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-sm font-medium whitespace-pre-wrap text-red-700">
                  {manager.terminationReason}
                </div>
              </div>
            )}
            {manager.status === 'ACTIVE' && (
              <div className="mt-4 flex justify-end">
                <Link
                  to="/managers/my/contract-cancel"
                  state={{
                    contractAt: manager.contractAt,
                    statusName: manager.statusName
                  }}>
                  <Button className="h-10 w-40 rounded-lg bg-red-500 font-semibold text-white shadow hover:bg-red-600">
                    계약 해지 요청
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Fragment>
  )
}
