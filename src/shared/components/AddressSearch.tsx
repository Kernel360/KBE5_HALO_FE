import { useRef } from 'react'
import { SearchButton } from './ui/SearchButton'

interface AddressSearchProps {
  roadAddress: string
  detailAddress: string
  setRoadAddress: (val: string) => void
  setDetailAddress: (val: string) => void
  onCoordinatesChange?: (lat: number, lng: number) => void
  onAddressChange?: (
    roadAddress: string,
    detailAddress: string,
    lat: number,
    lng: number
  ) => void
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void
      }) => { open: () => void }
    }
    kakao: {
      maps: {
        load: (callback: () => void) => void
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: KakaoGeocodeResult[], status: string) => void
            ) => void
          }
          Status: {
            OK: string
          }
        }
      }
    }
  }
}

interface DaumPostcodeData {
  roadAddress: string
  // ... other fields if needed
}
interface KakaoGeocodeResult {
  x: string
  y: string
}

const round7 = (num: number) => Math.round(num * 1e7) / 1e7

const AddressSearch = ({
  roadAddress,
  detailAddress,
  setRoadAddress,
  setDetailAddress,
  onCoordinatesChange,
  onAddressChange
}: AddressSearchProps) => {
  const detailInputRef = useRef<HTMLInputElement>(null)

  // 카카오 우편번호 팝업 열기 (동적 로딩 및 재시도 지원)
  const openPostcode = () => {
    // 이미 로드된 경우 바로 실행
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: DaumPostcodeData) {
          setRoadAddress(data.roadAddress)

          // 카카오 맵 API 초기화 후 좌표 검색
          const initializeKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
              window.kakao.maps.load(() => {
                const geocoder = new window.kakao.maps.services.Geocoder()
                geocoder.addressSearch(
                  data.roadAddress,
                  (result: KakaoGeocodeResult[], status: string) => {
                    if (
                      status === window.kakao.maps.services.Status.OK &&
                      result[0]
                    ) {
                      const lat = round7(parseFloat(result[0].y))
                      const lng = round7(parseFloat(result[0].x))
                      if (onCoordinatesChange) onCoordinatesChange(lat, lng)
                      if (onAddressChange)
                        onAddressChange(
                          data.roadAddress,
                          detailAddress,
                          lat,
                          lng
                        )
                    } else {
                      if (onCoordinatesChange) onCoordinatesChange(0, 0)
                      if (onAddressChange)
                        onAddressChange(data.roadAddress, detailAddress, 0, 0)
                    }
                  }
                )
              })
            } else {
              setTimeout(initializeKakaoMap, 500)
            }
          }

          // 카카오 맵 API 초기화 시작
          initializeKakaoMap()

          setTimeout(() => {
            detailInputRef.current?.focus()
          }, 100)
        }
      }).open()
      return
    }
    // 스크립트가 없으면 동적으로 추가
    const scriptId = 'daum-postcode-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src =
        'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      script.onload = () => openPostcode() // 로드 후 재시도
      document.body.appendChild(script)
    } else {
      // 이미 추가했지만 아직 로드 안 됨: 100ms 단위로 재시도
      setTimeout(openPostcode, 100)
    }
  }

  return (
    <div className="flex flex-col items-start justify-start gap-2 self-stretch">
      <div className="flex w-full flex-col gap-2 md:flex-row md:gap-3">
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={roadAddress}
            placeholder="도로명주소"
            className="h-12 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            readOnly
            onClick={openPostcode}
          />
        </div>
        <div className="w-full md:w-auto">
          <SearchButton
            type="button"
            onClick={openPostcode}
            className="h-12 w-full px-4 md:w-auto"
          />
        </div>
      </div>
      <div className="w-full">
        <input
          ref={detailInputRef}
          type="text"
          placeholder="상세주소"
          value={detailAddress}
          onChange={e => {
            setDetailAddress(e.target.value)
            // 상세주소 변경 시에는 기존 좌표 정보를 유지
            // onAddressChange는 우편번호 검색을 통해서만 호출되도록 수정
          }}
          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
    </div>
  )
}

export default AddressSearch
