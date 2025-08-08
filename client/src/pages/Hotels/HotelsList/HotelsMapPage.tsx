import styles from '../SingleHotel/SingleHotel.module.css';
import HotelHeader from '../SingleHotel/HotelHeader.tsx';
import FlowerIcon from '../../../assets/icons/flower.svg';
import { useSelector } from 'react-redux';
import { selectHotelsListName } from '../../../store/selectors.ts';
import { selectHotelsForMap, selectHotelsNames } from '../../../store/reSelect.ts';
import { Loader } from '../../../components/Loader/Loader.tsx';
import { Suspense, useState } from 'react';
import MapBoxWithMarkers from '../../../components/MapBox/MapBox.marker.component.tsx';

const HotelsMapPage = () => {
  const listName = useSelector(selectHotelsListName);
  const hotelsNames = useSelector(selectHotelsNames);
  const [currentHotelId, setCurrentHotelId] = useState<string | null>(null);
  const points = useSelector(selectHotelsForMap);

  return (
    <div className={styles.container}>
      {/* Левая секция - главное изображение */}
      <div className={styles.leftSectionMap}>
        <Suspense fallback={<Loader />}>
          <MapBoxWithMarkers markerId={currentHotelId} points={points} />
        </Suspense>
      </div>

      {/* Правая секция - информация о списках */}
      <div className={styles.rightSection}>
        {/* Имя ресторана */}
        <div className={styles.title}>{listName}</div>

        {hotelsNames && hotelsNames.length > 0 && (
          <>
            <HotelHeader title={'КАРТА ОТЕЛЕЙ'} Icon={FlowerIcon} />

            <ul className={styles.infoListCustom}>
              {hotelsNames.map((item) => (
                <li key={item.id} onClick={() => setCurrentHotelId(item.id)}>
                  {item.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default HotelsMapPage;
