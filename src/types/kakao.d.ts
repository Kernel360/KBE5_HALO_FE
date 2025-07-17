// Kakao Maps API type declarations for global window.kakao.maps usage
// 'any' is used intentionally for compatibility with Kakao Maps JS API

declare global {
  interface Window {
    kakao: {
      maps: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // @ts-expect-error: Kakao Maps API returns dynamic objects
        Map: new (container: HTMLElement, options: any) => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // @ts-expect-error: Kakao Maps API returns dynamic objects
        LatLng: new (lat: number, lng: number) => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // @ts-expect-error: Kakao Maps API returns dynamic objects
        Marker: new (options: any) => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // @ts-expect-error: Kakao Maps API returns dynamic objects
        InfoWindow: new (options: any) => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // @ts-expect-error: Kakao Maps API returns dynamic objects
        Circle: new (options: any) => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // @ts-expect-error: Kakao Maps API returns dynamic objects
        LatLngBounds: new () => any
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: unknown[], status: string) => void
            ) => void
          }
          Status: {
            OK: string
          }
        }
        load: (callback: () => void) => void
      }
    }
  }
} 