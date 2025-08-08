import mapboxgl, { LngLat } from 'mapbox-gl';
import { copyToClipboard } from '../../utils/helpers.ts';
import styles from './MapBox.module.css';
// Функция для центрирования карты по маркерам
export const centerMapOnMarkers = (
  map: mapboxgl.Map,
  points: { coordinates: [number, number] }[],
) => {
  if (points.length === 0) return;

  if (points.length === 1) {
    // Если только одна точка, центрируем на ней
    map.setCenter(points[0].coordinates);
    map.setZoom(10);
  } else {
    // Если несколько точек, находим границы и центрируем по ним
    const bounds = new mapboxgl.LngLatBounds();

    points.forEach((point) => {
      bounds.extend(point.coordinates);
    });

    map.fitBounds(bounds, {
      padding: 50, // отступы от краев
      maxZoom: 12, // максимальный зум
      duration: 1000, // анимация центрирования
    });
  }
};

export const copyToClipboardWithTooltip = (map: mapboxgl.Map, lngLat: LngLat) => {
  console.log('Координаты клика:', lngLat.lng, lngLat.lat);
  copyToClipboard(`${lngLat.lat.toFixed(5)} ${lngLat.lng.toFixed(5)}`);
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 5,
  })
    .setLngLat([lngLat.lng, lngLat.lat])
    .setHTML(`<div class=${styles.tooltip}>Координаты скопированны</div>`)
    .addTo(map);
  setTimeout(() => {
    popup.remove();
  }, 500);
};

export const createIconEl = (icon: string) => {
  const el = document.createElement('div');
  el.innerHTML = icon;
  el.style.transform = 'translate(-50%, -50%)';
  el.style.width = '32px';
  el.style.height = '32px';
  return el;
};

export const getRouteType = (type: string) => {
  if (type === 'walking') return 'walking';
  return 'driving';
};

export const validateClipboardCoordinates = (str: string) => {
  const regex = /^-?\d+\.\d+\s+-?\d+\.\d+$/;
  // Проверяем соответствие формату
  if (!regex.test(str))
    throw new Error('Неверный формат координат. Используйте формат: "12.234 29.4545"');

  // Разбиваем строку на координаты
  const [lng, lat] = str.split(' ').map(Number).reverse();
  // Проверяем диапазоны координат
  if (lat < -90 || lat > 90) throw new Error('Широта должна быть в диапазоне от -90 до 90');

  if (lng < -180 || lng > 180) throw new Error('Долгота должна быть в диапазоне от -180 до 180');
};
