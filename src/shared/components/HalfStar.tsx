// src/shared/components/HalfStar.tsx

import React from 'react'

// Define the rounded star path (can also be imported if defined elsewhere)
const ROUNDED_STAR_PATH_D =
  'M12 2c1.3 0 2.4.8 2.8 2.1l1.3 3.9 4.3.6c1 .2 1.4 1.4.7 2.2l-3.3 2.9.8 4.2c.2 1-.9 1.8-1.7 1.2L12 17.5l-3.7 2.3c-.8.5-1.9-.3-1.7-1.2l.8-4.2-3.3-2.9c-.7-.8-.3-2 .7-2.2l4.3-.6 1.3-3.9c.4-1.3 1.5-2.1 2.8-2.1z'

interface HalfStarProps {
  className?: string
  fillColor?: string
  emptyColor?: string
}

const HalfStar: React.FC<HalfStarProps> = ({
  className = 'w-4 h-4',
  fillColor = 'text-yellow-400',
  emptyColor = 'text-gray-200'
}) => {
  const clipId = React.useMemo(
    () => `half-star-clip-${Math.random().toString(36).substr(2, 9)}`,
    []
  )

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {/* 빈 별 (배경) - 투명한 상태로 두어 채워진 부분만 보이게 함 */}
      <svg
        className={`absolute top-0 left-0 ${emptyColor}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d={ROUNDED_STAR_PATH_D}
          fill="currentColor"
        />{' '}
        {/* emptyColor로 채워짐 */}
      </svg>

      {/* 채워진 별 (앞면 - 클리핑될 부분) */}
      <svg
        className={`absolute top-0 left-0 ${fillColor}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={clipId}>
            {/* SVG 뷰박스 (24x24)의 왼쪽 절반 (0에서 12까지)만 클리핑 */}
            <rect
              x="0"
              y="0"
              width="12"
              height="24"
            />
          </clipPath>
        </defs>
        <path
          d={ROUNDED_STAR_PATH_D}
          fill="currentColor" // fillColor로 채워짐
          clipPath={`url(#${clipId})`}
        />
      </svg>
    </div>
  )
}

export default HalfStar
