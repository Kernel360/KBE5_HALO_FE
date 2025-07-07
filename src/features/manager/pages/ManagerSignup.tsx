import { useState, useEffect, Fragment } from 'react'
import AddressSearch from '@/shared/components/AddressSearch'
import { useAddressStore } from '@/store/useAddressStore'
import { formatPhoneNumber } from '@/shared/utils/format'
import {
  isValidPhone,
  isValidPassword,
  isValidEmail
} from '@/shared/utils/validation'
import { useNavigate } from 'react-router-dom'
import type { createManagerSignup } from '@/features/manager/types/ManagerAuthType'
import { signupManager } from '@/features/manager/api/managerAuth'
import { createFileGroup } from "@/shared/utils/fileUpload";

interface ManagerSignupForm extends createManagerSignup {
  confirmPassword: string;
  termsAgreed: boolean;
}

const days = ["월", "화", "수", "목", "금", "토", "일"];
const hours = Array.from(
  { length: 16 },
  (_, i) => `${(i + 8).toString().padStart(2, "0")}시`,
);

export const ManagerSignup = () => {
  const navigate = useNavigate();

  // 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 업무 가능 시간 (요일-시간 Set)
  const [selectedTimes, setSelectedTimes] = useState<
    Record<string, Set<string>>
  >({});

  // 주소 정보 상태 (Zustand에서 관리)
  const { roadAddress, latitude, longitude, detailAddress, setAddress } =
    useAddressStore();

  // form 입력 상태 초기값 (주소 관련 필드 제거)
  const [form, setForm] = useState<
    Omit<
      ManagerSignupForm,
      "roadAddress" | "detailAddress" | "latitude" | "longitude"
    >
  >({
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    birthDate: "",
    gender: "",
    bio: "",
    profileImageId: null,
    fileId: null,
    availableTimes: [],
    termsAgreed: false,
  });

  // 주소 상태 초기화
  useEffect(() => {
    setAddress("", 0, 0, "");
  }, [setAddress]);

  // 공통 입력값 변경 핸들러 (checkbox 포함)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 연락처 입력 시 하이픈 자동 포맷 적용
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setForm(prev => ({ ...prev, phone: formatted }))
    setErrors(prev => ({ ...prev, phone: '' }))
  };

  // 업무 가능 시간 선택/해제 토글
  const toggleTimeSlot = (day: string, hour: string) => {
    setSelectedTimes(prev => {
      const updated = { ...prev }
      const currentSet = new Set(updated[day] || [])
      currentSet.has(hour) ? currentSet.delete(hour) : currentSet.add(hour)
      updated[day] = currentSet
      return updated
    })
  };

  // 모든 선택된 시간 초기화
  const clearAllSelectedTimes = () => setSelectedTimes({});

  // 선택된 시간 텍스트 포맷 (예: "월요일: 09시, 10시")
  const formatSelectedTimeText = (day: string, hours: Set<string>) => {
    const sorted = Array.from(hours).sort()
    return `${day}요일: ${sorted.join(', ')}`
  };

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
  };

  // selectedTimes가 바뀔 때 availableTimes 업데이트
  useEffect(() => {
    const converted = Object.entries(selectedTimes).flatMap(([day, hours]) =>
      Array.from(hours).map(hour => ({
        dayOfWeek: convertToEnum(day),
        time: hour.replace('시', ':00')
      }))
    )
    setForm(prev => ({ ...prev, availableTimes: converted }))
  }, [selectedTimes]);

  // 유효성 검사
  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!form.phone.trim()) newErrors.phone = '연락처를 입력해주세요.'
    if (!newErrors.phone && !isValidPhone(form.phone))
      newErrors.phoneFormat = '연락처 형식이 올바르지 않습니다.'
    if (!form.email.trim()) newErrors.email = '이메일을 입력해주세요.'
    if (!newErrors.email && !isValidEmail(form.email))
      newErrors.emailFormat = '이메일 형식이 올바르지 않습니다.'
    if (!isValidPassword(form.password))
      newErrors.password =
        '8~20자, 대소문자/숫자/특수문자 중 3가지 이상 포함해야 합니다.'
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    if (!form.userName.trim()) newErrors.userName = '이름을 입력해주세요.'
    if (!form.birthDate) newErrors.birthDate = '생년월일을 입력해주세요.'
    if (!form.gender) newErrors.gender = '성별을 선택해주세요.'
    if (!form.bio.trim()) newErrors.bio = '한줄소개를 입력해주세요.'
    if (
      !roadAddress.trim() ||
      !detailAddress.trim() ||
      !latitude ||
      !longitude
    ) {
      newErrors.address = '주소를 다시 입력해주세요.'
    }
    // if (form.profileImageId === null) newErrors.profileImageId = "프로필 사진을 업로드해주세요.";
    // if (form.fileId === null) newErrors.fileId = "첨부파일을 업로드해주세요.";
    if (form.availableTimes.length === 0)
      newErrors.availableTimes = '업무 가능 시간을 1개 이상 선택해주세요.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  };

  // 회원가입 제출 처리
  const handleSubmit = async () => {
    if (!validate()) return
    if (!form.termsAgreed) {
      alert('이용약관에 동의해주세요.')
      return false
    }

    const { confirmPassword, termsAgreed, ...filteredForm } = form
    const requestBody: createManagerSignup = {
      ...filteredForm,
      roadAddress,
      detailAddress,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      availableTimes: form.availableTimes
    }

    try {
      await signupManager(requestBody)
      alert('매니저 지원이 완료되었습니다.')
      setAddress("", 0, 0, "");
      navigate('/managers/auth/login')
    } catch (err: any) {
      alert(err.message || '매니저 지원 실패')
    }
  };

  const [uploading, setUploading] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)

  return (
    <Fragment>
      <div className="flex min-h-screen w-full items-start justify-center bg-slate-50 p-10">
        <div className="flex w-[900px] flex-col gap-10 rounded-xl bg-white p-10 shadow">
          <div className="justify-start self-stretch text-center font-['Inter'] text-3xl leading-loose font-bold text-slate-800">
            매니저 지원
          </div>

          {/* 기본 정보 */}
          <div className="flex flex-col gap-6">
            <div className="font-['Inter'] text-lg leading-loose font-bold font-semibold text-slate-800">
              기본 정보
            </div>

            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-['Inter'] text-sm leading-none font-medium whitespace-nowrap text-slate-700">
                    연락처 *
                  </span>
                  <span className="text-xs text-gray-400">
                    ※ 숫자만 입력하면 하이픈(-)이 자동으로 추가됩니다.
                  </span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="010-0000-0000"
                  className="h-12 rounded-lg bg-slate-50 px-4 text-sm text-slate-700 placeholder-slate-400 outline outline-1 outline-slate-200"
                />
                {errors.phone && !form.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
                {errors.phoneFormat && (
                  <p className="text-xs text-red-500">{errors.phoneFormat}</p>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                  이메일 *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="이메일 주소"
                  className="h-12 rounded-lg bg-slate-50 px-4 text-sm text-slate-700 placeholder-slate-400 outline outline-1 outline-slate-200"
                />
                {errors.email && !form.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
                {errors.emailFormat && (
                  <p className="text-xs text-red-500">{errors.emailFormat}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-['Inter'] text-sm leading-none font-medium whitespace-nowrap text-slate-700">
                    비밀번호 *
                  </span>
                  <span className="text-xs text-gray-400">
                    ※ 8~20자, 대/소문자·숫자·특수문자 중 3가지 이상 포함
                  </span>
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호"
                  className="h-12 rounded-lg bg-slate-50 px-4 text-sm text-slate-700 placeholder-slate-400 outline outline-1 outline-slate-200"
                />
                {errors.password && !form.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                  비밀번호 확인 *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호"
                  className="h-12 rounded-lg bg-slate-50 px-4 text-sm text-slate-700 placeholder-slate-400 outline outline-1 outline-slate-200"
                />
                {errors.confirmPassword && !form.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                  이름 *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  placeholder="이름"
                  className="h-12 rounded-lg bg-slate-50 px-4 text-sm text-slate-700 placeholder-slate-400 outline outline-1 outline-slate-200"
                />
                {errors.userName && !form.userName && (
                  <p className="text-xs text-red-500">{errors.userName}</p>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                  생년월일 *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="h-12 rounded-lg bg-slate-50 px-4 text-sm text-slate-700 outline outline-1 outline-slate-200"
                />
                {errors.birthDate && !form.birthDate && (
                  <p className="text-xs text-red-500">{errors.birthDate}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                  성별 *
                </label>
                <div className="flex h-12 gap-3">
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={form.gender === 'MALE'}
                      onChange={handleChange}
                      className="peer hidden"
                    />
                    <div className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-slate-50 px-4 text-sm font-medium text-slate-700 outline outline-1 outline-slate-200 transition peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:outline-indigo-600 peer-hover:bg-slate-50 hover:bg-indigo-100 peer-checked:hover:bg-indigo-600">
                      남
                    </div>
                  </label>

                  <label className="flex-1">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={form.gender === 'FEMALE'}
                      onChange={handleChange}
                      className="peer hidden"
                    />
                    <div className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-slate-50 px-4 text-sm font-medium text-slate-700 outline outline-1 outline-slate-200 transition peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:outline-indigo-600 peer-hover:bg-slate-50 hover:bg-indigo-100 peer-checked:hover:bg-indigo-600">
                      여
                    </div>
                  </label>
                </div>
                {errors.gender && !form.gender && (
                  <p className="text-xs text-red-500">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* 주소 입력 */}
            <AddressSearch
              roadAddress={roadAddress}
              detailAddress={detailAddress}
              errors={errors.address}
              setRoadAddress={val =>
                setAddress(val, latitude ?? 0, longitude ?? 0, detailAddress)
              }
              setDetailAddress={val =>
                setAddress(roadAddress, latitude ?? 0, longitude ?? 0, val)
              }
            />
          </div>

          {/* 프로필 정보 */}
          <div className="flex flex-col gap-6">
            <div className="text-lg font-semibold text-slate-800">
              프로필 정보
            </div>
            <div className="flex gap-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-[60px] bg-slate-100 overflow-hidden">
                {previewFile ? (
                  <img
                    src={URL.createObjectURL(previewFile)}
                    alt="프로필 미리보기"
                    className="h-28 w-28 object-cover rounded-[60px]"
                  />
                ) : (
                  <span className="material-symbols-outlined inline-block text-[64px] leading-none text-slate-500">
                    face
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                  프로필 사진 *
                </label>
                {errors.profileImageId && !form.profileImageId && (
                  <p className="text-xs text-red-500">
                    {errors.profileImageId}
                  </p>
                )}
                <label className="flex h-10 w-40 items-center justify-center rounded-md bg-slate-50 px-4 text-sm font-medium text-slate-700 outline outline-1 outline-slate-200 cursor-pointer">
                  파일 선택
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async e => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        setPreviewFile(file);
                        setUploading(true);
                        try {
                          const fileId = await createFileGroup([file]);
                          setForm(prev => ({ ...prev, profileImageId: fileId }));
                        } catch (err) {
                          alert("프로필 사진 업로드에 실패했습니다.");
                        } finally {
                          setUploading(false);
                        }
                      }
                    }}
                  />
                </label>
                {uploading && (
                  <div className="text-xs text-indigo-600 mt-1">업로드 중...</div>
                )}
                <p className="text-xs text-slate-500">
                  JPG, PNG 파일 (최대 10MB)
                </p>
              </div>
            </div>

            {/* 한줄소개 */}
            <div className="flex w-full flex-col gap-2">
              <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                한줄소개 *
              </label>
              <input
                type="text"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="자신을 소개하는 한 줄을 작성해주세요"
                className="h-12 rounded-lg bg-slate-50 px-4 text-sm text-slate-700 placeholder-slate-400 outline outline-1 outline-slate-200"
              />
              {errors.bio && !form.bio && (
                <p className="text-xs text-red-500">{errors.bio}</p>
              )}
            </div>

            {/* 업무 가능 시간 */}
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                  업무 가능 시간 *
                </label>
                <p className="text-xs text-slate-500">
                  가능한 시간대를 선택해주세요.
                </p>
                {errors.availableTimes && form.availableTimes.length === 0 && (
                  <p className="text-xs text-red-500">
                    {errors.availableTimes}
                  </p>
                )}
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

              {/* 선택된 시간 영역 */}
              {Object.values(selectedTimes).some(set => set.size > 0) && (
                <div className="mt-4 w-full rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-['Inter'] text-sm leading-none font-medium text-slate-700">
                      선택된 업무 가능 시간
                    </div>
                    <button
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
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="termsAgreed"
              checked={form.termsAgreed}
              onChange={handleChange}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="text-sm text-slate-700">
              이용약관 및 개인정보 처리방침에 동의합니다
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="h-12 w-full rounded-lg bg-indigo-600 text-base font-semibold text-white transition hover:bg-indigo-700">
            지원하기
          </button>
        </div>
      </div>
    </Fragment>
  )
}
