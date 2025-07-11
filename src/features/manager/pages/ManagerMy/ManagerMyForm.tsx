import AddressSearch from '@/shared/components/AddressSearch'
import { FileUploadSection } from '@/shared/components/FileUploadSection'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Fragment } from 'react'
import type { ManagerInfo } from '@/features/manager/types/ManagerMyType'
import {
  getManager,
  updateManager,
  getServiceCategories
} from '@/features/manager/api/managerMy'
import { isValidEmail, isValidPassword } from '@/shared/utils/validation'
import type { ServiceCategoryTreeType } from '@/features/customer/types/CustomerReservationType'
import { Eye, EyeOff } from 'lucide-react'

// form 상태에 사용할 타입 확장 (기본 필드 + 비밀번호 확인 + 약관 동의 + 특기)
interface ManagerUpdateForm extends ManagerInfo {
  password: string
  confirmPassword: string
  specialty: string
}

// 요일, 시간대 정의 (업무 가능 시간표용)
const days = ['월', '화', '수', '목', '금', '토', '일']
const hours = Array.from(
  { length: 16 },
  (_, i) => `${(i + 8).toString().padStart(2, '0')}시`
)

export const ManagerMyForm = () => {
  const navigate = useNavigate()
  // 파일 업로드 상태
  const [files, setFiles] = useState<File[]>([])
  // 서비스 카테고리 상태
  const [serviceCategories, setServiceCategories] = useState<
    ServiceCategoryTreeType[]
  >([])
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
  // form 입력 상태 초기값
  const [form, setForm] = useState<ManagerUpdateForm | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const fetchManagerInfo = async () => {
      const data = await getManager()
      setAddressData({
        roadAddress: data.roadAddress,
        detailAddress: data.detailAddress,
        latitude: data.latitude,
        longitude: data.longitude
      })

      setForm({
        ...data,
        password: '',
        confirmPassword: '',
        specialty: data.specialty || '',
        availableTimes: data.availableTimes || []
      })

      const dayMap: Record<string, string> = {
        MONDAY: '월',
        TUESDAY: '화',
        WEDNESDAY: '수',
        THURSDAY: '목',
        FRIDAY: '금',
        SATURDAY: '토',
        SUNDAY: '일'
      }

      const initSelectedTimes: Record<string, Set<string>> = {}
      for (const { dayOfWeek, time } of data.availableTimes || []) {
        const hour = `${time.slice(0, 2)}시`
        const korDay = dayMap[dayOfWeek] // 영어 요일을 한글로 변환

        if (!korDay) continue // 매핑 실패한 경우 무시

        if (!initSelectedTimes[korDay]) initSelectedTimes[korDay] = new Set()
        initSelectedTimes[korDay].add(hour)
      }
      setSelectedTimes(initSelectedTimes)
    }
    fetchManagerInfo()

    // 서비스 카테고리 불러오기
    const fetchCategories = async () => {
      try {
        const categories = await getServiceCategories()
        setServiceCategories(categories)
      } catch {
        // TODO: toast로 변경
        alert('서비스 카테고리 조회에 실패했습니다.')
      }
    }
    fetchCategories()
  }, [])

  // 주소 정보가 바뀔 때 form에도 자동 반영
  useEffect(() => {
    if (addressData.latitude == null || addressData.longitude == null) return

    setForm(prev => {
      if (!prev) return prev
      const isSame =
        prev.roadAddress === addressData.roadAddress &&
        prev.latitude === addressData.latitude &&
        prev.longitude === addressData.longitude &&
        prev.detailAddress === addressData.detailAddress
      if (isSame) return prev
      return {
        ...prev,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        roadAddress: addressData.roadAddress,
        detailAddress: addressData.detailAddress
      }
    })
  }, [
    addressData.roadAddress,
    addressData.latitude,
    addressData.longitude,
    addressData.detailAddress
  ])

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
      const newAvailableTimes = Object.entries(updated).flatMap(
        ([korDay, hours]) =>
          Array.from(hours).map(h => ({
            dayOfWeek: convertToEnum(korDay),
            time: h.replace('시', ':00')
          }))
      )
      setForm((prev): ManagerUpdateForm | null => {
        if (!prev) return null
        return {
          ...prev,
          availableTimes: newAvailableTimes
        }
      })
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

  // 필수 입력 필드
  const requiredFields = [
    { name: 'email', label: '이메일' },
    { name: 'password', label: '비밀번호' },
    { name: 'confirmPassword', label: '비밀번호 확인' },
    { name: 'bio', label: '한줄소개' }
  ]

  // 필수 입력 validate
  const validateRequiredFields = () => {
    if (!form) return

    for (const field of requiredFields) {
      const key = field.name as keyof ManagerUpdateForm
      const value = form[key]
      // 문자열인 경우: 공백 제거하고 비어있으면 invalid
      if (typeof value === 'string' && value.trim() === '') {
        alert(`${field.label}을(를) 입력해주세요.`)
        return false
      }
      // null 또는 undefined 체크
      if (value === null || value === undefined) {
        alert(`${field.label}을(를) 입력해주세요.`)
        return false
      }
    }
    return true
  }

  // 추가 필수 입력 validate
  const validateExtraFields = () => {
    if (!form) return
    if (!form.roadAddress.trim()) {
      alert('도로명 주소를 입력해주세요.')
      return
    }
    if (!form.detailAddress.trim()) {
      alert('상세 주소를 입력해주세요.')
      return
    }
    if (
      form.latitude == null ||
      isNaN(form.latitude) ||
      form.longitude == null ||
      isNaN(form.longitude)
    ) {
      alert('잘못된 주소입니다. 다시 입력해주세요.')
      return
    }
    // if (form.profileImageId === null) {
    //   alert("프로필 사진을 업로드해주세요.");
    //   return false;
    // }
    // if (form.fileId === null) {
    //   alert("첨부파일을 등록해주세요.");
    //   return false;
    // }
    if (form.availableTimes.length === 0) {
      alert('업무 가능 시간을 1개 이상 선택해주세요.')
      return false
    }
    return true
  }

  // 나의 정보 수정
  const handleSubmit = async () => {
    if (!form) return

    // 필수 입력값 체크
    if (!validateRequiredFields()) return
    // 추가 필수 입력값 체크
    if (!validateExtraFields()) return

    // 이메일 유효성 검사
    if (!isValidEmail(form.email)) {
      alert('이메일 형식이 올바르지 않습니다.')
      return
    }
    // 비밀번호 유효성 검사
    if (!isValidPassword(form.password)) {
      alert(
        '비밀번호는 8~20자, 대소문자/숫자/특수문자 중 3가지 이상 포함해야 합니다.'
      )
      return
    }
    // 비밀번호 확인
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    // 최종 요청 객체 생성
    const requestBody = {
      userUpdateReqDTO: {
        email: form.email
        // password 등 필요시 추가
      },
      userInfoUpdateReqDTO: {
        roadAddress: form.roadAddress,
        detailAddress: form.detailAddress,
        latitude: form.latitude,
        longitude: form.longitude
      },
      managerUpdateInfoReqDTO: {
        specialty: form.specialty,
        bio: form.bio
      },
      availableTimeUpdateReqDTOList: form.availableTimes.map(at => ({
        dayOfWeek: at.dayOfWeek,
        time: at.time
      }))
    }

    try {
      await updateManager(requestBody)
      alert('정보 수정이 완료되었습니다.')
      navigate('/managers/my')
    } catch (err: any) {
      alert(err.message || '매니저 수정 실패')
    }
  }

  // 로딩 화면은 여기서 처리
  if (!form) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <Fragment>
      <div className="inline-flex w-full flex-col items-start justify-start self-stretch">
        <div className="inline-flex h-16 items-center justify-between self-stretch border-b border-gray-200 bg-white px-6">
          <div className="justify-start font-['Inter'] text-xl leading-normal font-bold text-gray-900">
            나의 정보 수정
          </div>
          <Link
            to="/managers/my"
            className="flex h-10 items-center justify-center rounded-md border px-4 text-sm text-gray-500 hover:bg-gray-100">
            취소
          </Link>
        </div>
        <div className="flex flex-col items-start justify-start gap-6 self-stretch p-6">
          <div className="flex flex-col items-start justify-start gap-6 self-stretch rounded-xl bg-white p-8 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
            <div className="inline-flex w-full flex-col items-start justify-start gap-6">
              <div className="flex flex-col items-start justify-start gap-4 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
                  프로필 정보
                </div>
                <div className="inline-flex items-start justify-start gap-4 self-stretch">
                  <div className="flex h-28 w-28 items-center justify-center rounded-[60px] bg-slate-100">
                    <span className="material-symbols-outlined inline-block text-[64px] leading-none text-slate-500">
                      face
                    </span>
                  </div>
                  <div className="inline-flex flex-1 flex-col items-start justify-center gap-2">
                    <div className="justify-start self-stretch font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      프로필 사진
                    </div>
                    <label className="inline-flex h-10 w-40 cursor-pointer items-center justify-center rounded-md bg-slate-50 px-4 outline outline-1 outline-offset-[-1px] outline-slate-200 hover:bg-slate-100">
                      <span className="justify-start font-['Inter'] text-sm leading-none font-medium text-slate-700">
                        파일 선택
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files && e.target.files.length > 0) {
                            setFiles(Array.from(e.target.files))
                          }
                        }}
                      />
                    </label>
                    <div className="justify-start self-stretch font-['Inter'] text-xs leading-none font-normal text-slate-500">
                      JPG, PNG 파일 (최대 5MB)
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4 md:flex-row md:gap-3">
                  {/* 이름 */}
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={form.userName}
                      readOnly
                      className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 placeholder-slate-400 outline-none"
                    />
                  </div>
                  {/* 연락처 */}
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      readOnly
                      className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 placeholder-slate-400 outline-none"
                    />
                  </div>
                  {/* 생년월일 */}
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      생년월일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={form.birthDate}
                      readOnly
                      className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4 md:flex-row md:gap-3">
                  {/* 특기 */}
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      특기 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="specialty"
                      value={form.specialty}
                      onChange={e =>
                        setForm(prev =>
                          prev ? { ...prev, specialty: e.target.value } : prev
                        )
                      }
                      className="h-12 rounded-lg border border-gray-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
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
                  {/* 이메일 */}
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      이메일
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={e =>
                        setForm(prev =>
                          prev ? { ...prev, email: e.target.value } : prev
                        )
                      }
                      className="h-12 rounded-lg border border-gray-300 bg-white px-4 text-sm text-slate-700 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                  {/* 성별 */}
                  <div className="mt-4 flex flex-1 flex-col gap-2 md:mt-0">
                    <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      성별 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="gender"
                      value={
                        form.gender === 'MALE'
                          ? '남자'
                          : form.gender === 'FEMALE'
                            ? '여자'
                            : ''
                      }
                      readOnly
                      className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>
                {/* 한줄소개 */}
                <div className="flex flex-col gap-2 self-stretch">
                  <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                    한줄소개 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={e =>
                      setForm(prev =>
                        prev ? { ...prev, bio: e.target.value } : prev
                      )
                    }
                    placeholder="자신을 소개하는 한 줄을 작성해주세요"
                    className="h-20 resize-none self-stretch rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-normal text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                {/* 주소 입력 */}
                <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
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
              <div className="flex flex-col items-start justify-start gap-4 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
                  업무 가능 시간 <span className="text-red-500">*</span>
                </div>
                {/* 업무 가능 시간 */}
                <div className="flex w-full flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex w-full items-center justify-between">
                      <p className="m-0 text-xs text-slate-500">
                        가능한 시간대를 선택해주세요.
                      </p>
                      <button
                        onClick={clearAllSelectedTimes}
                        className="ml-2 rounded-md border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50">
                        전체 초기화
                      </button>
                    </div>
                  </div>

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
                                  className={`h-9 cursor-pointer border-t border-r border-slate-200 text-center text-sm ${isSelected ? 'bg-indigo-100 font-medium text-indigo-600' : 'hover:bg-indigo-50'}`}
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
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
                  제출 서류
                </div>
                <FileUploadSection
                  files={files}
                  setFiles={setFiles}
                  multiple={true}
                  isRequired={true}
                />
                <div className="justify-start self-stretch font-['Inter'] text-lg leading-snug font-semibold text-slate-800">
                  계정 확인
                </div>
                <div className="inline-flex items-start justify-start gap-4 self-stretch">
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-['Inter'] text-sm leading-none font-medium whitespace-nowrap text-slate-700">
                        비밀번호 <span className="text-red-500">*</span>
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={e =>
                          setForm(prev =>
                            prev ? { ...prev, password: e.target.value } : prev
                          )
                        }
                        placeholder="비밀번호"
                        className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={
                          showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                        }>
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      비밀번호 확인 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={e =>
                          setForm(prev =>
                            prev
                              ? { ...prev, confirmPassword: e.target.value }
                              : prev
                          )
                        }
                        placeholder="비밀번호"
                        className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                        aria-label={
                          showConfirmPassword
                            ? '비밀번호 숨기기'
                            : '비밀번호 보기'
                        }>
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 inline-flex h-12 cursor-pointer items-center justify-center gap-2 self-stretch rounded-lg bg-indigo-600">
              <span className="material-symbols-outlined text-white">edit</span>
              <span className="font-['Inter'] text-base leading-tight font-semibold text-white">
                수정하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
