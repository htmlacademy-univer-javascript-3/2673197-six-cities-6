import { memo, useRef, useEffect } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ReactNode } from 'react';

import { useMap } from '../../hooks/use-map';
import type { City } from '../../types/city';
import type { Point } from '../../types/point.ts';

type MapProps = {
  city: City | null;
  points: Point[];
  selectedPoint: Point | null;
};

const CUSTOM_MARKER_OPTIONS = {
  iconSize: [40, 40] as [number, number],
  iconAnchor: [20, 40] as [number, number]
};

const DEFAULT_CUSTOM_MARKER = new Icon({
  ...CUSTOM_MARKER_OPTIONS,
  iconUrl: 'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/pin.svg'
});

const CURRENT_CUSTOM_MARKER = new Icon({
  ...CUSTOM_MARKER_OPTIONS,
  iconUrl: 'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/main-pin.svg',
});

function MapComponent({city, points, selectedPoint}: MapProps): ReactNode {
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);
      points.forEach((point) => {
        const marker = new Marker({
          lat: point.latitude,
          lng: point.longitude
        });

        marker
          .setIcon(
            selectedPoint && point.key === selectedPoint.key
              ? CURRENT_CUSTOM_MARKER
              : DEFAULT_CUSTOM_MARKER
          )
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, points, selectedPoint]);

  return <div style={{height: '500px'}} ref={mapRef} data-testid="map"></div>;
}

export const Map = memo(MapComponent);
