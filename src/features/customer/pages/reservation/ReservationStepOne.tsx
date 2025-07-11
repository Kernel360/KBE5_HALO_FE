// ReservationStepOne.tsx
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  ReservationReqType,
  ServiceCategoryTreeType
} from '@/features/customer/types/CustomerReservationType'
import type { CustomerInfoType } from '@/features/customer/types/CustomerInfoType'
import {
  getServiceCategories,
  createReservation,
  getCustomerInfo
} from '@/features/customer/api/CustomerReservation'
import { formatPhoneNumber } from '@/shared/utils/format'
import AddressSearch from '@/shared/components/AddressSearch'
import { ReservationStepIndicator } from '@/features/customer/components/ReservationStepIndicator'
import { ServiceTypeSelector } from '@/features/customer/components/ServiceTypeSelector'
import ReservationDateCalendar from '@/shared/ui/ReservationDateCalendar'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import { MapPin, Phone, StickyNote, CalendarClock, Edit } from 'lucide-react'

export const ReservationStepOne: React.FC = () => {
  const navigate = useNavigate()
  const phoneRef = useRef<HTMLInputElement>(null)
  const [roadAddress, setRoadAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)

  const [form, setForm] = useState<ReservationReqType>({
    mainServiceId: 0,
    additionalServiceIds: [],
    phone: '',
    roadAddress: '',
    detailAddress: '',
    latitude: 0,
    longitude: 0,
    requestDate: '',
    startTime: '',
    turnaround: 0,
    price: 0,
    memo: ''
  })

  const [categories, setCategories] = useState<ServiceCategoryTreeType[]>([])
  const [, setUserInfo] = useState<CustomerInfoType[]>([])
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 주소 값 변경 시 form 동기화
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      roadAddress: roadAddress || '',
      detailAddress: detailAddress || '',
      latitude: latitude || 0,
      longitude: longitude || 0
    }))
  }, [roadAddress, detailAddress, latitude, longitude])

  useEffect(() => {
    const controller = new AbortController()

    // 카테고리 조회
    getServiceCategories()
      .then(data => {
        if (!controller.signal.aborted) {
          setCategories(data.body)
          setForm(prev => ({
            ...prev,
            mainServiceId: data.body[0]?.serviceId || 0
          }))
        }
      })
      .catch(console.error)

    // 고객 정보 조회
    getCustomerInfo()
      .then(res => {
        const customer: CustomerInfoType = res.body
        setUserInfo([customer])
        setForm(prev => ({
          ...prev,
          phone: customer.phone ?? '',
          roadAddress: customer.roadAddress ?? '',
          detailAddress: customer.detailAddress ?? '',
          latitude: customer.latitude ?? 0,
          longitude: customer.longitude ?? 0
        }))
        setRoadAddress(customer.roadAddress ?? '')
        setDetailAddress(customer.detailAddress ?? '')
        setLatitude(customer.latitude ?? 0)
        setLongitude(customer.longitude ?? 0)
      })
      .catch(console.error)

    return () => controller.abort()
  }, [])

  const selectedMain = categories.find(c => c.serviceId === form.mainServiceId)
  const children = selectedMain?.children ?? []
  const additionalItems = children.filter(item => item.price > 0)

  const timeOptions = useMemo(() => {
    // Generate hours from 6:00 to 20:00 (8PM) in 1-hour increments (6,7,...,20)
    return Array.from({ length: 15 }, (_, i) => {
      const hour = 6 + i
      const timeStr = `${String(hour).padStart(2, '0')}:00`

      return timeStr
    }).filter(Boolean) as string[]
  }, [])

  const handleChange = <K extends keyof ReservationReqType>(
    key: K,
    value: ReservationReqType[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const totalExtra = useMemo(() => {
    return additionalItems
      .filter(item => form.additionalServiceIds.includes(item.serviceId))
      .reduce(
        (acc, cur) => ({
          price: acc.price + (cur.price ?? 0),
          time: acc.time + (cur.serviceTime ?? 0)
        }),
        { price: 0, time: 0 }
      )
  }, [form.additionalServiceIds, additionalItems])

  const totalPrice = (selectedMain?.price ?? 0) + totalExtra.price
  const totalTime = (selectedMain?.serviceTime ?? 0) + totalExtra.time

  const formatEndTime = () => {
    if (!form.startTime || !totalTime) return ''
    const [startHour, startMinute] = form.startTime.split(':').map(Number)
    const endDate = new Date()
    endDate.setHours(startHour)
    endDate.setMinutes(startMinute)
    endDate.setHours(endDate.getHours() + totalTime)
    const endHour = String(endDate.getHours()).padStart(2, '0')
    const endMin = String(endDate.getMinutes()).padStart(2, '0')
    return `${form.startTime} ~ ${endHour}:${endMin} (${totalTime}시간)`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setForm(prev => ({ ...prev, phone: formatted }))
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setShowErrorToast(true)
  }

  const handleSubmit = async () => {
    if (!roadAddress?.trim()) return showError('도로명 주소를 입력해주세요.')
    if (!detailAddress?.trim()) return showError('상세 주소를 입력해주세요.')
    if (!form.phone) return showError('연락처를 입력해주세요.')
    if (!form.requestDate) return showError('예약 날짜를 선택해주세요.')
    if (!form.startTime) return showError('예약 시간을 선택해주세요.')
    if (!form.mainServiceId) return showError('서비스를 선택해주세요.')

    const reservationRequest: ReservationReqType = {
      ...form,
      roadAddress,
      detailAddress,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      turnaround: totalTime,
      price: totalPrice
    }

    try {
      const response = await createReservation(reservationRequest)

      if (response?.body?.reservation?.reservationId) {
        const reservationId = response.body.reservation.reservationId
        const targetUrl = `/reservations/${reservationId}/step-2`

        // 네비게이션 실행
        await navigate(targetUrl, {
          state: response.body
        })
      } else {
        showError('예약 요청 중 오류가 발생했습니다.')
      }
    } catch (e: unknown) {
      const errorMsg =
        (e as any)?.response?.data?.message ||
        '예약 요청 중 오류가 발생했습니다.'
      showError(errorMsg)
    }
  }

  const isNextDisabled =
    selectedMain?.depth === 0 && (selectedMain?.price ?? 0) === 0

  return (
    <div className="flex w-full flex-col items-center px-16 py-5">
      <ReservationStepIndicator step={1} />
      <div className="flex w-full max-w-[1200px] flex-col gap-8 lg:flex-row">
        {/* 좌측 - 입력 폼들 */}
        <div className="flex flex-1 flex-col gap-8">
          {/* 1. 서비스 종류 */}
          <ServiceTypeSelector
            categories={categories}
            selectedServiceId={form.mainServiceId}
            selectedAdditionalServiceIds={form.additionalServiceIds}
            onServiceChange={serviceId =>
              handleChange('mainServiceId', serviceId)
            }
            onAdditionalServiceChange={serviceIds =>
              handleChange('additionalServiceIds', serviceIds)
            }
          />

          {/* 2. 서비스 날짜 및 시간 */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <CalendarClock
                size={18}
                className="text-indigo-600"
              />
              서비스 날짜 및 시간
            </h2>
            <ReservationDateCalendar
              selectedDate={form.requestDate}
              onDateChange={date => handleChange('requestDate', date)}
            />
            <div className="relative">
              <select
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 pr-10 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                value={form.startTime}
                onChange={e => handleChange('startTime', e.target.value)}>
                <option
                  value=""
                  disabled
                  hidden>
                  시간 선택
                </option>
                {timeOptions.map(time => (
                  <option
                    key={time}
                    value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 3. 서비스 주소 */}
          <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin
                size={18}
                className="text-indigo-600"
              />
              서비스 주소
              <Edit
                size={16}
                className="ml-1 text-gray-400"
              />
            </h2>
            <AddressSearch
              roadAddress={roadAddress}
              detailAddress={detailAddress}
              setRoadAddress={setRoadAddress}
              setDetailAddress={setDetailAddress}
              onCoordinatesChange={(lat, lng) => {
                setLatitude(lat)
                setLongitude(lng)
              }}
            />
          </div>

          {/* 4. 연락처 */}
          <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Phone
                size={18}
                className="text-indigo-600"
              />
              연락처{' '}
              <Edit
                size={16}
                className="ml-1 text-gray-400"
              />
            </h2>
            <input
              id="phone"
              type="tel"
              ref={phoneRef}
              className="h-11 w-full rounded-md border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-400"
              placeholder="숫자만 입력하세요 (예: 01012345678)"
              value={form.phone}
              onChange={handlePhoneChange}
            />
          </div>

          {/* 5. 전달 사항 */}
          <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <StickyNote
                size={18}
                className="text-indigo-600"
              />
              전달 사항
            </h2>
            <textarea
              className="h-24 rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
              placeholder="반려동물 유무와 기타 요청사항을 입력해주세요."
              value={form.memo}
              onChange={e => handleChange('memo', e.target.value)}
            />
          </div>
        </div>

        {/* 우측 - 예약 정보 및 버튼 */}
        <div className="flex w-full flex-col gap-6 lg:sticky lg:top-6 lg:w-80 lg:self-start">
          {/* 예약 정보 */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">예약 정보</h2>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">서비스 종류</span>
              <span>{selectedMain?.serviceName || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">서비스 날짜</span>
              <span>{form.requestDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">서비스 시간</span>
              <span>{formatEndTime()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">서비스 비용</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="my-2 border-t border-gray-200" />
            <div className="flex justify-between text-base font-semibold">
              <span>총 결제 금액</span>
              <span className="text-lg text-indigo-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          <button
            disabled={isNextDisabled}
            onClick={handleSubmit}
            className={`flex h-12 items-center justify-center rounded-lg text-base font-semibold transition ${
              isNextDisabled
                ? 'cursor-not-allowed bg-gray-300 text-white'
                : 'cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700'
            } `}>
            다음 단계로
          </button>
        </div>
      </div>

      <ErrorToast
        open={showErrorToast}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  )
}
