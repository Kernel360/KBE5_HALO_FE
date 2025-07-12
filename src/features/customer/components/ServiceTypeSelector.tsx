import React from 'react'
import { Sparkles, Check } from 'lucide-react'
import type { ServiceCategoryTreeType } from '@/features/customer/types/CustomerReservationType'

interface ServiceTypeSelectorProps {
  categories: ServiceCategoryTreeType[]
  selectedServiceId: number
  selectedAdditionalServiceIds: number[]
  onServiceChange: (serviceId: number) => void
  onAdditionalServiceChange: (serviceIds: number[]) => void
}

export const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  categories,
  selectedServiceId,
  selectedAdditionalServiceIds,
  onServiceChange,
  onAdditionalServiceChange
}) => {
  const selectedMain = categories.find(c => c.serviceId === selectedServiceId)
  const children = selectedMain?.children ?? []
  const includedServices = children.filter(item => item.price === 0)
  const additionalItems = children.filter(item => item.price > 0)

  const handleAdditionalServiceToggle = (
    serviceId: number,
    checked: boolean
  ) => {
    const newIds = checked
      ? [...selectedAdditionalServiceIds, serviceId]
      : selectedAdditionalServiceIds.filter(id => id !== serviceId)
    onAdditionalServiceChange(newIds)
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Sparkles
          size={18}
          className="text-indigo-600"
        />
        서비스 종류
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {categories.map(cat => (
          <label
            key={cat.serviceId}
            className={`flex cursor-pointer flex-col items-center rounded-xl border-2 px-5 py-6 shadow-sm transition-none select-none ${
              selectedServiceId === cat.serviceId
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white'
            } `}>
            <div className="mb-3 flex w-full justify-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  selectedServiceId === cat.serviceId
                    ? 'bg-indigo-600'
                    : 'bg-gray-200'
                }`}>
                {selectedServiceId === cat.serviceId && (
                  <Check
                    size={14}
                    className="text-white"
                  />
                )}
              </div>
            </div>
            <input
              type="radio"
              name="mainService"
              value={cat.serviceId}
              checked={selectedServiceId === cat.serviceId}
              onChange={e => onServiceChange(Number(e.target.value))}
              className="hidden"
            />
            <div className="mb-2 w-full truncate text-center text-base font-bold text-gray-900">
              {cat.serviceName}
            </div>
            <div className="my-2 w-full border-t border-gray-100" />
            <div className="flex w-full flex-col gap-1 text-center">
              {(() => {
                const hasPrice =
                  cat.price !== undefined &&
                  cat.price !== null &&
                  Number(cat.price) > 0
                const hasTime =
                  cat.serviceTime !== undefined &&
                  cat.serviceTime !== null &&
                  Number(cat.serviceTime) > 0

                if (!hasPrice && !hasTime) {
                  return (
                    <div className="text-xs text-gray-400">
                      서비스 준비중 입니다
                    </div>
                  )
                }

                return (
                  <>
                    {hasPrice && (
                      <div className="text-xs font-semibold text-indigo-600">
                        {cat.price.toLocaleString()}원
                      </div>
                    )}
                    {hasTime && (
                      <div className="text-xs text-gray-500">
                        {cat.serviceTime}시간
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </label>
        ))}
      </div>

      {includedServices.length > 0 ? (
        <>
          <div className="text-sm font-medium text-gray-700">포함 서비스</div>
          <div className="flex flex-wrap gap-2">
            {includedServices.map(item => (
              <div
                key={item.serviceId}
                className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                <div className="text-sm text-gray-900">{item.serviceName}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        selectedMain?.description && (
          <div className="text-sm whitespace-pre-wrap text-gray-500">
            {selectedMain.description}
          </div>
        )
      )}

      {additionalItems.length > 0 && (
        <>
          <div className="mt-4 text-sm font-medium text-gray-700">
            서비스 추가
          </div>
          <div className="grid grid-cols-3 gap-2">
            {additionalItems.map(item => (
              <label
                key={item.serviceId}
                className={`cursor-pointer rounded border-2 bg-white p-2 text-sm transition-none ${
                  selectedAdditionalServiceIds.includes(item.serviceId)
                    ? 'border-indigo-500 font-semibold text-indigo-900'
                    : 'border-gray-200 text-gray-900'
                }`}>
                <input
                  type="checkbox"
                  checked={selectedAdditionalServiceIds.includes(
                    item.serviceId
                  )}
                  onChange={e =>
                    handleAdditionalServiceToggle(
                      item.serviceId,
                      e.target.checked
                    )
                  }
                  className="hidden"
                />
                <div className="flex flex-col items-start gap-0.5">
                  <div className="truncate font-medium text-gray-900">
                    {item.serviceName}
                  </div>
                  {item.description && (
                    <div className="truncate text-xs text-gray-500">
                      {item.description}
                    </div>
                  )}
                  {item.price !== undefined &&
                    item.price !== null &&
                    Number(item.price) > 0 && (
                      <div className="text-xs font-semibold text-indigo-600">
                        +{item.price.toLocaleString()}원
                      </div>
                    )}
                  {item.serviceTime !== undefined &&
                    item.serviceTime !== null &&
                    Number(item.serviceTime) > 0 && (
                      <div className="text-xs text-gray-500">
                        +{item.serviceTime}시간
                      </div>
                    )}
                </div>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
