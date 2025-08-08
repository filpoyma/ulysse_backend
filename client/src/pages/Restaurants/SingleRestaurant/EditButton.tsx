import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../../store/selectors.ts';

const EditButton = ({
  restaurantListId,
  restaurantId,
}: {
  restaurantListId?: string;
  restaurantId?: string;
}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const id = restaurantId || restaurantListId;
  const navTo = restaurantId
    ? `/admin/restaurants/restaurant/edit/${id}`
    : `/admin/restaurants/list/edit/${id}`;

  if (!isLoggedIn || !id) return null;
  return (
    <div>
      <Link to={navTo} className={styles.editButton}>
        ✎
      </Link>
    </div>
  );
};

export default EditButton;
