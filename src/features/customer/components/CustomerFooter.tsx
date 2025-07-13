import { Fragment, useState } from 'react'
import { PrivacyPolicyModal } from '@/features/customer/modal/PrivacyPolicyModal'

export const CustomerFooter = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  return (
    <Fragment>
      <div className="flex flex-col items-start justify-start gap-6 bg-zinc-800 px-4 py-8 sm:gap-8 sm:px-8 sm:py-12 lg:gap-10 lg:px-28 lg:py-14">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center justify-start gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <div className="font-['Inter'] text-base leading-tight font-bold text-indigo-600">
                H
              </div>
            </div>
            <div className="font-['Inter'] text-xl leading-normal font-bold text-white">
              HaloCare
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-end">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="cursor-pointer font-['Inter'] text-sm leading-none font-bold text-white transition-colors hover:text-gray-300">
              개인정보처리방침
            </button>
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-2">
          <div className="w-full font-['Inter'] text-xs leading-relaxed font-normal text-neutral-400 sm:text-sm sm:leading-none">
            주식회사 할로케어 | 대표: 홍길동 | 사업자등록번호: 123-45-67890
          </div>
          <div className="w-full font-['Inter'] text-xs leading-relaxed font-normal text-neutral-400 sm:text-sm sm:leading-none">
            서울특별시 강남구 테헤란로 123 할로케어빌딩 8층
          </div>
          <div className="w-full font-['Inter'] text-xs leading-relaxed font-normal text-neutral-400 sm:text-sm sm:leading-none">
            고객센터: 1588-1234 (평일 09:00-18:00, 주말/공휴일 휴무)
          </div>
          <div className="w-full font-['Inter'] text-xs leading-relaxed font-normal text-neutral-400 sm:text-sm sm:leading-none">
            © 2023 HaloCare. All rights reserved.
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </Fragment>
  )
}
