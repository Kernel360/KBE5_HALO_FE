import { useEffect, useRef } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import { useAddressStore } from '@/store/useAddressStore'
import Loading from '@/shared/components/ui/Loading'

interface AddressSearchProps {
  roadAddress: string
  detailAddress: string
  errors?: string
  setRoadAddress: (val: string) => void
  setDetailAddress: (val: string) => void
  // 위도/경도 업데이트를 위한 콜백 추가
  onCoordinatesChange?: (lat: number, lng: number) => void
}

const GOOGLE_MAP_LIBRARIES = ['places'] as ['places']

const AddressSearch = ({
  roadAddress,
  detailAddress,
  errors,
  setRoadAddress,
  setDetailAddress,
  onCoordinatesChange
}: AddressSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const { setAddress } = useAddressStore()
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES
  })

  // 도로명주소 자동완성 초기화
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current
      )

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current!.getPlace()

        if (!place.geometry || !place.formatted_address) {
          alert('자동완성 목록에서 주소를 선택해주세요.')
          return
        }

        const lat = place.geometry.location?.lat() ?? 0
        const lng = place.geometry.location?.lng() ?? 0

        // 도로명주소 업데이트
        setRoadAddress(place.formatted_address)

        // 부모 컴포넌트에 좌표 정보 전달
        if (onCoordinatesChange) {
          onCoordinatesChange(lat, lng)
        }

        // 스토어에도 저장
        setAddress(place.formatted_address, lat, lng, detailAddress)
      })
    }
  }, [isLoaded, detailAddress, onCoordinatesChange, setRoadAddress, setAddress])

  // 상세주소 변경 시에도 setAddress 실행 (기존 좌표 유지)
  useEffect(() => {
    if (roadAddress) {
      const { latitude, longitude } = useAddressStore.getState()
      setAddress(roadAddress, latitude ?? 0, longitude ?? 0, detailAddress)
    }
  }, [detailAddress, roadAddress, setAddress])

  return isLoaded ? (
    <div className="flex flex-col items-start justify-start gap-2 self-stretch">
      <div className="justify-start self-stretch font-['Inter'] text-sm leading-none font-medium text-slate-700">
        주소 *
      </div>

      {/* 도로명주소 자동완성 입력창 */}
      <div className="inline-flex h-12 items-center justify-start self-stretch rounded-lg bg-slate-50 px-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
        <input
          ref={inputRef}
          type="text"
          defaultValue={roadAddress}
          placeholder="도로명주소"
          className="w-full bg-transparent text-sm font-normal text-slate-700 outline-none"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault() // Enter로 submit 막기
              e.stopPropagation()
            }
          }}
        />
      </div>

      {/* 상세주소 수동입력 */}
      <div className="inline-flex h-12 items-center justify-start self-stretch rounded-lg bg-slate-50 px-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
        <input
          type="text"
          placeholder="상세주소"
          defaultValue={detailAddress}
          onChange={e => {
            setDetailAddress(e.target.value)
          }}
          className="w-full bg-transparent text-sm font-normal text-slate-700 outline-none"
        />
      </div>

      {errors && !roadAddress && (
        <p className="text-xs text-red-500">{errors}</p>
      )}
    </div>
  ) : (
    <Loading
      message="주소 검색 기능을 로딩 중..."
      size="lg"
      className="h-screen"
    />
  )
}

export default AddressSearch
