import { useState, useEffect, Fragment } from 'react'
import AddressSearch from '@/shared/components/AddressSearch'
import { formatPhoneNumber } from '@/shared/utils/format'
import {
  isValidPhone,
  isValidPassword,
  isValidEmail
} from '@/shared/utils/validation'
import { useNavigate } from 'react-router-dom'
import { signupManager } from '@/features/manager/api/managerAuth'
import { createFileGroup } from '@/shared/utils/fileUpload'
import { getServiceCategories } from '@/features/manager/api/managerMy'
import type { ServiceCategoryTreeType } from '@/features/customer/types/CustomerReservationType'
import { Eye, EyeOff } from 'lucide-react'
import { FileUploadSection } from '@/shared/components/FileUploadSection'
import ErrorToast from '@/shared/components/ui/toast/ErrorToast'
import { PrivacyPolicyModal } from '@/features/customer/modal/PrivacyPolicyModal'
import BirthDateCalendar from '@/shared/components/ui/BirthDateCalendar'

interface ManagerSignupForm {
  phone: string
  email: string
  password: string
  confirmPassword: string
  userName: string
  birthDate: string
  gender: string
  bio: string
  profileImageId: number | null // 타입 에러 방지용, 실제 사용 X
  specialty: number | ''
  fileId: number | null
  profileImageFileId: number | null
  availableTimes: { dayOfWeek: string; time: string }[]
  termsAgreed: boolean
}

const days = ['월', '화', '수', '목', '금', '토', '일']
const hours = Array.from(
  { length: 16 },
  (_, i) => `${(i + 8).toString().padStart(2, '0')}시`
)

