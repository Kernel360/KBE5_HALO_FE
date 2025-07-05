import React, { useState } from "react";
import Card from "./Card";
import Button from "./Button";

interface CustomerQuickActionsProps {
  customerName: string
  customerPhone: string
  onSendMessage?: (message: string) => void
  onProposeBooking?: () => void
  onUpdateGrade?: (grade: string) => void
  onCallCustomer?: () => void
}

export const CustomerQuickActions: React.FC<CustomerQuickActionsProps> = ({
  customerName,
  customerPhone,
  onSendMessage,
  onProposeBooking,
  onUpdateGrade,
  onCallCustomer
}) => {
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [message, setMessage] = useState('')

  const messageTemplates = [
    {
      title: '서비스 완료 감사',
      content: `안녕하세요, ${customerName}님! 오늘 서비스 이용해주셔서 감사합니다. 만족스러우셨나요? 다음에도 더 나은 서비스로 찾아뵙겠습니다. 😊`
    },
    {
      title: '다음 예약 제안',
      content: `${customerName}님, 안녕하세요! 다음주 같은 시간에 정기 서비스 예약은 어떠신가요? 미리 예약하시면 더 편리하실 것 같아요.`
    },
    {
      title: '피드백 요청',
      content: `${customerName}님, 서비스에 대한 솔직한 후기를 남겨주시면 더 나은 서비스 제공에 도움이 됩니다. 감사합니다!`
    },
    {
      title: '특별 할인 안내',
      content: `${customerName}님, 단골고객 특별 할인 이벤트가 있습니다! 다음 예약 시 10% 할인 혜택을 받으실 수 있어요.`
    }
  ]

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim())
      setMessage('')
      setShowMessageModal(false)
      alert('메시지가 전송되었습니다.')
    }
  }

  const applyTemplate = (template: string) => {
    setMessage(template)
  }

  return (
    <>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* 고객에게 메시지 보내기 */}
          <Button
            onClick={() => setShowMessageModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-lg">💬</span>
            <span className="text-sm">메시지 보내기</span>
          </Button>

          {/* 전화 걸기 */}
          <Button
            onClick={() => {
              if (onCallCustomer) {
                onCallCustomer()
              } else {
                window.open(`tel:${customerPhone}`)
              }
            }}
            className="flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span className="text-lg">📞</span>
            <span className="text-sm">전화 걸기</span>
          </Button>

          {/* 다음 예약 제안 */}
          <Button
            onClick={() => {
              if (onProposeBooking) {
                onProposeBooking()
              } else {
                alert('다음 예약 제안 기능은 추후 구현 예정입니다.')
              }
            }}
            className="flex items-center justify-center gap-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <span className="text-lg">📅</span>
            <span className="text-sm">예약 제안</span>
          </Button>

          {/* 고객 등급 업데이트 */}
          <Button
            onClick={() => {
              if (onUpdateGrade) {
                const grade = prompt('새로운 등급을 입력하세요 (VIP, GOLD, SILVER, BRONZE, NORMAL):')
                if (grade) {
                  onUpdateGrade(grade.toUpperCase())
                }
              } else {
                alert('고객 등급 업데이트 기능은 추후 구현 예정입니다.')
              }
            }}
            className="flex items-center justify-center gap-2 p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <span className="text-lg">⭐</span>
            <span className="text-sm">등급 변경</span>
          </Button>
        </div>

        {/* 추가 액션 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => alert('고객 상세 정보 페이지로 이동하는 기능은 추후 구현 예정입니다.')}
              className="w-full p-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              📊 고객 상세 정보 보기
            </Button>
            <Button
              onClick={() => alert('고객 예약 히스토리 페이지로 이동하는 기능은 추후 구현 예정입니다.')}
              className="w-full p-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              📋 예약 히스토리 보기
            </Button>
          </div>
        </div>
      </Card>

      {/* 메시지 전송 모달 */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-[28rem] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {customerName}님에게 메시지 보내기
            </h2>

            {/* 메시지 템플릿 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">빠른 템플릿</h3>
              <div className="grid grid-cols-2 gap-2">
                {messageTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template.content)}
                    className="p-2 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-left"
                  >
                    {template.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 메시지 입력 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메시지 내용
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="고객에게 보낼 메시지를 입력하세요..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                {message.length} / 500자
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              >
                전송
              </Button>
              <Button
                onClick={() => {
                  setShowMessageModal(false)
                  setMessage('')
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CustomerQuickActions 