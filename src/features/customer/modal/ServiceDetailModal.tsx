import React from 'react'
import { X } from 'lucide-react'
import type { ServiceCategoryTreeType } from '@/features/customer/types/CustomerReservationType'

interface ServiceDetailModalProps {
  isOpen: boolean
  onClose: () => void
  service: ServiceCategoryTreeType | null
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  service
}) => {
  if (!isOpen || !service) return null

  // 포함 서비스 (무료, price = 0)
  const includedServices = service.children.filter(child => child.price === 0)

  // 추가 서비스 (유료, price > 0)
  const additionalServices = service.children.filter(child => child.price > 0)

  return (
    <>
      <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="max-h-[80vh] w-[400px] overflow-hidden rounded-2xl border border-indigo-300 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#6366F1] px-6 py-4 text-white">
            <h2 className="text-lg font-bold">
              {service.serviceName} 상세정보
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-[calc(80vh-80px)] overflow-y-auto p-5">
            {/* 서비스 기본 정보 */}
            <div className="mb-5 rounded-lg bg-gray-50 p-3">
              <h3 className="mb-2 text-base font-bold text-gray-900">
                서비스 개요
              </h3>
              <p className="mb-3 text-sm text-gray-700">
                {service.description}
              </p>
            </div>

            {/* 포함 서비스 */}
            {includedServices.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  포함 서비스
                </div>
                <div className="flex flex-wrap gap-2">
                  {includedServices.map(item => (
                    <div
                      key={item.serviceId}
                      className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1">
                      <div className="text-xs text-gray-900">
                        {item.serviceName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추가 서비스 */}
            {additionalServices.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700">
                  추가 서비스 (선택사항)
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {additionalServices.map(item => (
                    <div
                      key={item.serviceId}
                      className="cursor-pointer rounded border border-gray-200 bg-white p-2 text-xs">
                      <div className="flex flex-col items-start gap-1">
                        <div className="font-medium text-gray-900">
                          {item.serviceName}
                        </div>
                        {item.description && (
                          <div className="text-xs leading-relaxed text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 안내사항 */}
            <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <h3 className="mb-1 text-xs font-bold text-yellow-800">
                이용 안내
              </h3>
              <div className="text-xs text-yellow-800">
                • 서비스 시간은 현장 상황에 따라 변동될 수 있습니다.
                <br />• 추가 서비스는 예약 시 선택하실 수 있습니다.
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
