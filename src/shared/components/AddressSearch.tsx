import { useRef } from 'react'
import { useAddressStore } from '@/store/useAddressStore'

interface AddressSearchProps {
  roadAddress: string
  detailAddress: string
  errors?: string
  setRoadAddress: (val: string) => void
  setDetailAddress: (val: string) => void
  onCoordinatesChange?: (lat: number, lng: number) => void
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
  errors,
  setRoadAddress,
  setDetailAddress,
  onCoordinatesChange
}: AddressSearchProps) => {
  const { setAddress } = useAddressStore()
  const detailInputRef = useRef<HTMLInputElement>(null)

  // 카카오 우편번호 팝업 열기 (동적 로딩 및 재시도 지원)
  const openPostcode = () => {
    // 이미 로드된 경우 바로 실행
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: DaumPostcodeData) {
          setRoadAddress(data.roadAddress)
          if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
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
                  setAddress(data.roadAddress, lat, lng, detailAddress)
                } else {
                  if (onCoordinatesChange) onCoordinatesChange(0, 0)
                  setAddress(data.roadAddress, 0, 0, detailAddress)
                }
              }
            )
          } else {
            if (onCoordinatesChange) onCoordinatesChange(0, 0)
            setAddress(data.roadAddress, 0, 0, detailAddress)
          }
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
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      script.onload = () => openPostcode() // 로드 후 재시도
      document.body.appendChild(script)
    } else {
      // 이미 추가했지만 아직 로드 안 됨: 100ms 단위로 재시도
      setTimeout(openPostcode, 100)
    }
  }

  return (
    <div className="flex flex-col items-start justify-start gap-2 self-stretch">
      <div className="justify-start self-stretch font-['Inter'] text-sm leading-none font-medium text-slate-700">
        주소 *
      </div>
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={roadAddress}
          placeholder="도로명주소"
          className="h-12 flex-1 rounded-lg bg-slate-50 bg-transparent px-4 text-sm font-normal text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 outline-none"
          readOnly
        />
        <button
          type="button"
          onClick={openPostcode}
          className="rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          주소 검색
        </button>
      </div>
      <div className="inline-flex h-12 items-center justify-start self-stretch rounded-lg bg-slate-50 px-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
        <input
          ref={detailInputRef}
          type="text"
          placeholder="상세주소"
          value={detailAddress}
          onChange={e => {
            setDetailAddress(e.target.value)
            const { latitude, longitude } = useAddressStore.getState()
            setAddress(
              roadAddress,
              latitude ?? 0,
              longitude ?? 0,
              e.target.value
            )
          }}
          className="w-full bg-transparent text-sm font-normal text-slate-700 outline-none"
        />
      </div>
      {errors && !roadAddress && (
        <p className="text-xs text-red-500">{errors}</p>
      )}
    </div>
  )
}

export default AddressSearch
