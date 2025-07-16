import React from 'react'
import Loading from '@/shared/components/ui/Loading'

export interface AdminTableColumn<T> {
  key: string
  header: React.ReactNode
  render?: (row: T) => React.ReactNode
  className?: string
}

interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[]
  data: T[]
  rowKey: (row: T) => string | number
  onRowClick?: (row: T) => void
  emptyMessage?: string
  className?: string
  loading?: boolean
}

export function AdminTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyMessage = '데이터가 없습니다.',
  className = '',
  loading = false
}: AdminTableProps<T>) {

  return (
    <div className={`relative flex min-h-[50vh] w-full flex-col rounded-lg bg-white shadow ${className}`}>
      <style>{`
        .halo-spinner {
          border: 4px solid #e5e7eb;
          border-top: 4px solid #6366f1;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          animation: halo-spin 1s linear infinite;
        }
        @keyframes halo-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {loading && (
        <div className="bg-opacity-80 absolute inset-0 z-20 flex items-center justify-center bg-white">
          <Loading
            size="md"
            message="로딩 중..."
          />
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="h-12 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
            {columns.map(col => (
              <th
                key={col.key}
                className={col.className || 'text-center'}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && !loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="h-[40vh] w-full p-0 text-center align-middle"
              >
                <div className="h-[40vh] flex-col items-center justify-center text-base text-gray-400">
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={rowKey(row)}
                className="h-16 border-b border-gray-200 text-sm"
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={col.className || 'text-center'}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable
