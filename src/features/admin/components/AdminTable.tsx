import React from "react";

export interface AdminTableColumn<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  loading?: boolean;
}

export function AdminTable<T>({ columns, data, rowKey, onRowClick, emptyMessage = "데이터가 없습니다.", className = "", loading = false }: AdminTableProps<T>) {
  return (
    <div className={`w-full bg-white rounded-lg shadow flex flex-col min-h-[50vh] ${className}`}>
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
      <table className="w-full">
        <thead>
          <tr className="h-12 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
            {columns.map((col) => (
              <th key={col.key} className={col.className || "text-center"}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="w-full h-[40vh] text-center align-middle p-0">
                <div className="flex flex-col justify-center items-center h-[40vh] text-indigo-500 text-base">
                  <div className="halo-spinner mb-4" />
                  로딩 중...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="w-full h-[40vh] text-center align-middle p-0">
                <div className="flex flex-col justify-center items-center h-[40vh] text-gray-400 text-base">
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={rowKey(row)}
                className="h-16 border-b border-gray-200 text-sm hover:bg-slate-50 cursor-pointer"
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.className || "text-center"}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
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

export default AdminTable; 