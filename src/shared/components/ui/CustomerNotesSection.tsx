import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'

interface CustomerNote {
  id: number
  content: string
  tag: 'preference' | 'attention' | 'special' | 'general'
  createdAt: string
  createdBy: string
}

interface CustomerNotesSectionProps {
  notes: CustomerNote[]
  onAddNote: (note: string, tag: string) => void
  onDeleteNote?: (noteId: number) => void
}

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'preference':
      return 'bg-blue-100 text-blue-800'
    case 'attention':
      return 'bg-red-100 text-red-800'
    case 'special':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTagLabel = (tag: string) => {
  switch (tag) {
    case 'preference':
      return '선호사항'
    case 'attention':
      return '주의사항'
    case 'special':
      return '특이사항'
    default:
      return '일반'
  }
}

export const CustomerNotesSection: React.FC<CustomerNotesSectionProps> = ({
  notes,
  onAddNote,
  onDeleteNote
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('general')

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim(), selectedTag)
      setNewNote('')
      setSelectedTag('general')
      setIsAddingNote(false)
    }
  }

  const handleCancel = () => {
    setNewNote('')
    setSelectedTag('general')
    setIsAddingNote(false)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">고객 메모</h3>
        <Button
          onClick={() => setIsAddingNote(true)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          메모 추가
        </Button>
      </div>

      {/* 메모 추가 폼 */}
      {isAddingNote && (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그 선택
            </label>
            <div className="flex gap-2">
              {[
                { value: 'general', label: '일반' },
                { value: 'preference', label: '선호사항' },
                { value: 'attention', label: '주의사항' },
                { value: 'special', label: '특이사항' }
              ].map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => setSelectedTag(tag.value)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    selectedTag === tag.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메모 내용
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="고객 관련 메모를 입력하세요..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              추가
            </Button>
            <Button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* 메모 목록 */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>등록된 메모가 없습니다.</p>
            <p className="text-sm">고객 관련 특이사항을 기록해보세요.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-3 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTagColor(note.tag)}`}>
                    {getTagLabel(note.tag)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()} | {note.createdBy}
                  </span>
                </div>
                {onDeleteNote && (
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

export default CustomerNotesSection 