import { ChangeEvent, useEffect, useState } from 'react';
import { IHotel, TGalleryType } from '../../../../types/hotel.types.ts';
import styles from './HotelEditPage.module.css';
import { useSelector } from 'react-redux';
import { hotelService } from '../../../../services/hotel.service.ts';
import { selectHotels } from '../../../../store/selectors.ts';
import ImageUploadHotels from '../../../../components/ImageUploadModal/ImageUploadHotels.tsx';
import { IUploadedImage } from '../../../../types/uploadImage.types.ts';
import { CountryAutocomplete } from '../../../../components/CountryAutocomplete/CountryAutocomplete.tsx';
import {
  getErrorMessage,
  getImagePath,
  validateHotelCoordinates,
} from '../../../../utils/helpers.ts';
import { useNavigate, useParams } from 'react-router-dom';

const HotelEditPage = () => {
  const { id: hotelId } = useParams();
  const navigate = useNavigate();
  const hotels = useSelector(selectHotels);
  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMany, setIsmany] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryType, setGalleryType] = useState<TGalleryType | null>(null);
  const [hotelCoord, setHotelCoord] = useState('');
  const [coordinateError, setCoordinateError] = useState<{
    isValid: boolean;
    error: string | null;
  } | null>(null);

  const roomsGallery = hotel?.roomInfo?.gallery || [];
  const hotelGallery = hotel?.hotelInfo?.gallery || [];

  useEffect(() => {
    if (hotelId) {
      if (hotels && hotels.length) {
        setIsLoading(false);
        const hotel = hotels.find((h) => h._id === hotelId);
        if (hotel) setHotel(hotel);
        else {
          alert('Отель не найден');
        }
      } else {
        hotelService
          .getById(hotelId)
          .then((hotel) => {
            setHotel(hotel.data);
          })
          .catch(console.error)
          .finally(() => setIsLoading(false));
      }
    }
  }, [hotelId, hotels]);

  useEffect(() => {
    if (hotel) setHotelCoord(`${hotel.coordinates[1]} ${hotel.coordinates[0]}`);
    setCoordinateError(null);
  }, [hotel]);

  const handleInputChange = (
    field: keyof IHotel | 'hotelInfo.about' | 'roomInfo.about',
    value: string | string[] | number[],
  ) => {
    setHotel((hotel) => {
      if (!hotel) return null;

      if (field === 'hotelInfo.about') {
        return {
          ...hotel,
          hotelInfo: {
            ...hotel.hotelInfo,
            about: value as string,
          },
        };
      }

      if (field === 'roomInfo.about') {
        return {
          ...hotel,
          roomInfo: {
            ...hotel.roomInfo,
            about: value as string,
          },
        };
      }

      return { ...hotel, [field]: value };
    });
  };

  const handleInputChangeCoord = (e: ChangeEvent<HTMLInputElement>) => {
    setCoordinateError(null);
    setHotelCoord(e.target.value.replace(/[^0-9\s.]/g, ''));
  };

  const handleSelectManyImages = (type: 'hotelInfo.gallery' | 'roomInfo.gallery') => {
    setIsmany(true);
    setGalleryType(type);
    setIsModalOpen(true);
  };

  const handleSelectOneImage = () => {
    setIsmany(false);
    setGalleryType(null);
    setIsModalOpen(true);
  };

  const handleReturnToHotelsList = () => navigate('/admin/hotels');

  const handleDeleteImage = async (
    imageId: string,
    type: 'hotelInfo.gallery' | 'roomInfo.gallery',
  ) => {
    if (!hotel || !imageId || !hotel._id) return;

    try {
      const updatedGallery =
        type === 'hotelInfo.gallery'
          ? hotel.hotelInfo.gallery.filter((img) => img._id !== imageId)
          : hotel.roomInfo.gallery.filter((img) => img._id !== imageId);

      await hotelService.updateGallery(
        hotel._id,
        type,
        updatedGallery.map((img) => img._id || ''),
      );

      setHotel((prev) => {
        if (!prev) return null;
        if (type === 'hotelInfo.gallery') {
          return {
            ...prev,
            hotelInfo: {
              ...prev.hotelInfo,
              gallery: updatedGallery,
            },
          };
        } else {
          return {
            ...prev,
            roomInfo: {
              ...prev.roomInfo,
              gallery: updatedGallery,
            },
          };
        }
      });
    } catch (err) {
      console.error('Error deleting image:', err);
      alert(getErrorMessage(err));
    }
  };

  const handleSave = async () => {
    if (!hotel || !hotelId) return;
    const validation = validateHotelCoordinates(hotelCoord);
    if (!validation.isValid) {
      setCoordinateError(validation);
      alert('Ошибка координат');
      return;
    }

    const [lng, lat] = hotelCoord
      .split(' ')
      .map((coord) => parseFloat(coord.trim()))
      .reverse();
    const hotelWithParsedCoordinates = {
      ...hotel,
      coordinates: [lng, lat] as [number, number],
    };
    setIsLoading(true);
    try {
      await hotelService.update(hotelId, hotelWithParsedCoordinates);
      setCoordinateError(null);
      handleReturnToHotelsList();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMainImage = async (img: IUploadedImage) => {
    if (!hotel || !hotel._id) return;
    try {
      await hotelService.updateMainImage(hotel._id, img._id);
      setHotel((prev) => prev ? { ...prev, mainImage: img } : prev);
      setIsModalOpen(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (!hotel) return <div className={styles.error}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <ImageUploadHotels
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hotelId={hotel._id}
        isMany={isMany}
        galleryType={galleryType || undefined}
        belongsToId={hotel._id}
        onSelectImage={!isMany ? handleSelectMainImage : undefined}
      />

      {/* Левая панель - галерея */}
      <div className={styles.leftPanel}>
        <div className={styles.gallerySection}>
          <h2>Главная картинка</h2>
          <div className={styles.gallery}>
            {hotel.mainImage ? (
              <div className={styles.imageItem} onClick={handleSelectOneImage}>
                <img src={getImagePath(hotel.mainImage?.path)} alt={`Hotel image`} />
              </div>
            ) : (
              <div className={styles.placeholder} onClick={handleSelectOneImage} />
            )}
          </div>
        </div>

        <div className={styles.gallerySection}>
          <h2>Галерея отеля</h2>
          <div className={styles.gallery}>
            {hotelGallery.length > 0 ? (
              hotelGallery.map((image: IUploadedImage, index: number) => (
                <div key={image._id} className={styles.imageItem}>
                  <img src={getImagePath(image.path)} alt={`Hotel image ${index + 1}`} />
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (image._id) {
                        handleDeleteImage(image._id, 'hotelInfo.gallery');
                      }
                    }}>
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div
                className={styles.placeholder}
                onClick={() => handleSelectManyImages('hotelInfo.gallery')}></div>
            )}
            {hotelGallery.length > 0 && (
              <div
                className={styles.placeholder}
                onClick={() => handleSelectManyImages('hotelInfo.gallery')}></div>
            )}
          </div>
        </div>

        <div className={styles.gallerySection}>
          <h2>Галерея номеров отеля</h2>
          <div className={styles.gallery}>
            {roomsGallery.length > 0 ? (
              roomsGallery.map((image: IUploadedImage, index: number) => (
                <div key={image._id} className={styles.imageItem}>
                  <img src={getImagePath(image.path)} alt={`Room image ${index + 1}`} />
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (image._id) {
                        handleDeleteImage(image._id, 'roomInfo.gallery');
                      }
                    }}>
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div
                className={styles.placeholder}
                onClick={() => handleSelectManyImages('roomInfo.gallery')}></div>
            )}
            {roomsGallery.length > 0 && (
              <div
                className={styles.placeholder}
                onClick={() => handleSelectManyImages('roomInfo.gallery')}></div>
            )}
          </div>
        </div>
      </div>

      {/* Правая панель - форма редактирования */}
      <div className={styles.rightPanel}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleReturnToHotelsList}>
            ← к списку
          </button>
          <h2>Редактирование отеля</h2>
        </div>

        <div className={styles.form}>
          {/* Основная информация */}
          <div className={styles.section}>
            <h2>Основная информация</h2>
            <div className={styles.field}>
              <label>Название отеля *</label>
              <input
                type="text"
                value={hotel.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Страна *</label>
              <CountryAutocomplete
                value={hotel.country || ''}
                onChange={(value) => handleInputChange('country', value)}
              />
            </div>

            <div className={styles.field}>
              <label>Город</label>
              <input
                type="text"
                value={hotel.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Регион</label>
              <input
                type="text"
                value={hotel.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Адрес</label>
              <input
                type="text"
                value={hotel.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Ссылка</label>
              <input
                type="text"
                value={hotel.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Координаты через пробел (25.44 81.85)</label>
              <div className={coordinateError ? styles.coordinateFieldErr : styles.coordinateField}>
                <input
                  pattern="^[0-9\s.]+$"
                  placeholder="Широта Долгота"
                  value={hotelCoord || ''}
                  onChange={handleInputChangeCoord}
                />
                {coordinateError ? (
                  <div className={styles.helperTextErr}>{coordinateError.error}</div>
                ) : (
                  <div className={styles.helperText}>
                    {' '}
                    Широта: -90°...90°. Долгота:-180°...180°.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Информация об отеле */}
          <div className={styles.section}>
            <h2>Информация об отеле</h2>
            <div className={styles.field}>
              <label>Описание</label>
              <textarea
                value={hotel.hotelInfo.about}
                onChange={(e) => handleInputChange('hotelInfo.about', e.target.value)}
              />
            </div>
          </div>

          {/* Информация о номерах */}
          <div className={styles.section}>
            <h2>Информация о номерах</h2>
            <div className={styles.field}>
              <label>Описание номеров</label>
              <textarea
                value={hotel.roomInfo?.about}
                onChange={(e) => handleInputChange('roomInfo.about', e.target.value)}
              />
            </div>
          </div>

          {/* Преимущества */}
          <div className={styles.section}>
            <h2>Преимущества</h2>
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
                      const updatedPros = [...(hotel.pros || []), ...newItems];
                      handleInputChange('pros', updatedPros);
                      input.value = '';
                    }
                  }
                }}
              />
            </div>
            <div className={styles.list}>
              {hotel.pros?.map((advantage, index) => (
                <div key={index} className={styles.listItem}>
                  <span>{advantage}</span>
                  <button
                    className={styles.removeButton}
                    onClick={() => {
                      const newPros = hotel.pros?.filter((_, i) => i !== index) || [];
                      handleInputChange('pros', newPros);
                    }}>
                    ×
                  </button>
                </div>
              ))}
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
                      const updatedShortInfo = [...(hotel.shortInfo || []), ...newItems];
                      handleInputChange('shortInfo', updatedShortInfo);
                      input.value = '';
                    }
                  }
                }}
              />
            </div>
            <div className={styles.list}>
              {hotel.shortInfo?.map((info, index) => (
                <div key={index} className={styles.listItem}>
                  <span>{info}</span>
                  <button
                    className={styles.removeButton}
                    onClick={() => {
                      const newShortInfo = hotel.shortInfo?.filter((_, i) => i !== index) || [];
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

export default HotelEditPage;
