import { Input } from './Input'
import { Label } from './Label'
import React from 'react'

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  containerClassName?: string
  labelClassName?: string
  rightIcon?: React.ReactNode // 추가: input 우측에 아이콘 렌더링
}

export const FormField = ({
  label,
  error,
  required,
  containerClassName = '',
  labelClassName = '',
  className = '',
  rightIcon, // 추가
  ...inputProps
}: FormFieldProps) => (
  <div className={`mb-4 ${containerClassName}`}>
    <Label className={`mb-1 block font-medium text-gray-700 ${labelClassName}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <div className="relative">
      <Input
        className={
          `appearance-none invalid:shadow-none invalid:outline-none focus:outline-none ` +
          `h-11 w-full rounded-md border bg-gray-50 px-4 pr-10 text-sm text-gray-900 transition` +
          (inputProps.disabled
            ? 'cursor-not-allowed bg-gray-100 text-gray-300'
            : '') +
          (error
            ? 'border-red-400 ring-1 ring-red-100 focus:border-red-500'
            : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200') +
          ` ${className}`
        }
        {...inputProps}
      />
      {rightIcon && (
        <span className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center">
          {rightIcon}
        </span>
      )}
    </div>
    {error && (
      <div className="relative mt-1">
        <div className="w-fit max-w-full rounded-xl border border-red-200 bg-white px-3 py-1 text-xs text-red-500 shadow">
          {error}
        </div>
        <div className="absolute -top-2 left-4 h-0 w-0 border-x-8 border-t-0 border-b-8 border-x-transparent border-b-white"></div>
      </div>
    )}
  </div>
)

export default FormField
