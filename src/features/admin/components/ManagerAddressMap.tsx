import React, { useEffect, useRef } from "react";
import Loading from "@/shared/components/ui/Loading";

interface ManagerAddressMapProps {
  address: string
  detailAddress: string
}

const ManagerAddressMap: React.FC<ManagerAddressMapProps> = ({
  address,
  detailAddress,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainer.current) {
        setHasError(true)
        setIsLoading(false)
        return
      }

      if (!window.kakao || !window.kakao.maps) {
        setHasError(true)
        setIsLoading(false)
        return
      }

      try {
        // kakao.maps를 any로 우회
        const maps = (window.kakao as any).maps
        // 지도 초기화
        const mapOption = {
          center: new maps.LatLng(37.5665, 126.978), // 서울 중심
          level: 6, // 지도 확대 레벨
        };

        const map = new maps.Map(mapContainer.current, mapOption);
        mapRef.current = map;

        // 주소-좌표 변환 객체 생성
        const geocoder = new maps.services.Geocoder();

        // 주소로 좌표 검색
        geocoder.addressSearch(address, (result: Array<{ x: number; y: number }>, status: string) => {
          if (status === maps.services.Status.OK && result[0]) {
            const lat = Number(result[0].y)
            const lng = Number(result[0].x)
            if (isNaN(lat) || isNaN(lng)) {
              console.error('좌표 변환 결과가 NaN입니다:', result[0])
              return
            }
            const coords = new maps.LatLng(lat, lng)
            map.setCenter(coords)
            const marker = new maps.Marker({ map, position: coords })
            const infoWindow = new maps.InfoWindow({
              content: `
                <div style="padding: 10px; min-width: 200px;">
                  <div style="font-weight: bold; margin-bottom: 5px;">매니저 위치</div>
                  <div style="font-size: 12px; color: #666;">
                    ${address}<br/>
                    ${detailAddress}
                  </div>
                </div>
              `
            })
            infoWindow.open(map, marker)
            // 서비스 가능 지역 원 표시 (반경 5km)
            const circle = new maps.Circle({
              center: coords,
              radius: 5000,
              strokeWeight: 2,
              strokeColor: '#6366f1',
              strokeOpacity: 0.8,
              strokeStyle: 'solid',
              fillColor: '#6366f1',
              fillOpacity: 0.1
            })
            circle.setMap(map)
            // 원이 모두 보이도록 지도 레벨 조정
            const bounds = new maps.LatLngBounds()
            const earthRadius = 6371000
            const latRadian = (lat * Math.PI) / 180
            const deltaLat = ((5000 / earthRadius) * 180) / Math.PI
            const deltaLng = ((5000 / (earthRadius * Math.cos(latRadian))) * 180) / Math.PI
            if (!isNaN(deltaLat) && !isNaN(deltaLng)) {
              bounds.extend(new maps.LatLng(lat + deltaLat, lng + deltaLng))
              bounds.extend(new maps.LatLng(lat - deltaLat, lng - deltaLng))
              map.setBounds(bounds)
            } else {
              console.error('deltaLat 또는 deltaLng가 NaN입니다:', { deltaLat, deltaLng })
            }
          } else {
            // 주소 변환 실패
            console.error('카카오 주소 변환 실패', address, result, status)
          }
        })

        setIsLoading(false);
      } catch (error) {
        setHasError(true);
        setIsLoading(false);
      }
    };

    // 카카오 맵 API가 이미 로드되어 있으면 바로 초기화
    if (window.kakao && window.kakao.maps) {
      // autoload=false이므로 수동으로 로드
      (window.kakao as any).maps.load(() => {
        initializeMap();
      });
    } else {
      // 약간의 지연 후 재시도
      const timer = setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          (window.kakao as any).maps.load(() => {
            initializeMap();
          });
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [address, detailAddress]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-4 h-4 text-indigo-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span className="text-slate-600 text-sm font-medium">
          서비스 지역 지도
        </span>
      </div>

      <div className="relative w-full h-64 rounded-lg border border-gray-200 bg-gray-100">
        <div ref={mapContainer} className="w-full h-full rounded-lg" />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <Loading message="지도를 불러오는 중..." size="md" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center p-6">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <div className="text-sm text-gray-600 mb-2">
                지도를 불러올 수 없습니다
              </div>
              <div className="text-xs text-gray-500 mb-3">
                카카오 맵 API 키를 확인해주세요
              </div>
              <div className="text-xs text-gray-700 bg-white rounded p-2 border">
                <div className="font-medium mb-1">주소 정보:</div>
                <div>{address}</div>
                <div>{detailAddress}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
          <span>매니저 위치</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-indigo-500/20 border border-indigo-500 rounded-full"></div>
          <span>서비스 가능 지역 (반경 5km)</span>
        </div>
      </div>
    </div>
  );
};

export default ManagerAddressMap;
