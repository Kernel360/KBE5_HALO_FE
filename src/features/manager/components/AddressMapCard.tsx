export function AddressMapCard({ reservation }: { reservation: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">서비스 주소</h2>
      </div>
      <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden p-6 flex flex-col gap-4">
        <div className="mb-2">
          {reservation.roadAddress && (
            <p className="text-base text-slate-800 leading-relaxed">
              {reservation.roadAddress.replace(/^대한민국\s+/, '')}
            </p>
          )}
          {reservation.detailAddress && (
            <p className="text-sm text-slate-600">
              상세주소: {reservation.detailAddress}
            </p>
          )}
          {!reservation.roadAddress && !reservation.detailAddress && (
            <p className="text-slate-500">주소 정보가 없습니다.</p>
          )}
        </div>
        {(reservation.roadAddress || reservation.detailAddress) ? (
          <div className="-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                (reservation.roadAddress?.replace(/^대한민국\s+/, '') || '') + ' ' + (reservation.detailAddress || '')
              )}&output=embed`}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="서비스 위치"
            />
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-slate-100">
            <div className="text-center text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">주소 정보가 없어 지도를 표시할 수 없습니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 