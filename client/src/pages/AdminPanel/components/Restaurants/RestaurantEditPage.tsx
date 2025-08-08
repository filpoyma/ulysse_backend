import { ChangeEvent, useEffect, useState } from 'react';
import { IRestaurant } from '../../../../types/restaurant.types.ts';
import styles from '../Hotels/HotelEditPage.module.css';
import { useSelector } from 'react-redux';
import { restaurantService } from '../../../../services/restaurant.service.ts';
import { selectRestaurants } from '../../../../store/selectors.ts';
import { IUploadedImage } from '../../../../types/uploadImage.types.ts';
import { CountryAutocomplete } from '../../../../components/CountryAutocomplete/CountryAutocomplete.tsx';
import {
  getErrorMessage,
  getImagePath,
  validateHotelCoordinates,
} from '../../../../utils/helpers.ts';
import ImageUploadRestaurants from '../../../../components/ImageUploadModal/ImageUploadRestaurants.tsx';
import { useNavigate, useParams } from 'react-router-dom';

const RestaurantEditPage = () => {
  const { id: restaurantId } = useParams();

  const restaurants = useSelector(selectRestaurants);
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantCoord, setRestaurantCoord] = useState('');
  const [coordinateError, setCoordinateError] = useState<{
    isValid: boolean;
    error: string | null;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMany, setIsMany] = useState(false);
  const [galleryType, setGalleryType] = useState<'gallery' | null>(null);

  useEffect(() => {
    if (restaurantId) {
      if (restaurants && restaurants.length > 0) {
        setIsLoading(false);
        const restaurant = restaurants.find((r: IRestaurant) => r._id === restaurantId);
        if (restaurant) setRestaurant(restaurant);
        else {
          alert('Ресторан не найден');
        }
      } else {
        restaurantService
          .getById(restaurantId)
          .then((restaurant) => {
            setRestaurant(restaurant.data);
          })
          .catch(console.error)
          .finally(() => setIsLoading(false));
      }
    }
  }, [restaurantId, restaurants]);

  useEffect(() => {
    if (restaurant) setRestaurantCoord(`${restaurant.coordinates[1]} ${restaurant.coordinates[0]}`);
    setCoordinateError(null);
  }, [restaurant]);

  const handleInputChange = (
    field: keyof IRestaurant,
    value: string | string[] | number[] | number,
  ) => {
    setRestaurant((restaurant) => {
      if (!restaurant) return null;
      return { ...restaurant, [field]: value };
    });
  };

  const handleInputChangeCoord = (e: ChangeEvent<HTMLInputElement>) => {
    setCoordinateError(null);
    setRestaurantCoord(e.target.value.replace(/[^0-9\s.]/g, ''));
  };

  const handleSelectManyImages = (type: 'gallery') => {
    setIsMany(true);
    setGalleryType(type);
    setIsModalOpen(true);
  };

  const handleSelectOneImage = () => {
    setIsMany(false);
    setGalleryType(null);
    setIsModalOpen(true);
  };

  const handleReturnToRestList = () => navigate('/admin/restaurants');

  const handleDeleteImage = async (imageId: string) => {
    if (!restaurant || !imageId || !restaurant._id) return;

    try {
      const updatedGallery = restaurant.gallery.filter((img) => img._id !== imageId);

      await restaurantService.updateGallery(
        restaurant._id,
        updatedGallery.map((img) => img._id || ''),
      );

      setRestaurant((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          gallery: updatedGallery,
        };
      });
    } catch (err) {
      console.error('Error deleting image:', err);
      alert(getErrorMessage(err));
    }
  };

  const handleSave = async () => {
    if (!restaurant || !restaurantId) return;
    const validation = validateHotelCoordinates(restaurantCoord);
    if (!validation.isValid) {
      setCoordinateError(validation);
      alert('Ошибка координат');
      return;
    }

    const [lng, lat] = restaurantCoord
      .split(' ')
      .map((coord) => parseFloat(coord.trim()))
      .reverse();
    const restaurantWithParsedCoordinates = {
      ...restaurant,
      coordinates: [lng, lat] as [number, number],
    };
    setIsLoading(true);
    try {
      await restaurantService.update(restaurantId, restaurantWithParsedCoordinates);
      setCoordinateError(null);
      handleReturnToRestList();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMainImage = async (img: IUploadedImage) => {
    if (!restaurant || !restaurant._id) return;
    try {
      await restaurantService.updateTitleImage(restaurant._id, img._id);
      setRestaurant((prev) => prev ? { ...prev, titleImage: img } : prev);
      setIsModalOpen(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (!restaurant) return <div className={styles.error}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <ImageUploadRestaurants
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        restaurantId={restaurant._id}
        isMany={isMany}
        galleryType={galleryType || undefined}
        belongsToId={restaurant._id}
        onSelectImage={!isMany ? handleSelectMainImage : undefined}
      />

      {/* Левая панель - галерея */}
      <div className={styles.leftPanel}>
        <div className={styles.gallerySection}>
          <h2>Главная картинка</h2>
          <div className={styles.gallery}>
            {restaurant.titleImage ? (
              <div className={styles.imageItem} onClick={handleSelectOneImage}>
                <img src={getImagePath(restaurant.titleImage?.path)} alt={`Restaurant image`} />
              </div>
            ) : (
              <div className={styles.placeholder} onClick={handleSelectOneImage} />
            )}
          </div>
        </div>

        <div className={styles.gallerySection}>
          <h2>Галерея ресторана</h2>
          <div className={styles.gallery}>
            {restaurant.gallery && restaurant.gallery.length > 0 ? (
              restaurant.gallery.map((image: IUploadedImage, index: number) => (
                <div key={image._id} className={styles.imageItem}>
                  <img src={getImagePath(image.path)} alt={`Restaurant image ${index + 1}`} />
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (image._id) {
                        handleDeleteImage(image._id);
                      }
                    }}>
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div
                className={styles.placeholder}
                onClick={() => handleSelectManyImages('gallery')}></div>
            )}
            {restaurant.gallery && restaurant.gallery.length > 0 && (
              <div
                className={styles.placeholder}
                onClick={() => handleSelectManyImages('gallery')}></div>
            )}
          </div>
        </div>
      </div>

      {/* Правая панель - форма редактирования */}
      <div className={styles.rightPanel}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleReturnToRestList}>
            ← к списку
          </button>
          <h2>Редактирование ресторана</h2>
        </div>

        <div className={styles.form}>
          {/* Основная информация */}
          <div className={styles.section}>
            <h2>Основная информация</h2>
            <div className={styles.field}>
              <label>Название ресторана *</label>
              <input
                type="text"
                value={restaurant.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Страна *</label>
              <CountryAutocomplete
                value={restaurant.country || ''}
                onChange={(value) => handleInputChange('country', value)}
              />
            </div>

            <div className={styles.field}>
              <label>Город</label>
              <input
                type="text"
                value={restaurant.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Регион</label>
              <input
                type="text"
                value={restaurant.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Адрес</label>
              <input
                type="text"
                value={restaurant.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Ссылка</label>
              <input
                type="text"
                value={restaurant.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
              />
            </div>
     
            <div className={styles.field}>
              <label>Количество звёзд</label>
              <input
                type="number"
                min={1}
                max={5}
                value={restaurant.stars}
                onChange={(e) => handleInputChange('stars', Number(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label>Координаты через пробел (25.44 81.85)</label>
              <div className={coordinateError ? styles.coordinateFieldErr : styles.coordinateField}>
                <input
                  pattern="^[0-9\s.]+$"
                  placeholder="Широта Долгота"
                  value={restaurantCoord || ''}
                  onChange={handleInputChangeCoord}
                />
                {coordinateError ? (
                  <div className={styles.helperTextErr}>{coordinateError.error}</div>
                ) : (
                  <div className={styles.helperText}>Широта: -90°...90°. Долгота:-180°...180°.</div>
                )}
              </div>
            </div>
          </div>

          {/* Описание */}
          <div className={styles.section}>
            <h2>Описание</h2>
            <div className={styles.field}>
              <label>Описание ресторана</label>
              <textarea
                value={restaurant.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>

          {/* Информация о поваре */}
          <div className={styles.section}>
            <h2>Информация о поваре</h2>
            <div className={styles.field}>
              <label>Описание повара</label>
              <textarea
                value={restaurant.cookDescription}
                onChange={(e) => handleInputChange('cookDescription', e.target.value)}
              />
            </div>
          </div>

          {/* Краткая информация */}
          <div className={styles.section}>
            <h2>Краткая информация</h2>
            <div className={styles.field}>
              <label>Разделяйте запятыми. Нажмите Enter.</label>
              <input
                type="text"
                placeholder="WiFi Парковка Бассейн"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const newItems = input.value.split(',').filter((item) => item.trim());
                    if (newItems.length > 0) {
                      const updatedShortInfo = [...(restaurant.shortInfo || []), ...newItems];
                      handleInputChange('shortInfo', updatedShortInfo);
                      input.value = '';
                    }
                  }
                }}
              />
            </div>
            <div className={styles.list}>
              {restaurant.shortInfo?.map((info, index) => (
                <div key={index} className={styles.listItem}>
                  <span>{info}</span>
                  <button
                    className={styles.removeButton}
                    onClick={() => {
                      const newShortInfo =
                        restaurant.shortInfo?.filter((_, i) => i !== index) || [];
                      handleInputChange('shortInfo', newShortInfo);
                    }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className={styles.saveButton} onClick={handleSave} disabled={isLoading}>
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantEditPage;
