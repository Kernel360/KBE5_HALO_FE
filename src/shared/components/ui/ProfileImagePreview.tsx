import React from 'react'
import { UserRound } from 'lucide-react'

interface ProfileImagePreviewProps {
  /** 이미지 URL 또는 File 객체 */
  src?: string | File | null
  /** 대체 텍스트 */
  alt?: string
  /** 이미지 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 커스텀 클래스명 */
  className?: string
  /** 클릭 가능 여부 */
  clickable?: boolean
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void
}

export const ProfileImagePreview: React.FC<ProfileImagePreviewProps> = ({
  src,
  alt = '프로필 이미지',
  size = 'md',
  className = '',
  clickable = false,
  onClick
}) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-28 w-28',
    xl: 'h-32 w-32'
  }

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12'
  }

  // 이미지 URL 생성
  const getImageUrl = () => {
    if (!src) return null
    
    if (typeof src === 'string') {
      return src
    }
    
    if (src instanceof File) {
      return URL.createObjectURL(src)
    }
    
    return null
  }

  const imageUrl = getImageUrl()

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        flex items-center justify-center overflow-hidden rounded-full bg-gray-100 
        ${clickable ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''} 
        ${className}
      `}
      onClick={clickable ? onClick : undefined}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover`}
          onError={(e) => {
            // 이미지 로드 실패 시 기본 아이콘으로 대체
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      ) : (
        <UserRound className={`${iconSizes[size]} text-gray-400`} />
      )}
    </div>
  )
}

export default ProfileImagePreview