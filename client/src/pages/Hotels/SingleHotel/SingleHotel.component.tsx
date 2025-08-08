import styles from './SingleHotel.module.css';
import ImageGallery from 'react-image-gallery';
import { LeftNav, RightNav } from '../../../components/Gallery/NavIcons.tsx';
import PlusCircle from '../../../assets/icons/plusInCircle.svg';
import InfoCircle from '../../../assets/icons/infoInCircle.svg';
import { IHotel } from '../../../types/hotel.types.ts';
import { getImagePath } from '../../../utils/helpers.ts';
const SingleHotelComponent = ({ hotel }: { hotel: IHotel }) => {

  const hotelGalleryImages =
    hotel.hotelInfo?.gallery?.map((img) => ({
      original: getImagePath(img.path),
      thumbnail: getImagePath(img.path),
    })) || [];

  const roomGalleryImages =
    hotel.roomInfo?.gallery?.map((img) => ({
      original: getImagePath(img.path),
      thumbnail: getImagePath(img.path),
    })) || [];

  return (
    <div className={styles.container}>
      {/* Левая секция - главное изображение */}
      <div className={styles.leftSection}>
        <img
          src={getImagePath(hotel.mainImage?.path)}
          alt={hotel.name}
          className={styles.mainImage}
        />
      </div>

      {/* Правая секция - информация об отеле */}
      <div className={styles.rightSection}>
        {/* Заголовок */}
        <h1 className={styles.title}>{hotel.name}</h1>
        <div className={styles.divider}></div>

        {/* Информация об отеле */}
        <h2 className={styles.subtitle}>Информация об отеле</h2>
        <div className={styles.about}>{hotel.hotelInfo?.about || 'Описание отсутствует'}</div>

        {/* Галерея отеля */}
        {hotel.hotelInfo?.gallery && hotel.hotelInfo.gallery.length > 0 && (
          <div className={styles.gallery}>
            <ImageGallery
              items={hotelGalleryImages}
              showFullscreenButton={false}
              showPlayButton={false}
              showNav={true}
              showThumbnails={false}
              slideOnThumbnailOver={true}
              showBullets={true}
              renderLeftNav={(onClick: () => void, disabled: boolean) => (
                <LeftNav onClick={onClick} disabled={disabled} />
              )}
              renderRightNav={(onClick: () => void, disabled: boolean) => (
                <RightNav onClick={onClick} disabled={disabled} />
              )}
            />
          </div>
        )}

        <div className={styles.divider}></div>

        {/* Проживание */}
        <h2 className={styles.subtitle}>Проживание</h2>
        <h3 className={styles.subtitle}>Комнаты</h3>
        <div className={styles.about}>{hotel.roomInfo?.about || 'Описание комнат отсутствует'}</div>

        {/* Галерея комнат */}
        {hotel.roomInfo?.gallery && hotel.roomInfo.gallery.length > 0 && (
          <div className={styles.gallery}>
            <ImageGallery
              items={roomGalleryImages}
              showFullscreenButton={false}
              showPlayButton={false}
              showNav={true}
              showThumbnails={false}
              slideOnThumbnailOver={true}
              showBullets={true}
              renderLeftNav={(onClick: () => void, disabled: boolean) => (
                <LeftNav onClick={onClick} disabled={disabled} />
              )}
              renderRightNav={(onClick: () => void, disabled: boolean) => (
                <RightNav onClick={onClick} disabled={disabled} />
              )}
            />
          </div>
        )}

        <div className={styles.divider}></div>

        {/* Основная информация */}
        <h3 className={styles.subtitle}>Основная информация:</h3>

        {/* Преимущества */}

        <div className={styles.infoContainer}>
          <PlusCircle height={31} width={31} />
          <div>Преимущества</div>
        </div>
        <ul className={styles.infoList}>
          {hotel.pros.map((pro, index) => (
            <li key={index}>{pro}</li>
          ))}
        </ul>

        {/* Краткая информация */}
        <div className={styles.infoContainer}>
          <InfoCircle height={31} width={31} />
          <div>Краткая информация</div>
        </div>
        <ul className={styles.infoList}>
          {hotel.shortInfo?.map((info, index) => <li key={index}>{info}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default SingleHotelComponent;
