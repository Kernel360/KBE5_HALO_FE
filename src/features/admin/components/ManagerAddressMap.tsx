import React, { useEffect, useRef } from "react";
import Loading from "@/shared/components/ui/Loading";

interface ManagerAddressMapProps {
  address: string;
  detailAddress: string;
}

// 카카오 맵 API 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

const ManagerAddressMap: React.FC<ManagerAddressMapProps> = ({
  address,
  detailAddress,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    const initializeMap = () => {
      console.log("지도 초기화 시작");
      console.log("mapContainer.current:", mapContainer.current);
      console.log("window.kakao:", window.kakao);
      console.log("window.kakao.maps:", window.kakao?.maps);

      if (!mapContainer.current) {
        console.error("지도 컨테이너가 없습니다");
        setHasError(true);
        setIsLoading(false);
        return;
      }

      if (!window.kakao || !window.kakao.maps) {
        console.error("카카오 맵 API가 로드되지 않았습니다");
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        // 지도 초기화
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심
          level: 6, // 지도 확대 레벨
        };

        console.log("지도 생성 시도:", mapOption);
        const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
        mapRef.current = map;
        console.log("지도 생성 완료:", map);

        // 주소-좌표 변환 객체 생성
        const geocoder = new window.kakao.maps.services.Geocoder();

        // 주소로 좌표 검색
        console.log("주소 검색 시작:", address);
        geocoder.addressSearch(address, (result: any, status: any) => {
          console.log("주소 검색 결과:", result, status);
          if (status === window.kakao.maps.services.Status.OK) {
            console.log("주소 검색 성공:", result[0]);
            const coords = new window.kakao.maps.LatLng(
              result[0].y,
              result[0].x,
            );

            // 지도 중심을 검색된 좌표로 이동
            map.setCenter(coords);

            // 마커 생성
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });

            // 정보창 생성
            const infoWindow = new window.kakao.maps.InfoWindow({
              content: `
                <div style="padding: 10px; min-width: 200px;">
                  <div style="font-weight: bold; margin-bottom: 5px;">매니저 위치</div>
                  <div style="font-size: 12px; color: #666;">
                    ${address}<br/>
                    ${detailAddress}
                  </div>
                </div>
              `,
            });

            // 마커에 정보창 표시
            infoWindow.open(map, marker);

            // 서비스 가능 지역 원 표시 (반경 5km)
            const circle = new window.kakao.maps.Circle({
              center: coords,
              radius: 5000, // 5km
              strokeWeight: 2,
              strokeColor: "#6366f1",
              strokeOpacity: 0.8,
              strokeStyle: "solid",
              fillColor: "#6366f1",
              fillOpacity: 0.1,
            });

            circle.setMap(map);

            // 원이 모두 보이도록 지도 레벨 조정
            const bounds = new window.kakao.maps.LatLngBounds();
            const distance = 5000; // 5km
            const earthRadius = 6371000; // 지구 반지름 (미터)

            const lat = result[0].y;
            const lng = result[0].x;
            const latRadian = (lat * Math.PI) / 180;

            const deltaLat = ((distance / earthRadius) * 180) / Math.PI;
            const deltaLng =
              ((distance / (earthRadius * Math.cos(latRadian))) * 180) /
              Math.PI;

            bounds.extend(
              new window.kakao.maps.LatLng(lat + deltaLat, lng + deltaLng),
            );
            bounds.extend(
              new window.kakao.maps.LatLng(lat - deltaLat, lng - deltaLng),
            );

            map.setBounds(bounds);
          } else {
            console.error("주소 검색 실패:", status, "주소:", address);
            // 주소 검색 실패 시에도 기본 지도는 표시
            console.log("기본 지도 표시 (서울 중심)");
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error("지도 생성 중 오류:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    // 카카오 맵 API가 이미 로드되어 있으면 바로 초기화
    if (window.kakao && window.kakao.maps) {
      // autoload=false이므로 수동으로 로드
      window.kakao.maps.load(() => {
        initializeMap();
      });
    } else {
      // 약간의 지연 후 재시도
      const timer = setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            initializeMap();
          });
        } else {
          console.error("카카오 맵 API 로드 대기 시간 초과");
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
