import React, { useRef, useState, useEffect } from 'react'
import { Card } from './Card'
import { CardContent } from './CardContent'

export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  features: Array<{
    title: string
    desc: string
    detail: string
  }>
  className?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  subtitle,
  features,
  className = '',
}) => {
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // 팝오버 바깥 클릭 시 닫힘 처리
  useEffect(() => {
    if (openFeatureIndex === null) return
    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setOpenFeatureIndex(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openFeatureIndex])

  return (
    <Card
      ref={cardRef}
      className={`mt-6 flex w-full max-w-xs flex-col gap-0 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-0 shadow md:mt-0 md:max-w-[25rem] ${className}`}
    >
      <div className="flex flex-col gap-2 px-6 pt-8 pb-4 md:px-10 md:pt-10">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
            {icon}
          </span>
          <span className="font-['Inter'] text-lg font-extrabold tracking-tight text-indigo-700 md:text-xl">
            {title}
          </span>
        </div>
        {subtitle && (
          <div className="mt-1 font-['Inter'] text-sm font-semibold text-gray-600 md:text-base">
            {subtitle}
          </div>
        )}
      </div>
      <CardContent className="flex flex-col gap-3 p-4 pt-2 md:p-8">
        {features.map((item, idx) => (
          <div
            key={item.title}
            className="group relative flex cursor-pointer items-center gap-3 rounded-lg bg-indigo-50/0 px-2 py-2 transition hover:bg-indigo-50 md:px-3"
            onClick={() =>
              setOpenFeatureIndex(openFeatureIndex === idx ? null : idx)
            }
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
              {['①', '②', '③', '④', '⑤'][idx]}
            </span>
            <div>
              <div className="text-base font-bold text-gray-900 md:text-base">
                {item.title}
              </div>
              <div className="text-xs text-gray-500 md:text-sm">
                {item.desc}
              </div>
            </div>
            {/* 팝오버 말풍선 */}
            {openFeatureIndex === idx && (
              <div className={`absolute top-full left-1/2 z-20 mt-2 w-[90vw] max-w-xs -translate-x-1/2 md:top-1/2 md:left-full md:mt-0 md:ml-4 md:-translate-x-0 md:-translate-y-1/2`}>
                <div className="animate-fade-in relative w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-lg md:px-4 md:py-3 md:text-sm">
                  {/* 꼬리(삼각형) */}
                  <div className={`absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-0 border-b-8 border-x-transparent border-b-white md:top-1/2 md:left-[-8px] md:-translate-x-0 md:-translate-y-1/2 md:border-x-8 md:border-y-8 md:border-r-8 md:border-b-0 md:border-l-0 md:border-x-transparent md:border-y-transparent md:border-r-white`}></div>
                  {item.detail}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 