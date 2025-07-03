import { Input } from './Input';
import { Label } from './Label';
import React from 'react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
}

export const FormField = ({
  label,
  error,
  required,
  containerClassName = '',
  labelClassName = '',
  className = '',
  ...inputProps
}: FormFieldProps) => (
  <div className={`mb-4 ${containerClassName}`}>
    <Label className={`block text-gray-700 font-medium mb-1 ${labelClassName}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      className={
        `appearance-none focus:outline-none invalid:shadow-none invalid:outline-none ` +
        `w-full h-11 px-4 rounded-md border bg-gray-50 text-gray-900 text-sm transition ` +
        (inputProps.disabled ? 'bg-gray-100 text-gray-300 cursor-not-allowed ' : '') +
        (error
          ? 'border-red-400 focus:border-red-500 ring-1 ring-red-100'
          : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200'
        ) +
        ` ${className}`
      }
      {...inputProps}
    />
    {error && (
      <div className="relative mt-1">
        <div className="bg-white border border-red-200 text-red-500 rounded-xl shadow px-3 py-1 text-xs w-fit max-w-full">
          {error}
        </div>
        <div className="absolute left-4 -top-2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white border-t-0"></div>
      </div>
    )}
  </div>
);

export default FormField; 