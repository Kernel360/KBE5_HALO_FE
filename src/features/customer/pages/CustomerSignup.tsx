import React, { useEffect, useState } from "react"
import { signupCustomer } from "@/features/customer/api/customerAuth"
import { useNavigate } from "react-router-dom"
import {
  isValidPhone,
  isValidEmail,
  isValidPassword
} from "@/shared/utils/validation"
import { formatPhoneNumber } from "@/shared/utils/format"
import { Eye, EyeOff } from "lucide-react"
import { useAddressStore } from "@/store/useAddressStore"
import type { CustomerSignupReq } from "../types/CustomerSignupType"
import AddressSearch from "@/shared/components/AddressSearch"
import SuccessToast from "@/shared/components/ui/toast/SuccessToast"
import ErrorToast from "@/shared/components/ui/toast/ErrorToast"
import WarningToast from "@/shared/components/ui/toast/WarningToast"
import { PrivacyPolicyModal } from "../modal/PrivacyPolicyModal"

const today = new Date()
const oneYearAgo = new Date(today)
oneYearAgo.setFullYear(today.getFullYear() - 1)

// yyyy-MM-dd 형식으로 문자열 변환
const maxBirthDate = oneYearAgo.toISOString().split("T")[0]

interface CustomerSignupForm extends CustomerSignupReq {
  termsAgreed: boolean
}

