import React from 'react'

interface Props {
  step: number
}

const steps = [
  { label: '서비스 정보 입력' },
  { label: '매니저 선택' },
  { label: '결제 및 완료' }
]

export const ReservationStepIndicator: React.FC<Props> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-start gap-4 self-stretch bg-white px-4 py-6 sm:gap-8 sm:px-16">
      <div className="self-stretch text-center text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl lg:leading-loose">
        서비스 예약
      </div>
      <div className="flex w-full max-w-xs items-center justify-center sm:max-w-md lg:max-w-4xl">
        {steps.map((s, index) => {
          const isActive = index + 1 === step
          const isDone = index + 1 < step

          // Tailwind CSS classes for colors
          let circleBgClass = 'bg-gray-200' // Default for future steps
          let circleTextClass = 'text-gray-500' // Default text color for future steps
          let labelTextColorClass = 'text-gray-400' // Default label color for future steps

          if (isActive) {
            circleBgClass = 'bg-indigo-600' // Main color for active step
            circleTextClass = 'text-white' // White number for active step
            labelTextColorClass = 'text-indigo-600' // Main color for active label
          } else if (isDone) {
            circleBgClass = 'bg-indigo-400' // Lighter indigo for completed steps
            circleTextClass = 'text-white' // White number for completed step
            labelTextColorClass = 'text-indigo-400' // Lighter indigo for completed label
          }

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <div className="h-px w-8 bg-gray-200 sm:w-12 lg:w-20" />
              )}
              <div className="flex w-20 flex-col items-center justify-start gap-1 sm:w-32 lg:w-48 lg:gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 ${circleBgClass}`}>
                  <div className={`text-sm font-semibold sm:text-base ${circleTextClass}`}>
                    {index + 1}
                  </div>
                </div>
                <div className={`text-xs font-medium text-center sm:text-sm ${labelTextColorClass}`}>
                  {s.label}
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
