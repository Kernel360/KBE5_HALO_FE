export function ServiceDetailCard({ reservation }: { reservation: any }) {
  return (
    <div className="pt-6 border-t border-slate-200 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">서비스 상세</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-slate-600">서비스 항목</span>
          </div>
          <p className="text-lg font-semibold text-slate-800">{reservation.serviceName}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-slate-600">추가 서비스</span>
          </div>
          {reservation.extraServiceName ? (
            <p className="text-base text-slate-700">{reservation.extraServiceName}</p>
          ) : (
            <p className="text-base text-slate-400">추가 서비스가 없습니다.</p>
          )}
        </div>
      </div>
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 flex items-start gap-3 mt-2">
        <svg className="w-6 h-6 text-indigo-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 13V7a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2zm-2 0H4V7h12v6z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <div className="text-sm font-medium text-indigo-700 mb-1">요청사항</div>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed text-base min-h-[32px]">
            {reservation.memo ? reservation.memo : <span className="text-slate-400">요청사항이 없습니다.</span>}
          </div>
        </div>
      </div>
    </div>
  );
} 