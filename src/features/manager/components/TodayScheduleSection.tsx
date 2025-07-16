import { useEffect, useState } from 'react'
import {
  searchManagerReservations,
  checkIn,
  checkOut
} from '@/features/manager/api/managerReservation'
import { useNavigate } from 'react-router-dom'
import type { ManagerReservationSummary as ManagerReservationType } from '@/features/manager/types/ManagerReservationType'
import { formatTimeRange } from '@/shared/utils/format'
import { MangerServiceCheckLogModal } from '../components/MangerServiceCheckLogModal'
import { createFileGroup } from '@/shared/utils/fileUpload'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'

// 이번주 월~일 날짜 배열 생성
function getThisWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0(일)~6(토)
  // 월요일 기준(한국): 일요일(0) → -6, 월(1) → 0, ... 토(6) → -5
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}
const weekDays = ['월', '화', '수', '목', '금', '토', '일']

export const TodayScheduleSection = () => {
  const [todayReservations, setTodayReservations] = useState<
    ManagerReservationType[]
  >([])
  const [weekStats, setWeekStats] = useState<{ day: string; count: number }[]>(
    []
  )
  const [weekReservations, setWeekReservations] = useState<
    ManagerReservationType[]
  >([])
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(null)
  const [animatingIdx, setAnimatingIdx] = useState<number | null>(null) // 현재 애니메이션 중인 인덱스
  const [animationType, setAnimationType] = useState<'down' | 'up' | null>(null) // 애니메이션 방향
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  // Add modal and check state for check-in/out
  const [modalOpen, setModalOpen] = useState(false)
  const [checkType, setCheckType] = useState<'IN' | 'OUT'>('IN')
  const [selectedReservation, setSelectedReservation] =
    useState<ManagerReservationType | null>(null)
  // File upload state for modal
  const [files, setFiles] = useState<File[]>([])
  const [fileId, setFileId] = useState<number | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; url: string; size?: number }[]
  >([])
  const [successToastMessage, setSuccessToastMessage] = useState<string | null>(
    null
  )
  const [isUploading, setIsUploading] = useState(false)

  // 오늘 날짜
  const today = new Date().toISOString().slice(0, 10)
  // 이번주 월~일 날짜 (YYYY-MM-DD)
  const weekDates = getThisWeekDates().map(d => d.toISOString().slice(0, 10))

  useEffect(() => {
    setLoading(true)
    setError(null)
    // 1. 오늘 예약 (fetch all, filter in code)
    searchManagerReservations({
      fromRequestDate: today,
      toRequestDate: today,
      reservationStatus: 'CONFIRMED,IN_PROGRESS',
      page: 0,
      size: 100
    })
      .then(data => {
        // Filter for only CONFIRMED or IN_PROGRESS
        setTodayReservations(
          (data.content || []).filter(
            (r: ManagerReservationType) =>
              r.status === 'CONFIRMED' || r.status === 'IN_PROGRESS'
          )
        )
      })
      .catch(err => {
        setError(err.message || '예약 데이터를 불러오지 못했습니다.')
      })
    // 2. 이번주 예약 통계 + 전체 목록
    searchManagerReservations({
      fromRequestDate: weekDates[0],
      toRequestDate: weekDates[6],
      reservationStatus: 'CONFIRMED,COMPLETED,IN_PROGRESS',
      page: 0,
      size: 200
    })
      .then(data => {
        const reservations: ManagerReservationType[] = data.content || []
        setWeekReservations(reservations)
        // 요일별 예약 건수 집계
        const counts = Array(7).fill(0)
        reservations.forEach(r => {
          const reqDate = r.requestDate
          const idx = weekDates.findIndex(d => reqDate && reqDate.startsWith(d))
          if (idx >= 0) counts[idx]++
        })
        setWeekStats(weekDays.map((day, i) => ({ day, count: counts[i] })))
      })
      .catch(() => {
        setWeekStats(weekDays.map(day => ({ day, count: 0 })))
        setWeekReservations([])
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line
  }, [today])

  const maxCount = Math.max(...weekStats.map(d => d.count), 1)

  // 확장된 요일의 예약 목록 필터링
  const expandedReservations =
    expandedDayIdx !== null
      ? weekReservations.filter(
          r =>
            r.requestDate && r.requestDate.startsWith(weekDates[expandedDayIdx])
        )
      : []

  // 확장/축소 핸들러
  const handleExpandDay = (idx: number) => {
    if (expandedDayIdx === idx) {
      // 축소: slide-up 적용 후 언마운트
      setAnimationType('up')
      setAnimatingIdx(idx)
      setTimeout(() => {
        setExpandedDayIdx(null)
        setAnimatingIdx(null)
        setAnimationType(null)
      }, 300) // slide-up duration과 맞춤
    } else {
      // 확장: 바로 slide-down
      setExpandedDayIdx(idx)
      setAnimatingIdx(idx)
      setAnimationType('down')
    }
  }

  // Reset modal state when opening
  useEffect(() => {
    if (modalOpen) {
      setFiles([])
      setFileId(null)
      setUploadedFiles([])
    }
  }, [modalOpen, checkType, selectedReservation])

  // Handle file upload and check-in/out
  const handleCheck = async (type: 'IN' | 'OUT') => {
    try {
      if (!selectedReservation) throw new Error('예약 정보가 없습니다.')
      let usedFileId = fileId
      if (files.length > 0) {
        setIsUploading(true)
        try {
          // 새 파일 업로드
          usedFileId = await createFileGroup(files)
          setFileId(usedFileId)
        } finally {
          setIsUploading(false)
        }
      }
      // 파일 업로드가 선택사항이므로, 파일이 없어도 진행
      if (type === 'IN') {
        await checkIn(
          selectedReservation.reservationId,
          usedFileId ?? undefined
        )
        setSuccessToastMessage('체크인이 완료되었습니다.')
      } else {
        await checkOut(
          selectedReservation.reservationId,
          usedFileId ?? undefined
        )
        setSuccessToastMessage('체크아웃이 완료되었습니다.')
      }
      // 성공 시 오늘의 예약 새로고침
      setModalOpen(false)
      setFiles([])
      setFileId(null)
      setUploadedFiles([])
      // 새로고침
      searchManagerReservations({
        fromRequestDate: today,
        toRequestDate: today,
        reservationStatus: 'CONFIRMED,IN_PROGRESS',
        page: 0,
        size: 100
      })
        .then(data => {
          setTodayReservations(
            (data.content || []).filter(
              (r: ManagerReservationType) =>
                r.status === 'CONFIRMED' || r.status === 'IN_PROGRESS'
            )
          )
        })
        .catch(() => {})
    } catch (err: any) {
      // setModalError(err.message || "체크인/체크아웃에 실패했습니다.")
    }
  }

  return (
    <div className="flex h-full min-h-[320px] w-full flex-1 flex-col gap-8 overflow-hidden rounded-xl bg-white p-6 shadow md:min-h-[380px] md:p-8 lg:min-h-[420px] lg:p-12">
      {/* 오늘의 예약 */}
      <div>
        <button
          type="button"
          className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800 hover:underline focus:outline-none md:text-xl lg:text-2xl"
          onClick={() =>
            navigate(
              `/managers/reservations?date=${new Date().toISOString().slice(0, 10)}`
            )
          }>
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 md:h-3 md:w-3" />
          오늘의 예약
        </button>
        {loading ? (
          <div className="py-8 text-center text-slate-400">불러오는 중...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : todayReservations.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            오늘의 예약이 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todayReservations.map(reservation => {
              const isCheckedIn = !!reservation.inTime
              const isCheckedOut = !!reservation.outTime
              let buttonLabel = '체크인'
              let buttonDisabled = false
              let nextCheckType = 'IN'

              if (reservation.status === 'IN_PROGRESS') {
                buttonLabel = '체크아웃'
                nextCheckType = 'OUT'
                if (isCheckedOut) {
                  buttonLabel = '완료'
                  buttonDisabled = true
                }
              } else if (reservation.status === 'CONFIRMED') {
                if (isCheckedIn && !isCheckedOut) {
                  buttonLabel = '체크아웃'
                  nextCheckType = 'OUT'
                } else if (isCheckedIn && isCheckedOut) {
                  buttonLabel = '완료'
                  buttonDisabled = true
                } else {
                  buttonLabel = '체크인'
                  nextCheckType = 'IN'
                }
              } else {
                buttonLabel = '완료'
                buttonDisabled = true
              }

              return (
                <div
                  key={reservation.reservationId}
                  className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-50 p-4 shadow-sm transition hover:bg-indigo-50 md:p-6"
                  onClick={() =>
                    navigate(
                      `/managers/reservations/${reservation.reservationId}`
                    )
                  }>
                  <div>
                    <div className="text-base font-semibold text-slate-700 md:text-lg">
                      {reservation.customerName} {reservation.serviceName}
                      {reservation.status === 'IN_PROGRESS' && (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 align-middle text-xs font-semibold text-blue-700">
                          서비스 진행 중
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 md:text-sm">
                      {reservation.startTime && reservation.turnaround
                        ? formatTimeRange(
                            reservation.startTime,
                            reservation.turnaround
                          )
                        : reservation.startTime}
                      {' | '}
                      {reservation.customerAddress}
                    </div>
                  </div>
                  <button
                    className={`rounded bg-indigo-100 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-200 md:px-8 md:py-3 md:text-base ${buttonDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      if (buttonDisabled) return
                      setSelectedReservation(reservation)
                      if (nextCheckType === 'IN' || nextCheckType === 'OUT') {
                        setCheckType(nextCheckType)
                      }
                      setModalOpen(true)
                    }}
                    disabled={buttonDisabled}>
                    {buttonLabel}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="my-2 border-t border-slate-200" />
      {/* 주간 스케줄 통계 */}
      <div>
        <div className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800 md:text-lg lg:text-xl">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 md:h-3 md:w-3" />
          주간 스케줄 통계
        </div>
        <div className="flex min-h-[100px] items-end gap-3 px-2 py-4 md:min-h-[160px] md:gap-8 md:px-6 md:py-6 lg:min-h-[200px]">
          {weekStats.map((stat, i) => (
            <div
              key={stat.day}
              className="group flex flex-col items-center">
              {/* 예약 건수 */}
              <span
                className={`mb-1 text-xs font-semibold md:text-sm ${
                  stat.count > 0 ? 'text-indigo-600' : 'text-slate-300'
                }`}>
                {stat.count}
              </span>
              {/* 막대그래프 (클릭 가능) */}
              <div
                className={`w-6 cursor-pointer rounded-t-lg transition-all duration-200 group-hover:scale-110 md:w-10 lg:w-12 ${
                  stat.count > 0
                    ? 'bg-gradient-to-t from-indigo-400 to-indigo-200 shadow-md'
                    : 'bg-slate-100'
                } ${expandedDayIdx === i ? 'ring-2 ring-indigo-400' : ''}`}
                style={{ height: `${(stat.count / maxCount) * 80 + 12}px` }}
                onClick={() => handleExpandDay(i)}
                title={`${stat.day}요일 예약 보기`}></div>
              {/* 요일 */}
              <span className="mt-2 text-xs font-medium text-slate-500 md:text-sm">
                {stat.day}
              </span>
            </div>
          ))}
        </div>
        {/* 확장 영역 */}
        <div style={{ minHeight: 0 }}>
          {(expandedDayIdx !== null ||
            (animatingIdx !== null && animationType === 'up')) && (
            <div
              className={`mt-4 flex min-h-[64px] w-full flex-col gap-2 rounded-lg bg-slate-50 p-4 shadow-inner ${
                animationType === 'up' ? 'slide-up' : 'slide-down'
              }`}
              key={animatingIdx ?? expandedDayIdx}>
              {(animatingIdx !== null
                ? weekReservations.filter(
                    r =>
                      r.requestDate &&
                      r.requestDate.startsWith(weekDates[animatingIdx])
                  )
                : []
              ).length === 0 &&
              (animationType === 'up' ||
                (expandedDayIdx !== null &&
                  expandedReservations.length === 0)) ? (
                <div className="py-4 text-center text-slate-400">
                  예약이 없습니다. 오늘은 여유로운 하루입니다!
                </div>
              ) : (
                (animatingIdx !== null
                  ? weekReservations.filter(
                      r =>
                        r.requestDate &&
                        r.requestDate.startsWith(weekDates[animatingIdx])
                    )
                  : expandedReservations
                ).map(reservation => (
                  <div
                    key={reservation.reservationId}
                    className="flex cursor-pointer items-center justify-between rounded bg-white p-3 shadow-sm transition hover:bg-indigo-50 md:p-4"
                    onClick={() =>
                      navigate(
                        `/managers/reservations/${reservation.reservationId}`
                      )
                    }>
                    <div>
                      <div className="text-base font-semibold text-slate-700 md:text-lg">
                        {reservation.customerName} {reservation.serviceName}
                        {reservation.status === 'IN_PROGRESS' && (
                          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 align-middle text-xs font-semibold text-blue-700">
                            서비스 진행 중
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 md:text-sm">
                        {reservation.startTime && reservation.turnaround
                          ? formatTimeRange(
                              reservation.startTime,
                              reservation.turnaround
                            )
                          : reservation.startTime}
                        {' | '}
                        {reservation.customerAddress}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 md:text-sm">
                      상세보기
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      {/* Add modal rendering for check-in/check-out */}
      <MangerServiceCheckLogModal
        open={modalOpen}
        checkType={checkType}
        files={files}
        setFiles={setFiles}
        onCheck={handleCheck}
        onClose={() => setModalOpen(false)}
        uploadedFiles={uploadedFiles}
        onRemoveUploadedFile={idx =>
          setUploadedFiles(prev => prev.filter((_, i) => i !== idx))
        }
        isUploading={isUploading}
      />
      {successToastMessage && (
        <SuccessToast
          open={!!successToastMessage}
          message={successToastMessage}
          onClose={() => setSuccessToastMessage(null)}
        />
      )}
    </div>
  )
}