export const ManagerSignup = () => {
  const navigate = useNavigate()

  // 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [errorToast, setErrorToast] = useState({ open: false, message: '' })
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 업무 가능 시간 (요일-시간 Set)
  const [selectedTimes, setSelectedTimes] = useState<
    Record<string, Set<string>>
  >({})

  // 주소 정보 상태
  const [addressData, setAddressData] = useState({
    roadAddress: '',
    detailAddress: '',
    latitude: 0,
    longitude: 0
  })

  // form 입력 상태 초기값 (주소 관련 필드 제거)
  const [form, setForm] = useState<ManagerSignupForm>({
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
    birthDate: '',
    gender: '',
    bio: '',
    profileImageId: null, // 타입 에러 방지용, 실제 사용 X
    specialty: '',
    fileId: null,
    profileImageFileId: null,
    availableTimes: [],
    termsAgreed: false
  })

  // 서비스 카테고리 상태
  const [serviceCategories, setServiceCategories] = useState<
    ServiceCategoryTreeType[]
  >([])

  // 파일 업로드 상태
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  // 주소 상태 초기화
  useEffect(() => {
    setAddressData({
      roadAddress: '',
      detailAddress: '',
      latitude: 0,
      longitude: 0
    })
  }, [])

  // 서비스 카테고리 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getServiceCategories()
        setServiceCategories(categories)
      } catch {
        alert('서비스 카테고리 조회에 실패했습니다.')
      }
    }
    fetchCategories()
  }, [])

  // 파일 업로드 시 fileId 반영
  useEffect(() => {
    const upload = async () => {
      if (files.length > 0) {
        setUploading(true)
        try {
          const fileIds = await createFileGroup(files)
          setForm(prev => ({
            ...prev,
            fileId: Array.isArray(fileIds) ? fileIds[0] : fileIds
          }))
        } catch {
          alert('서류 파일 업로드에 실패했습니다.')
        } finally {
          setUploading(false)
        }
      } else {
        setForm(prev => ({ ...prev, fileId: null }))
      }
    }
    upload()
  }, [files])

  // 공통 입력값 변경 핸들러 (checkbox 포함)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // 연락처 입력 시 하이픈 자동 포맷 적용
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setForm(prev => ({ ...prev, phone: formatted }))
    setErrors(prev => ({ ...prev, phone: '' }))
  }

  // 업무 가능 시간 선택/해제 토글
  const toggleTimeSlot = (day: string, hour: string) => {
    setSelectedTimes(prev => {
      const updated = { ...prev }
      const currentSet = new Set(updated[day] || [])
      if (currentSet.has(hour)) {
        currentSet.delete(hour)
      } else {
        currentSet.add(hour)
      }
      updated[day] = currentSet
      return updated
    })
  }

  // 모든 선택된 시간 초기화
  const clearAllSelectedTimes = () => setSelectedTimes({})

  // 선택된 시간 텍스트 포맷 (예: "월요일: 09시, 10시")
  const formatSelectedTimeText = (day: string, hours: Set<string>) => {
    const sorted = Array.from(hours).sort()
    return `${day}요일: ${sorted.join(', ')}`
  }

  // 한글 요일 → 영문 ENUM 매핑
  const convertToEnum = (dayKor: string): string => {
    switch (dayKor) {
      case '월':
        return 'MONDAY'
      case '화':
        return 'TUESDAY'
      case '수':
        return 'WEDNESDAY'
      case '목':
        return 'THURSDAY'
      case '금':
        return 'FRIDAY'
      case '토':
        return 'SATURDAY'
      case '일':
        return 'SUNDAY'
      default:
        return ''
    }
  }

  // selectedTimes가 바뀔 때 availableTimes 업데이트
  useEffect(() => {
    const converted = Object.entries(selectedTimes).flatMap(([day, hours]) =>
      Array.from(hours).map(hour => ({
        dayOfWeek: convertToEnum(day),
        time: hour.replace('시', ':00')
      }))
    )
    setForm(prev => ({ ...prev, availableTimes: converted }))
  }, [selectedTimes])

  // 유효성 검사
  const validate = () => {
    // 디버그: 요청 데이터 콘솔 출력
    console.log('=== 매니저 회원가입 요청 데이터 ===')
    console.log('Form 데이터:', form)
    console.log('주소 데이터:', addressData)
    console.log('================================')
    
    const newErrors: Record<string, string> = {}
    if (!form.userName.trim()) newErrors.userName = '이름을 입력해주세요.'
    if (!form.specialty) newErrors.specialty = '특기를 선택해주세요.'
    if (!form.bio.trim()) newErrors.bio = '한줄소개를 입력해주세요.'
    if (!form.phone.trim()) newErrors.phone = '연락처를 입력해주세요.'
    if (!newErrors.phone && !isValidPhone(form.phone))
      newErrors.phoneFormat = '연락처 형식이 올바르지 않습니다.'
    if (!newErrors.email && form.email && !isValidEmail(form.email)) {
      newErrors.emailFormat = '이메일 형식이 올바르지 않습니다.'
    }
    if (!isValidPassword(form.password))
      newErrors.password =
        '8~20자, 대소문자/숫자/특수문자 중 3가지 이상 포함해야 합니다.'
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    if (!form.birthDate) newErrors.birthDate = '생년월일을 입력해주세요.'
    if (!form.gender) newErrors.gender = '성별을 선택해주세요.'
    if (
      !addressData.roadAddress.trim() ||
      !addressData.detailAddress.trim() ||
      !addressData.latitude ||
      !addressData.longitude
    ) {
      newErrors.address = '주소를 다시 입력해주세요.'
    }
    if (form.fileId === null) newErrors.fileId = '서류를 업로드해주세요.'
    if (form.profileImageFileId === null)
      newErrors.profileImageFileId = '프로필 사진을 업로드해주세요.'

    if (form.availableTimes.length === 0)
      newErrors.availableTimes = '업무 가능 시간을 1개 이상 선택해주세요.'
    if (!form.termsAgreed) newErrors.termsAgreed = '이용약관에 동의해주세요.'

    setErrors(newErrors)

    // 첫 번째 에러를 ErrorToast로 표시
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0]
      setErrorToast({ open: true, message: firstError })
    }

    return Object.keys(newErrors).length === 0
  }

  // 회원가입 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    const isValid = validate()

    if (!isValid) return

    const requestBody = {
      userSignupReqDTO: {
        phone: form.phone,
        userName: form.userName,
        email: form.email,
        password: form.password,
        status: 'ACTIVE'
      },
      userInfoSignupReqDTO: {
        birthDate: form.birthDate,
        gender: form.gender,
        latitude: addressData.latitude ?? 0,
        longitude: addressData.longitude ?? 0,
        roadAddress: addressData.roadAddress,
        detailAddress: addressData.detailAddress
      },
      availableTimeReqDTOList: form.availableTimes, // [{ dayOfWeek, time }]
      managerReqDTO: {
        specialty: form.specialty,
        bio: form.bio,
        fileId: form.fileId,
        profileImageFileId: form.profileImageFileId
      }
    }


    try {
      setIsSubmitting(true)
      await signupManager(requestBody as any)
      navigate('/managers/auth/login', { state: { signupSuccess: true } })
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || '매니저 지원에 실패했습니다.'
      setErrorToast({ open: true, message })
      setIsSubmitting(false)
    }
  }

  const [previewFile, setPreviewFile] = useState<File | null>(null)

  // specialty select 핸들러
  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value)
    setForm(prev => ({ ...prev, specialty: value }))
    setErrors(prev => ({ ...prev, specialty: '' }))
  }

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <Fragment>
      <div className="flex w-full justify-center px-4 py-12">
        <ErrorToast
          open={errorToast.open}
          message={errorToast.message}
          onClose={() => setErrorToast({ open: false, message: '' })}
        />
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[640px] space-y-6 rounded-xl px-10 py-12 shadow-lg">
          <h2 className="text-center text-2xl font-bold text-zinc-800">
            매니저 지원
          </h2>
          <p className="text-center text-sm text-zinc-500">
            HaloCare 매니저로 활동하기 위한 지원서를 작성해주세요
          </p>

          {/* 프로필 사진 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              프로필 사진 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[60px] bg-slate-100">
                {previewFile ? (
                  <img
                    src={URL.createObjectURL(previewFile)}
                    alt="프로필 미리보기"
                    className="h-28 w-28 rounded-[60px] object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined inline-block text-[64px] leading-none text-slate-500">
                    face
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex h-10 w-40 cursor-pointer items-center justify-center rounded-md bg-slate-50 px-4 text-sm font-medium text-slate-700 outline outline-1 outline-slate-200">
                  파일 선택
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async event => {
                      const file = event.target.files && event.target.files[0]
                      if (file) {
                        setPreviewFile(file)
                        setUploading(true)
                        try {
                          const fileId = await createFileGroup([file])
                          setForm(prev => ({
                            ...prev,
                            profileImageFileId: fileId
                          }))
                        } catch {
                          alert('프로필 사진 업로드에 실패했습니다.')
                        } finally {
                          setUploading(false)
                        }
                      }
                    }}
                  />
                </label>
                {uploading && (
                  <div className="mt-1 text-xs text-indigo-600">
                    업로드 중...
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  JPG, PNG 파일 (최대 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              이름(한글) <span className="text-red-500">*</span>
            </label>
            <input
              name="userName"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={form.userName}
              disabled={isSubmitting}
              onChange={handleChange}
              placeholder="홍길동"
            />
          </div>

          {/* 특기(서비스 카테고리) */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              특기(서비스 카테고리) <span className="text-red-500">*</span>
            </label>
            <select
              name="specialty"
              value={form.specialty}
              onChange={handleSpecialtyChange}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
              <option value="">특기를 선택하세요</option>
              {serviceCategories.map(cat => (
                <option
                  key={cat.serviceId}
                  value={cat.serviceId}>
                  {cat.serviceName}
                </option>
              ))}
            </select>
          </div>

          {/* 한줄소개 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              한줄소개 <span className="text-red-500">*</span>
            </label>
            <input
              name="bio"
              type="text"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={form.bio}
              disabled={isSubmitting}
              onChange={handleChange}
              placeholder="자신을 소개하는 한 줄을 작성해주세요"
            />
          </div>

          {/* 연락처 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="숫자만 입력하세요 (예: 01012345678)"
              value={form.phone}
              disabled={isSubmitting}
              onChange={handlePhoneChange}
            />
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              이메일 <span className="font-normal text-gray-400">(선택)</span>
            </label>
            <input
              name="email"
              type="email"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={form.email}
              disabled={isSubmitting}
              onChange={handleChange}
              placeholder="example@example.com"
            />
          </div>

          {/* 비밀번호 */}
          <div className="relative flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={form.password}
              disabled={isSubmitting}
              onChange={handleChange}
              placeholder="영문, 숫자, 특수문자 조합 8자 이상"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute top-9 right-3">
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* 비밀번호 확인 */}
          <div className="relative flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={form.confirmPassword}
              disabled={isSubmitting}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute top-9 right-3">
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* 생년월일 + 성별 */}
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
                생년월일 <span className="text-red-500">*</span>
              </label>
              <BirthDateCalendar
                selectedDate={form.birthDate}
                onDateChange={date => {
                  setForm(prev => ({ ...prev, birthDate: date }))
                  setErrors(prev => ({ ...prev, birthDate: '' }))
                }}
              />
            </div>
            <div className="flex w-28 flex-col gap-2">
              <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
                성별 <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                disabled={isSubmitting}
                onChange={e => {
                  const { name, value } = e.target
                  setForm(prev => ({ ...prev, [name]: value }))
                  setErrors(prev => ({ ...prev, [name]: '' }))
                }}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                <option value="">선택</option>
                <option value="MALE">남</option>
                <option value="FEMALE">여</option>
              </select>
            </div>
          </div>

          {/* 주소 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              주소 <span className="text-red-500">*</span>
            </label>
            <AddressSearch
              roadAddress={addressData.roadAddress}
              detailAddress={addressData.detailAddress}
              setRoadAddress={val => {
                setAddressData(prev => ({ ...prev, roadAddress: val }))
              }}
              setDetailAddress={val => {
                setAddressData(prev => ({ ...prev, detailAddress: val }))
              }}
              onAddressChange={(roadAddress, detailAddress, lat, lng) => {
                setAddressData({
                  roadAddress,
                  detailAddress,
                  latitude: lat,
                  longitude: lng
                })
              }}
            />
          </div>

          {/* 서류 파일 업로드 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              서류 파일 업로드 <span className="text-red-500">*</span>
            </label>
            <FileUploadSection
              files={files}
              setFiles={setFiles}
              title=""
              errors={errors.fileId}
              multiple={true}
              isRequired={true}
            />
          </div>

          {/* 업무 가능 시간 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-bold text-zinc-800">
              업무 가능 시간 <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500">
              가능한 시간대를 선택해주세요.
            </p>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-fixed border border-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="w-16 border-r border-slate-200 py-2 text-sm text-slate-700">
                      시간
                    </th>
                    {days.map(day => (
                      <th
                        key={day}
                        className="w-20 border-r border-slate-200 py-2 text-sm text-slate-700">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hours.map(hour => (
                    <tr key={hour}>
                      <td className="border-t border-r border-slate-200 bg-slate-50 py-1 text-center text-sm text-slate-600">
                        {hour}
                      </td>
                      {days.map(day => {
                        const isSelected = selectedTimes[day]?.has(hour)
                        return (
                          <td
                            key={`${day}-${hour}`}
                            className={`h-9 cursor-pointer border-t border-r border-slate-200 text-center text-sm ${
                              isSelected
                                ? 'bg-indigo-100 font-medium text-indigo-600'
                                : 'hover:bg-indigo-50'
                            }`}
                            onClick={() => toggleTimeSlot(day, hour)}>
                            {hour}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 선택된 시간 영역 */}
            {Object.values(selectedTimes).some(set => set.size > 0) && (
              <div className="mt-4 w-full rounded-lg bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-700">
                    선택된 업무 가능 시간
                  </div>
                  <button
                    type="button"
                    onClick={clearAllSelectedTimes}
                    className="rounded-md border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50">
                    전체 초기화
                  </button>
                </div>
                <div className="space-y-1 text-sm text-slate-700">
                  {days.map(day => {
                    const hoursSet = selectedTimes[day]
                    return hoursSet && hoursSet.size > 0 ? (
                      <div key={day}>
                        {formatSelectedTimeText(day, hoursSet)}
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="termsAgreed"
              name="termsAgreed"
              checked={form.termsAgreed}
              disabled={isSubmitting}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
            />
            <label
              htmlFor="termsAgreed"
              className="cursor-pointer text-sm text-gray-600">
              이용약관 및{' '}
              <span
                className="cursor-pointer font-medium text-indigo-600 hover:underline"
                onClick={e => {
                  e.preventDefault()
                  setIsPrivacyModalOpen(true)
                }}>
                개인정보처리방침
              </span>
              에 동의합니다.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-md bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400">
            {isSubmitting ? '지원 중...' : '지원하기'}
          </button>

          <p className="text-center text-sm text-zinc-500">
            이미 계정이 있으신가요?{' '}
            <a
              href="/managers/auth/login"
              className="font-medium text-indigo-600 hover:underline">
              로그인
            </a>
          </p>
        </form>

        <PrivacyPolicyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      </div>
    </Fragment>
  )
}
