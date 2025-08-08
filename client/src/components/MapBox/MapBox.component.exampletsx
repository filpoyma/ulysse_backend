// MapboxMap.jsx
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [30.5234, 50.4501], // [долгота, широта] — Киев
      zoom: 10,
    });

    // Добавим маркер
    new mapboxgl.Marker()
      .setLngLat([30.5234, 50.4501])
      .setPopup(new mapboxgl.Popup().setText('Киев')) // всплывающее окно
      .addTo(map);

    // Очистка при размонтировании
    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
  );
};

export default MapboxMap;
