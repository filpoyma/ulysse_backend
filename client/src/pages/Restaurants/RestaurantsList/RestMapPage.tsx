import styles from '../SingleRestaurant/styles.module.css';
import RestHeader from '../SingleRestaurant/RestHeader.tsx';
import FlowerIcon from '../../../assets/icons/flower.svg';
import { useSelector } from 'react-redux';
import { selectRestListName } from '../../../store/selectors.ts';
import { selectRestaurantsNames, selectRestsForMap } from '../../../store/reSelect.ts';
import { Loader } from '../../../components/Loader/Loader.tsx';
import MapBoxWithMarkers from '../../../components/MapBox/MapBox.marker.component.tsx';
import { Suspense, useState } from 'react';

const RestMapPage = () => {
  const listName = useSelector(selectRestListName);
  const restNames = useSelector(selectRestaurantsNames);
  const [currentRestId, setCurrentRestId] = useState<string | null>(null);
  const points = useSelector(selectRestsForMap);
  return (
    <div className={styles.container}>
      {/* Левая секция - главное изображение */}
      <div className={styles.leftSectionMap}>
        <Suspense fallback={<Loader />}>
          <MapBoxWithMarkers markerId={currentRestId} points={points} />
        </Suspense>
      </div>

      {/* Правая секция - информация о списках */}
      <div className={styles.rightSection}>
        {/* Имя ресторана */}
        <div className={styles.title}>{listName}</div>

        {restNames && restNames.length > 0 && (
          <>
            <RestHeader title={'КАРТА РЕСТОРАНОВ'} Icon={FlowerIcon} />

            <ul className={styles.infoListCustom}>
              {restNames.map((item) => (
                <li key={item.id} onClick={() => setCurrentRestId(item.id)}>
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

export default RestMapPage;
