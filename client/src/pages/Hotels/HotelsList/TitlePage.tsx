import styles from '../SingleHotel/SingleHotel.module.css';
import { getImagePath } from '../../../utils/helpers.ts';
import HotelHeader from '../SingleHotel/HotelHeader.tsx';
import FlowerIcon from '../../../assets/icons/flower.svg';
import { useSelector } from 'react-redux';
import { selectHotelListMainImage, selectHotelsListName } from '../../../store/selectors.ts';
import { selectHotelsNames, selectRestaurantsNames } from '../../../store/reSelect.ts';

const TitlePage = () => {
  const titleImage = useSelector(selectHotelListMainImage);
  const listName = useSelector(selectHotelsListName);
  const hotelsNames = useSelector(selectHotelsNames);
  return (
    <div className={styles.container}>
      {/* Левая секция - главное изображение */}
      <div className={styles.leftSection}>
        <img src={getImagePath(titleImage?.path)} alt={listName} className={styles.mainImage} />
      </div>

      {/* Правая секция - информация о списках */}
      <div className={styles.rightSection}>
        {/* Имя ресторана */}
        <div className={styles.title}>{listName}</div>

        {hotelsNames && hotelsNames.length > 0 && (
          <>
            <HotelHeader title={'ПОДБОРКА ОТЕЛЕЙ'} Icon={FlowerIcon} />

            <ul className={styles.infoListCustom}>
              {hotelsNames.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.name}</a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default TitlePage;
