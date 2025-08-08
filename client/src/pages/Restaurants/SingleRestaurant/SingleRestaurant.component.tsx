import { IRestaurant } from '../../../types/restaurant.types.ts';
import { getImagePath } from '../../../utils/helpers.ts';
import RestHeader from './RestHeader.tsx';
import RestIcon from '../../../assets/icons/forkAndSpoon.svg';
import FlowerIcon from '../../../assets/icons/flower.svg';
import CookerIcon from '../../../assets/icons/cooker.svg';
import styles from './styles.module.css';
import ImageGallery from 'react-image-gallery';
import { LeftNav, RightNav } from '../../../components/Gallery/NavIcons.tsx';

const SingleRestaurantComponent = ({ restaurant }: { restaurant: IRestaurant }) => {
  return (
    <div className={styles.container}>
      {/* Левая секция - главное изображение */}
      <div className={styles.leftSection}>
        {restaurant.gallery && restaurant.gallery.length > 0 ? (
          <div className={styles.galleryWrapper}>
            <ImageGallery
              items={restaurant.gallery.map((img) => ({
                original: getImagePath(img.path),
                originalAlt: restaurant.name,
              }))}
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
        ) : (
          <img
            src={getImagePath(restaurant.titleImage?.path)}
            alt={restaurant.name}
            className={styles.mainImage}
          />
        )}
      </div>

      {/* Правая секция - информация о ресторане */}
      <div className={styles.rightSection}>
        {/* Имя ресторана */}
        <div className={styles.title}>{restaurant.name}</div>

        {restaurant.description && (
          <>
            <RestHeader title={'РЕСТОРАН'} Icon={RestIcon} />
            <div className={styles.about}>{restaurant.description}</div>
          </>
        )}

        {restaurant.cookDescription && (
          <>
            <RestHeader title={'ШЕВ-ПОВАР'} Icon={CookerIcon} />
            <div className={styles.about}>{restaurant.cookDescription}</div>
          </>
        )}

        {restaurant.shortInfo && restaurant.shortInfo.length > 0 && (
          <>
            <RestHeader title={'ИНФОРМАЦИЯ'} Icon={FlowerIcon} />

            <ul className={styles.infoListCustom}>
              {restaurant.shortInfo.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {/*{restaurant.gallery && restaurant.gallery.length > 0 && (*/}
        {/*  <>*/}
        {/*    <RestHeader title={'ГАЛЛЕРЕЯ'} Icon={GalleryIcon} />*/}
        {/*    <div>*/}
        {/*      /!* 2 картинки из gallery *!/*/}

        {/*      <div className={styles.galleryContainer}>*/}
        {/*        {restaurant.gallery.slice(0, 2).map((img, idx) => (*/}
        {/*          <img*/}
        {/*            key={img._id || idx}*/}
        {/*            src={getImagePath(img.path)}*/}
        {/*            alt={`Restaurant gallery ${idx + 1}`}*/}
        {/*            className={styles.galleryImage}*/}
        {/*          />*/}
        {/*        ))}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </>*/}
        {/*)}*/}
      </div>
    </div>
  );
};

export default SingleRestaurantComponent;