export const CustomerSignup: React.FC = () => {
  const [form, setForm] = useState<CustomerSignupForm>({
    email: "",
    password: "",
    userName: "",
    birthDate: maxBirthDate,
    gender: "MALE",
    phone: "",
    roadAddress: "",
    detailAddress: "",
    latitude: 0,
    longitude: 0,
    termsAgreed: false
  })

  const { setAddress } = useAddressStore() // 주소 정보 상태 (Zustand에서 관리)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successToast, setSuccessToast] = useState({ open: false, message: "" })
  const [errorToast, setErrorToast] = useState({ open: false, message: "" })
  const [warningToast, setWarningToast] = useState({ open: false, message: "" })
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    useAddressStore.getState().setAddress("", 0, 0, "")
    setForm(prev => ({
      ...prev,
      roadAddress: "",
      detailAddress: "",
      latitude: 0,
      longitude: 0
    }))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  // 좌표 정보 업데이트 핸들러
  const handleCoordinatesChange = (lat: number, lng: number) => {
    setForm(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!form.phone.trim()) newErrors.phone = "연락처를 입력해주세요."
    if (!newErrors.phone && !isValidPhone(form.phone))
      newErrors.phoneFormat = "연락처 형식이 올바르지 않습니다."
    if (form.email.trim() && !isValidEmail(form.email))
      newErrors.emailFormat = "이메일 형식이 올바르지 않습니다."
    if (!isValidPassword(form.password))
      newErrors.password =
        "8~20자, 대소문자/숫자/특수문자 중 3가지 이상 포함해야 합니다."
    if (!form.userName.trim()) newErrors.userName = "이름을 입력해주세요."
    if (!form.birthDate) newErrors.birthDate = "생년월일을 선택해주세요."
    if (!form.gender) newErrors.gender = "성별을 선택해주세요."
    if (!form.roadAddress) newErrors.roadAddress = "도로명 주소를 입력해주세요."
    if (!form.detailAddress)
      newErrors.detailAddress = "상세 주소를 입력해주세요."
    if (!form.latitude || !form.longitude)
      newErrors.address = "주소를 다시 검색해주세요."
    if (!form.termsAgreed) newErrors.termsAgreed = "이용약관에 동의해주세요."

    console.log("Validation errors:", newErrors)

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    const isValid = validate()

    if (!isValid) return

    // 좌표 정보 재확인
    if (!form.latitude || !form.longitude) {
      setWarningToast({ open: true, message: "주소를 다시 선택해주세요." })
      return
    }

    const payload: CustomerSignupReq = {
      ...form
    }

    try {
      setIsSubmitting(true)
      await signupCustomer(payload)
      setSuccessToast({ open: true, message: "회원가입 성공하였습니다." })
      setAddress("", 0, 0, "")
      setTimeout(() => navigate("/auth/login"), 2500)
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "회원가입에 실패했습니다."
      setErrorToast({ open: true, message })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex w-full justify-center px-4 py-12">
      <SuccessToast
        open={successToast.open}
        message={successToast.message}
        onClose={() => setSuccessToast({ open: false, message: "" })}
      />
      <ErrorToast
        open={errorToast.open}
        message={errorToast.message}
        onClose={() => setErrorToast({ open: false, message: "" })}
      />
      <WarningToast
        open={warningToast.open}
        message={warningToast.message}
        onClose={() => setWarningToast({ open: false, message: "" })}
      />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[640px] space-y-6 rounded-xl px-10 py-12 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-zinc-800">
          회원가입
        </h2>
        <p className="text-center text-sm text-zinc-500">
          HaloCare 서비스를 이용하기 위한 계정을 만들어주세요
        </p>

        {/* 연락처 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-700">연락처</label>
          <input
            name="phone"
            type="tel"
            className="input"
            placeholder="숫자만 입력하세요 (예: 01012345678)"
            value={form.phone}
            disabled={isSubmitting}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                phone: formatPhoneNumber(e.target.value)
              }))
            }
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
          {errors.phoneFormat && (
            <p className="text-xs text-red-500">{errors.phoneFormat}</p>
          )}
        </div>

        {/* 이메일 (선택) */}
        <div>
          <label className="text-sm font-medium text-zinc-700">
            이메일 <span className="text-xs text-gray-400">(선택)</span>
          </label>
          <input
            name="email"
            className="input"
            value={form.email}
            disabled={isSubmitting}
            onChange={handleChange}
            placeholder="example@email.com"
          />
          {form.email && errors.emailFormat && (
            <p className="text-xs text-red-500">{errors.emailFormat}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="relative">
          <label className="text-sm font-medium text-zinc-700">비밀번호</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className="input pr-10"
            value={form.password}
            disabled={isSubmitting}
            onChange={e => {
              handleChange(e)
              if (errors.password)
                setErrors(prev => ({ ...prev, password: "" }))
            }}
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
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* 이름 */}
        <div>
          <label className="text-sm font-medium text-zinc-700">
            이름 (한글)
          </label>
          <input
            name="userName"
            className="input"
            value={form.userName}
            disabled={isSubmitting}
            onChange={handleChange}
            placeholder="홍길동"
          />
          {errors.userName && (
            <p className="text-xs text-red-500">{errors.userName}</p>
          )}
        </div>

        {/* 생년월일 + 성별 */}
        <div className="flex space-x-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-zinc-700">
              생년월일
            </label>
            <input
              type="date"
              name="birthDate"
              className="input"
              value={form.birthDate || maxBirthDate}
              disabled={isSubmitting}
              onChange={handleChange}
              max={maxBirthDate}
            />
            {errors.birthDate && (
              <p className="mt-1 text-xs text-red-500">{errors.birthDate}</p>
            )}
          </div>
          <div className="w-28">
            <label className="text-sm font-medium text-zinc-700">성별</label>
            <select
              name="gender"
              value={form.gender}
              disabled={isSubmitting}
              onChange={handleChange}
              className="input">
              <option value="MALE">남</option>
              <option value="FEMALE">여</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender}</p>
            )}
          </div>
        </div>

        {/* 주소 - 수정된 부분 */}
        <AddressSearch
          roadAddress={form.roadAddress}
          detailAddress={form.detailAddress}
          errors={errors.address}
          setRoadAddress={val => {
            setForm(prev => ({ ...prev, roadAddress: val }))
          }}
          setDetailAddress={val => {
            setForm(prev => ({ ...prev, detailAddress: val }))
          }}
          onCoordinatesChange={handleCoordinatesChange} // 좌표 변경 콜백 추가
        />
        {errors.roadAddress && (
          <p className="text-xs text-red-500">{errors.roadAddress}</p>
        )}
        {errors.detailAddress && (
          <p className="text-xs text-red-500">{errors.detailAddress}</p>
        )}

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
            이용약관 및{" "}
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
        {errors.termsAgreed && (
          <p className="text-xs text-red-500">{errors.termsAgreed}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-md bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400">
          {isSubmitting ? "가입 중..." : "가입하기"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          이미 계정이 있으신가요?{" "}
          <a
            href="/auth/login"
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
  )
}
