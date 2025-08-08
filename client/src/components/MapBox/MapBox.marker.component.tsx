import { useEffect, useRef, memo } from 'react';
import mapboxgl, { LngLat } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import iconsMap from '../../assets/icons/mapIcons/map/icons.map.ts';
import { centerMapOnMarkers, createIconEl } from './map.utils.ts';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../store/selectors.ts';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapBoxWithMarkers = ({
  markerId,
  points,
}: {
  markerId: string | null;
  points: { coordinates: [number, number]; name: string; id: string }[];
}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const mapRef = useRef(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const setScreenPosition = (mapCenter: LngLat, zoom: number) => {
    console.log('file-MapBoxCustomLayer.component.tsx mapCenter, zoom:', mapCenter, zoom);
  };

  useEffect(() => {
    if (!points.length) return;
    const map = new mapboxgl.Map({
      container: mapRef.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      // center: [138.46675563464663, 36.35583007420196],
      // zoom: 6,
    });
    mapInstance.current = map;

    if (isLoggedIn) {
      map.getCanvas().style.cursor = 'default';

      // map.on('click', (e) => {
      //   const lngLat = e.lngLat; // объект {lng, lat}
      //   copyToClipboardWithTooltip(map, lngLat);
      // });

      map.on('moveend', () => {
        setScreenPosition(map.getCenter(), map.getZoom());
      });
    }

    // Добавляем маркеры
    points.forEach((point) => {
      const el = createIconEl(iconsMap['hotel']);
      new mapboxgl.Marker({ element: el })
        .setLngLat(point.coordinates)
        .setPopup(new mapboxgl.Popup().setText('Отель: ' + point.name))
        .addTo(map);
    });

    // Центрируем карту по маркерам после загрузки
    map.on('load', () => {
      centerMapOnMarkers(map, points);
    });

    return () => map.remove();
  }, [points]);

  useEffect(() => {
    if (!markerId || !mapInstance.current) return;
    const hotel = points.find((p) => p.id === markerId);
    if (hotel) {
      mapInstance.current.flyTo({
        center: hotel.coordinates,
        zoom: 8,
        speed: 3,
      });
    }
  }, [markerId, points]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default memo(MapBoxWithMarkers);
