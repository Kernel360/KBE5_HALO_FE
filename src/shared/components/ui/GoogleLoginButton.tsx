import React from 'react'

interface GoogleLoginButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white text-base font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 ${className}`}
      style={{ minHeight: '2.75rem' }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_17_40)">
          <path
            d="M19.8052 10.2306C19.8052 9.55089 19.7491 8.86772 19.629 8.20007H10.2V12.0497H15.6262C15.3982 13.2727 14.6692 14.3361 13.6272 15.0179V17.2656H16.6842C18.4382 15.6689 19.8052 13.2217 19.8052 10.2306Z"
            fill="#4285F4"
          />
          <path
            d="M10.2 20.0002C12.897 20.0002 15.1632 19.1102 16.6842 17.2656L13.6272 15.0179C12.8132 15.5779 11.7132 15.9179 10.2 15.9179C7.59401 15.9179 5.38801 14.1049 4.60301 11.7437H1.43896V14.0615C2.96996 17.3672 6.34301 20.0002 10.2 20.0002Z"
            fill="#34A853"
          />
          <path
            d="M4.60301 11.7437C4.39901 11.1837 4.28201 10.5837 4.28201 9.9587C4.28201 9.3337 4.39901 8.7337 4.60301 8.1737V5.85596H1.43896C0.781961 7.1437 0.400024 8.5137 0.400024 9.9587C0.400024 11.4037 0.781961 12.7737 1.43896 14.0615L4.60301 11.7437Z"
            fill="#FBBC05"
          />
          <path
            d="M10.2 4.0837C11.841 4.0837 13.081 4.6537 13.877 5.3997L16.744 2.5327C15.1632 0.8907 12.897 -0.000305176 10.2 -0.000305176C6.34301 -0.000305176 2.96996 2.6327 1.43896 5.85596L4.60301 8.1737C5.38801 5.8127 7.59401 4.0837 10.2 4.0837Z"
            fill="#EA4335"
          />
        </g>
        <defs>
          <clipPath id="clip0_17_40">
            <rect
              width="20"
              height="20"
              fill="white"
            />
          </clipPath>
        </defs>
      </svg>
      <span>구글로 로그인</span>
    </button>
  )
}

export default GoogleLoginButton 