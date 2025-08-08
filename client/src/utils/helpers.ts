import { ROOT_URL } from '../constants/api.constants.ts';

const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

export const createArrayFromNumber = (number: number) =>
  [...Array(number)].map((_, index) => index + 1);

export const createArrayFromNumberWithId = (number: number) =>
  [...Array(number)].map((_, index) => ({ id: generateId(), num: index + 1 }));

// const [items, setItems] = useState(['a', 'b', 'c']);
//
// const swapItems = (i, j) => {
//     setItems((prev) => {
//         const newItems = [...prev];
//         [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
//         return newItems;
//     });
// };

export const copyToClipboard = (text: unknown) => {
  if (text && typeof text === 'string') navigator.clipboard.writeText(text).catch(console.error);
};

// Валидация координат
export const validateCoordinates = (
  coordinates: string[],
): { isValid: boolean; error: string | null; fieldNumber: number } => {
  let fieldNumber = 0;
  for (const item of coordinates) {
    const [lng, lat] = item
      .split(' ')
      .map((coord) => parseFloat(coord.trim()))
      .reverse();
    // Проверяем, что значения являются числами
    if (isNaN(lat) || isNaN(lng)) {
      return {
        isValid: false,
        error: 'Координаты должны быть числами',
        fieldNumber,
      };
    }

    // Проверяем диапазоны координат
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return {
        isValid: false,
        error: 'Некорректные координаты: широта от -90 до 90, долгота от -180 до 180',
        fieldNumber,
      };
    }
    fieldNumber++;
  }

  return { isValid: true, error: null, fieldNumber };
};

export const validateHotelCoordinates = (
  coordinates: string,
): { isValid: boolean; error: string | null } => {
  const [lng, lat] = coordinates
    .split(' ')
    .map((coord) => parseFloat(coord.trim()))
    .reverse();
  // Проверяем, что значения являются числами
  if (isNaN(lat) || isNaN(lng)) {
    return {
      isValid: false,
      error: 'Координаты должны быть числами',
    };
  }

  // Проверяем диапазоны координат
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return {
      isValid: false,
      error: 'Некорректные координаты:  широта от -90 до 90, долгота от -180 до 180',
    };
  }

  return { isValid: true, error: null };
};

export const getErrorMessage = (err: unknown) => {
  if (typeof err === 'object' && err && 'message' in err) {
    return (err as { message: string }).message;
  }
  return 'Что то пошло не так...';
};

export const getImagePath = (path?: string) => {
  if (!path) return `${location.protocol}//${location.host}/placeholder.jpg`;
  return `${ROOT_URL}/${path?.replace(/^\//, '')}`;
};
