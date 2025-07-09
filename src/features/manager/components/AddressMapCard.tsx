import React, { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    kakao: unknown
  }
}

export function AddressMapCard({ reservation }: { reservation: any }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const address = reservation.roadAddress?.replace(/^대한민국\s+/, '') || ''
  const detailAddress = reservation.detailAddress || ''
  const fullAddress = `${address} ${detailAddress}`.trim()

  useEffect(() => {
    // 항상 오류가 발생해도 throw나 return 없이 진행
    if (!fullAddress || !mapContainer.current) return
    setIsLoading(true)
    setHasError(false)

    const initializeMap = () => {
      try {
        const kakao = window.kakao as any
        if (!kakao || !kakao.maps) {
          setHasError(true)
          setIsLoading(false)
          return
        }
        const mapOption = {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 6
        }
        const map = new kakao.maps.Map(mapContainer.current, mapOption)
        const geocoder = new kakao.maps.services.Geocoder()
        geocoder.addressSearch(fullAddress, (result: Array<{ x: string; y: string }>, status: string) => {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
            map.setCenter(coords)
            const marker = new kakao.maps.Marker({
              map: map,
              position: coords
            })
            const infoWindow = new kakao.maps.InfoWindow({
              content: `<div style='padding:8px 12px;font-size:13px;'>${fullAddress}</div>`
            })
            infoWindow.open(map, marker)
          } else {
            setHasError(true)
          }
          setIsLoading(false)
        })
      } catch {
        setHasError(true)
        setIsLoading(false)
      }
    }
    const kakao = window.kakao as any
    if (kakao && kakao.maps) {
      kakao.maps.load(() => {
        initializeMap()
      })
    } else {
      setTimeout(() => {
        const kakao = window.kakao as any
        if (kakao && kakao.maps) {
          kakao.maps.load(() => {
            initializeMap()
          })
        } else {
          setHasError(true)
          setIsLoading(false)
        }
      }, 1000)
    }
    // eslint-disable-next-line
  }, [fullAddress])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">서비스 주소</h2>
      </div>
      <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden p-6 flex flex-col gap-4">
        <div className="mb-2">
          {address && (
            <p className="text-base text-slate-800 leading-relaxed">{address}</p>
          )}
          {detailAddress && (
            <p className="text-sm text-slate-600">상세주소: {detailAddress}</p>
          )}
          {!address && !detailAddress && (
            <p className="text-slate-500">주소 정보가 없습니다.</p>
          )}
        </div>
        {(address || detailAddress) ? (
          <div className="-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16 relative">
            <div
              ref={mapContainer}
              className="w-full h-[400px] rounded-[12px] bg-slate-100 border"
              style={{ minHeight: 400 }}
            />
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
                <span className="text-gray-500 text-sm">지도를 불러오는 중...</span>
              </div>
            )}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg z-10">
                <span className="text-red-500 text-base font-semibold">지도를 표시할 수 없습니다.</span>
              </div>
            )}
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
  )
} 