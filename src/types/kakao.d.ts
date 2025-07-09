export {};

declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: unknown) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
        Marker: new (options: unknown) => unknown;
        InfoWindow: new (options: unknown) => unknown;
        Circle: new (options: unknown) => unknown;
        LatLngBounds: new () => unknown;
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: unknown[], status: string) => void
            ) => void;
          };
          Status: {
            OK: string;
          };
        };
        load: (callback: () => void) => void;
      };
    };
  }
} 