import { useEffect, useRef, useState } from 'react'

export function AddressMapCardForCustomer(
  {
    reservation
  }: {
    reservation: { roadAddress?: string; detailAddress?: string }
  }
) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const address = reservation.roadAddress?.replace(/^대한민국\s+/, '') || ''
  const detailAddress = reservation.detailAddress || ''
  const fullAddress = `${address} ${detailAddress}`.trim()

  useEffect(() => {
    if (!fullAddress || !mapContainer.current) return
    setIsLoading(true)
    setHasError(false)

    const initializeMap = () => {
      try {
        const maps = (window.kakao as unknown as { maps: any }).maps
        if (!maps) {
          setHasError(true)
          setIsLoading(false)
          return
        }
        const mapOption = {
          center: new maps.LatLng(37.5665, 126.978),
          level: 6
        }
        const map = new maps.Map(mapContainer.current, mapOption)
        const geocoder = new maps.services.Geocoder()
        geocoder.addressSearch(
          fullAddress,
          (result: Array<{ x: string; y: string }>, status: string) => {
            if (status === maps.services.Status.OK) {
              const lat = parseFloat(result[0].y)
              const lng = parseFloat(result[0].x)
              const coords = new maps.LatLng(lat, lng)
              map.setCenter(coords)
              const marker = new maps.Marker({
                map: map,
                position: coords
              })
              const infoWindow = new maps.InfoWindow({
                content: `<div style='padding:8px 12px;font-size:13px;'>${fullAddress}</div>`
              })
              infoWindow.open(map, marker)
            } else {
              setHasError(true)
            }
            setIsLoading(false)
          }
        )
      } catch {
        setHasError(true)
        setIsLoading(false)
      }
    }
    const maps = (window.kakao as unknown as { maps: any }).maps
    if (maps) {
      maps.load(() => {
        initializeMap()
      })
    } else {
      setTimeout(() => {
        const maps = (window.kakao as unknown as { maps: any }).maps
        if (maps) {
          maps.load(() => {
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
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        {address && (
          <p className="leading-relaxed text-slate-800 font-semibold">{address}</p>
        )}
        {detailAddress && (
          <p className="text-sm text-slate-600">상세주소: {detailAddress}</p>
        )}
        {!address && !detailAddress && (
          <p className="text-slate-500">주소 정보가 없습니다.</p>
        )}
      </div>
      <div className="relative">
        <div
          ref={mapContainer}
          className="h-[320px] w-full rounded-[12px] border bg-slate-100"
          style={{ minHeight: 320 }}
        />
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-100">
            <span className="sm text-gray-500">지도를 불러오는 중...</span>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-red-50">
            <span className="base font-semibold text-red-500">
              지도를 표시할 수 없습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  )
} 