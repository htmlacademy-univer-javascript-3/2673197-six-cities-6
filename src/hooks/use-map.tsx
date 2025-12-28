import { useEffect, useState, useRef } from 'react';
import { Map, TileLayer } from 'leaflet';
import type { MutableRefObject } from 'react';

import type { City } from '../types/city';

export function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  city: City | null
): Map | null {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);

  useEffect(() => {
    if (map && city) {
      map.setView(
        {
          lat: city.location.latitude,
          lng: city.location.longitude
        },
        city.location.zoom
      );
    }
  }, [map, city]);

  useEffect(() => {
    let isMounted = true;

    if (mapRef.current !== null && !isRenderedRef.current) {
      const instance = city
        ? new Map(mapRef.current, {
          center: {
            lat: city.location.latitude,
            lng: city.location.longitude
          },
          zoom: city.location.zoom
        })
        : null;

      const layer = new TileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }
      );

      if (instance) {
        instance.addLayer(layer);
      }

      if (isMounted) {
        setMap(instance);
        isRenderedRef.current = true;
      }
    }

    return () => {
      isMounted = false;
    };
  }, [mapRef, city]);

  return map;
}
