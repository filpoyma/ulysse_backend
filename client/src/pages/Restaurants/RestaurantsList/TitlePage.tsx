import styles from '../SingleRestaurant/styles.module.css';
import { getImagePath } from '../../../utils/helpers.ts';
import RestHeader from '../SingleRestaurant/RestHeader.tsx';
import FlowerIcon from '../../../assets/icons/flower.svg';
import { useSelector } from 'react-redux';
import { selectRestListMainImage, selectRestListName } from '../../../store/selectors.ts';
import { selectRestaurantsNames } from '../../../store/reSelect.ts';

const TitlePage = () => {
  const titleImage = useSelector(selectRestListMainImage);
  const listName = useSelector(selectRestListName);
  const restNames = useSelector(selectRestaurantsNames);
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

        {restNames && restNames.length > 0 && (
          <>
            <RestHeader title={'ПОДБОРКА РЕСТОРАНОВ'} Icon={FlowerIcon} />

            <ul className={styles.infoListCustom}>
              {restNames.map((item) => (
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
