import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signupAdmin, updateAdminAccount } from '@/features/admin/api/adminAuth'
import type { createAdminSignup } from '@/features/admin/types/AdminAuthType'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import FormField from '@/shared/components/ui/FormField'
import Toast from '@/shared/components/ui/toast/Toast'
import SuccessToast from '@/shared/components/ui/toast/SuccessToast'

// 전화번호 자동 하이픈 포맷 함수
function formatPhoneNumber(value: string) {
  const numbersOnly = value.replace(/\D/g, '')
  if (numbersOnly.length < 4) return numbersOnly
  if (numbersOnly.length < 7) {
    return numbersOnly.replace(/(\d{3})(\d{1,3})/, '$1-$2')
  }
  if (numbersOnly.length < 11) {
    return numbersOnly.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3')
  }
  return numbersOnly.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3')
}

interface AdminAccountFormProps {
  mode?: 'edit' | 'create'
  adminData?: Record<string, unknown>
  onClose?: () => void
  isModal?: boolean
}

export const AdminAccountForm = ({
  mode = 'create',
  adminData,
  onClose
}: AdminAccountFormProps) => {
  const isEditMode = mode === 'edit'
  const adminId =
    typeof adminData?.adminId === 'string' ||
    typeof adminData?.adminId === 'number'
      ? adminData.adminId
      : undefined
  const [form, setForm] = useState<createAdminSignup & {
    currentPassword?: string
    newPassword?: string
    confirmNewPassword?: string
  }>({
    userName:
      isEditMode && typeof adminData?.userName === 'string'
        ? adminData.userName
        : '',
    email:
      isEditMode && typeof adminData?.email === 'string'
        ? adminData.email : '',
    password: '',
    phone:
      isEditMode && typeof adminData?.phone === 'string'
        ? adminData.phone : '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const navigate = useNavigate()

  // 새 비밀번호 입력란에 값이 없을 때 확인/현재 비밀번호 입력란 값, 에러 초기화
  useEffect(() => {
    if (isEditMode && !form.newPassword) {
      setForm(f => ({ ...f, confirmNewPassword: '', currentPassword: '' }))
      setErrors(e => ({ ...e, confirmNewPassword: '', currentPassword: '' }))
    }
  }, [form.newPassword, isEditMode])

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!isEditMode && !form.userName.trim())
      newErrors.userName = '이름을 입력하세요.';
    // 이메일은 추가 모드에서만 필수
    if (!isEditMode) {
      if (!form.email.trim()) {
        newErrors.email = '이메일을 입력하세요.';
      } else {
        // 이메일 유효성 검사
        const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(form.email)) {
          newErrors.email = '유효한 이메일 주소를 입력하세요.';
        }
      }
    } else {
      // 수정 모드에서는 이메일이 입력되어 있을 때만 유효성 검사
      if (form.email.trim()) {
        const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(form.email)) {
          newErrors.email = '유효한 이메일 주소를 입력하세요.';
        }
      }
    }
    if (!isEditMode && !(form.password ?? '').trim())
      newErrors.password = '비밀번호를 입력하세요.';
    if (!isEditMode && !form.phone.trim()) {
      newErrors.phone = '전화번호를 입력하세요.';
    } else if (!isEditMode && form.phone) {
      // 전화번호 유효성 검사 (010-1234-5678 또는 01012345678)
      const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
      if (
        !phoneRegex.test(form.phone.replace(/-/g, '')) &&
        !phoneRegex.test(form.phone)
      ) {
        newErrors.phone = '유효한 전화번호를 입력하세요. (예: 010-1234-5678)';
      }
    }
    // 아코디언이 열려 있을 때만 비밀번호 변경 유효성 검사
    if (isEditMode && form.newPassword) {
      if (!form.currentPassword) {
        newErrors.currentPassword = '현재 비밀번호를 입력하세요.';
      }
      if (!form.newPassword) {
        newErrors.newPassword = '새 비밀번호를 입력하세요.';
      } else if (form.newPassword.length < 8) {
        newErrors.newPassword = '새 비밀번호는 8자 이상이어야 합니다.';
      }
      if (!form.confirmNewPassword) {
        newErrors.confirmNewPassword = '새 비밀번호 확인을 입력하세요.';
      } else if (form.newPassword !== form.confirmNewPassword) {
        newErrors.confirmNewPassword = '새 비밀번호가 일치하지 않습니다.';
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  };

  // 모든 입력값이 빈칸인지 체크 (수정 모드에서만 사용)
  const isAllFieldsEmpty = isEditMode &&
    !form.userName.trim() &&
    !form.phone.trim() &&
    !form.email.trim() &&
    !(form.password ?? '').trim();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 수정 모드에서도 모든 필드 수정 가능하게 변경 (아래 조건 제거)
    // if (isEditMode && name !== 'email') return;
    if (name === 'phone') {
      setForm(prev => ({ ...prev, [name]: formatPhoneNumber(value) }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
    setErrors(prev => ({ ...prev, [name]: '' }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditMode && adminId) {
        // 이름, 전화번호, 이메일은 항상 수정 가능, 비밀번호는 변경 요청이 있을 때만 resetPwd로 포함
        const updateData: any = {
          adminId: adminId,
          userName: form.userName,
          phone: form.phone,
          email: form.email,
        }
        if (form.newPassword) {
          updateData.resetPwd = {
            currentPassword: form.currentPassword ?? '',
            newPassword: form.newPassword ?? '',
            confirmPassword: form.confirmNewPassword ?? '',
          }
        }
        await updateAdminAccount(adminId, updateData)
        setSuccessToastMsg('관리자 정보가 수정되었습니다.')
      } else {
        await signupAdmin(form)
        setSuccessToastMsg('관리자 등록이 완료되었습니다.')
      }
      if (onClose) {
        setTimeout(() => onClose(), 1200)
      } else {
        setTimeout(() => navigate('/admin/accounts'), 1200)
      }
    } catch (err: any) {
      // Extract backend error message if available
      let backendMsg = err?.response?.data?.message || err?.message || err?.toString() || (isEditMode ? '관리자 수정 실패' : '관리자 등록 실패')
      setToastMsg(backendMsg)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Toast
        open={!!toastMsg}
        message={toastMsg || ""}
        onClose={() => setToastMsg(null)}
      />
      <SuccessToast
        open={!!successToastMsg}
        message={successToastMsg || ""}
        onClose={() => setSuccessToastMsg(null)}
      />
      {/* 안내/주의사항 카드 */}
      <Card className="w-full max-w-md mb-8 md:mb-0 p-8" variant="login">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-indigo-700">
          <span className="material-symbols-outlined text-indigo-500">
            info
          </span>
          {isEditMode ? '관리자 계정 수정 안내' : '관리자 계정 등록 안내'}
        </h3>
        {isEditMode ? (
          <ul className="list-disc space-y-2 pl-4 text-sm text-gray-700">
            <li><b>중복된 전화번호는 사용할 수 없습니다.</b></li>
            <li>수정 후 반드시 변경된 정보를 확인해 주세요.</li>
          </ul>
        ) : (
          <ul className="list-disc space-y-2 pl-4 text-sm text-gray-700">
            <li>
              관리자 계정은 서비스 운영 및 관리 권한을 가지므로 신중히 등록해
              주세요.
            </li>
            <li>이메일은 로그인 ID로 사용되며, 중복 등록이 불가합니다.</li>
            <li>
              비밀번호는 8자 이상, 영문/숫자/특수문자를 조합해 설정해 주세요.
            </li>
            <li>전화번호는 정확히 입력해 주세요. (예: 010-1234-5678)</li>
            <li>계정 정보는 등록 후 수정이 제한될 수 있습니다.</li>
            <li>권한이 없는 사용자의 계정 등록을 방지해 주세요.</li>
          </ul>
        )}
      </Card>
      {/* 등록/수정 폼 카드 */}
      <Card className="w-full max-w-md p-8" variant="login">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "관리자 계정 수정" : "관리자 계정 등록"}
          </h2>
        </div>
        {!isEditMode && (
          <p className="text-sm text-gray-500 mb-6">
            필수 정보를 입력해 주세요.
          </p>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <FormField
            label="이름"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="예) 홍길동"
            required={!isEditMode}
            error={errors.userName}
          />
          <FormField
            label="전화번호"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="예) 010-1234-5678"
            required={!isEditMode}
            error={errors.phone}
          />
          <FormField
            label="이메일"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="예) admin@email.com"
            required={!isEditMode}
            error={errors.email}
          />
          {!isEditMode ? (
            <FormField
              label="비밀번호"
              name="password"
              type={showNewPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
              error={errors.password}
              required
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowNewPassword(v => !v)}
                  className="focus:outline-none"
                  aria-label={showNewPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                >
                  <span className="material-symbols-outlined text-gray-400">
                    {showNewPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              }
            />
          ) : (
            <>
              {/* 비밀번호 변경 토글 버튼 제거, 새 비밀번호 입력란은 항상 보임 */}
              <div className="mb-2">
                <FormField
                  label="새 비밀번호"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                  autoComplete="new-password"
                  error={errors.newPassword}
                  rightIcon={
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowNewPassword(v => !v)}
                      className="focus:outline-none"
                      aria-label={showNewPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                    >
                      <span className="material-symbols-outlined text-gray-400">
                        {showNewPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  }
                />
                <div
                  style={{
                    maxHeight: form.newPassword ? 200 : 0,
                    opacity: form.newPassword ? 1 : 0,
                    transition: 'max-height 0.3s, opacity 0.3s',
                    overflow: 'hidden',
                  }}
                >
                  <div className="mt-3 space-y-3">
                    <FormField
                      label="새 비밀번호 확인"
                      name="confirmNewPassword"
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      value={form.confirmNewPassword}
                      onChange={handleChange}
                      placeholder="새 비밀번호를 다시 입력하세요"
                      autoComplete="new-password"
                      error={errors.confirmNewPassword}
                      rightIcon={
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirmNewPassword(v => !v)}
                          className="focus:outline-none"
                          aria-label={showConfirmNewPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                        >
                          <span className="material-symbols-outlined text-gray-400">
                            {showConfirmNewPassword ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                      }
                    />
                    <FormField
                      label="현재 비밀번호"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={form.currentPassword}
                      onChange={handleChange}
                      placeholder="현재 비밀번호를 입력하세요"
                      autoComplete="current-password"
                      error={errors.currentPassword}
                      rightIcon={
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowCurrentPassword(v => !v)}
                          className="focus:outline-none"
                          aria-label={showCurrentPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                        >
                          <span className="material-symbols-outlined text-gray-400">
                            {showCurrentPassword ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="mt-8 flex gap-2">
            <Button
              type="button"
              className="h-12 w-1/2 min-w-[180px] rounded-xl border border-gray-300 bg-white text-base font-semibold text-gray-600 shadow transition hover:bg-gray-100"
              onClick={() => {
                if (onClose) onClose();
                else navigate('/admin/accounts');
              }}
            >
              취소
            </Button>
            <Button
              type="submit"
              className={`flex h-12 w-1/2 min-w-[180px] items-center justify-center gap-2 rounded-xl text-base font-semibold shadow-lg transition active:scale-95
                ${loading || isAllFieldsEmpty
                  ? 'bg-gray-300 text-gray-400 cursor-not-allowed hover:bg-gray-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'}
              `}
              disabled={loading || isAllFieldsEmpty}
            >
              {loading ? (
                <svg
                  className="mr-2 h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                <span className="material-symbols-outlined text-white">
                  {isEditMode ? 'edit' : 'add'}
                </span>
              )}
              <span className="base font-semibold text-white">
                {isEditMode ? '관리자 수정하기' : '관리자 등록하기'}
              </span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
