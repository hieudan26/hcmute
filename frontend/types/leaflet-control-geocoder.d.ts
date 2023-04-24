declare namespace L.Control {
  class Geocoder extends L.Control {
    constructor(options?: GeocoderOptions);

    options: GeocoderOptions;

    onAdd(map: L.Map): HTMLElement;
    onRemove(map: L.Map): void;
    geocode(query: string, cb: (results: GeocoderResult[]) => void, context?: any): void;
    reverse(location: L.LatLng, scale: number, cb: (results: GeocoderResult[]) => void, context?: any): void;
  }

  interface GeocoderOptions extends L.ControlOptions {
    collapsed?: boolean;
    expand?: 'click' | 'touch' | 'hover';
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    placeholder?: string;
    errorMessage?: string;
    iconLabel?: string;
    queryMinLength?: number;
    suggestMinLength?: number;
    suggestTimeout?: number;
    defaultMarkGeocode?: boolean;
    showResultIcons?: boolean;
    autocomplete?: boolean;
    panToPoint?: boolean;
    markers?: boolean;
    attribution?: string;
    geocoder?: GeocoderObject;
    defaultOptions?: GeocoderOptions;
  }

  interface GeocoderResult {
    name: string;
    bbox: L.LatLngBoundsExpression;
    center: L.LatLngExpression;
    properties: {
      icon?: string;
      [name: string]: any;
    };
  }

  interface GeocoderObject {
    geocode(query: string, cb: (results: GeocoderResult[]) => void, context?: any): any;
    reverse(location: L.LatLng, scale: number, cb: (results: GeocoderResult[]) => void, context?: any): any;
  }

  function geocoder(options?: GeocoderOptions): L.Control.Geocoder;
}
