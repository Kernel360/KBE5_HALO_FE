import React from 'react'
import { Card } from './Card'
import { CardContent } from './CardContent'
import { Button } from './Button'
import FormField from './FormField'
import { Input } from './Input'
import { Eye, EyeOff } from 'lucide-react'

export interface LoginCardProps {
  title1: string
  title2?: string
  subtitle?: string
  phoneLabel?: string
  phonePlaceholder?: string
  phoneValue: string
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  phoneError?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  passwordValue: string
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  passwordError?: string
  showPasswordToggle?: boolean
  showPassword?: boolean
  onToggleShowPassword?: () => void
  onSubmit: (e: React.FormEvent) => void
  buttonText?: string
  loading?: boolean
  bottomText?: React.ReactNode
  className?: string
}

export const LoginCard: React.FC<LoginCardProps> = ({
  title1,
  title2,
  subtitle,
  phoneLabel = '연락처',
  phonePlaceholder = '숫자만 입력하세요 (예: 01012345678)',
  phoneValue,
  onPhoneChange,
  phoneError,
  passwordLabel = '비밀번호',
  passwordPlaceholder = '비밀번호를 입력하세요',
  passwordValue,
  onPasswordChange,
  passwordError,
  showPasswordToggle = false,
  showPassword = false,
  onToggleShowPassword,
  onSubmit,
  buttonText = '로그인',
  loading = false,
  bottomText,
  className = ''
}) => {
  return (
    <Card variant="login" className={`w-[480px] flex-col gap-0 p-0 ${className}`}>
      {/* 상단 영역 */}
      <div className="flex flex-col items-center gap-1 rounded-t-2xl border-b border-gray-100 bg-gradient-to-b from-indigo-50 to-white pt-10 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo-700">{title1}</span>
          {title2 && (
            <span className="ml-2 text-base font-semibold text-gray-500">
              {title2}
            </span>
          )}
        </div>
        {subtitle && (
          <div className="mt-1 text-xs text-gray-400">{subtitle}</div>
        )}
      </div>
      {/* 폼 영역 */}
      <CardContent className="flex flex-col gap-7 rounded-b-2xl bg-white p-10">
        <form className="flex flex-col gap-7" onSubmit={onSubmit}>
          {/* 연락처 */}
          <FormField
            label={phoneLabel}
            name="login-phone"
            type="tel"
            value={phoneValue}
            onChange={onPhoneChange}
            placeholder={phonePlaceholder}
            required
            error={phoneError}
          />
          {/* 비밀번호 */}
          {showPasswordToggle ? (
            <div className="mb-4">
              <label className="mb-1 block font-medium text-gray-700">
                {passwordLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  name="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordValue}
                  onChange={onPasswordChange}
                  placeholder={passwordPlaceholder}
                  required
                  className={`h-11 w-full appearance-none rounded-md border bg-gray-50 px-4 text-sm text-gray-900 transition invalid:shadow-none invalid:outline-none focus:outline-none ${
                    passwordError
                      ? 'border-red-400 ring-1 ring-red-100 focus:border-red-500'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  onClick={onToggleShowPassword}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? <Eye className="h-5 w-5 text-gray-500" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
              {passwordError && (
                <div className="relative mt-1">
                  <div className="w-fit max-w-full rounded-xl border border-red-200 bg-white px-3 py-1 text-xs text-red-500 shadow">
                    {passwordError}
                  </div>
                  <div className="absolute -top-2 left-4 h-0 w-0 border-x-8 border-t-0 border-b-8 border-x-transparent border-b-white"></div>
                </div>
              )}
            </div>
          ) : (
            <FormField
              label={passwordLabel}
              name="login-password"
              type="password"
              value={passwordValue}
              onChange={onPasswordChange}
              placeholder={passwordPlaceholder}
              required
              error={passwordError}
            />
          )}
          {/* 로그인 버튼 */}
          <Button
            type="submit"
            className="h-12 w-full rounded-lg bg-indigo-600 text-lg font-bold text-white shadow transition hover:bg-indigo-700 focus:bg-indigo-700"
            disabled={loading}
          >
            {loading ? '로딩...' : buttonText}
          </Button>
        </form>
        {/* 안내 문구 및 하단 커스텀 영역 */}
        {bottomText && <div className="mt-2 text-center text-xs text-gray-400">{bottomText}</div>}
      </CardContent>
    </Card>
  )
} 