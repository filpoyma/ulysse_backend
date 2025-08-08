import { FC, useState, useEffect } from 'react';
import styles from '../adminLayout.module.css';
import IconExit from '../../../assets/icons/exit.svg';
import { NavLink, useLocation } from 'react-router-dom';

interface AdminNavProps {
  handleLogout: () => void;
}

const AdminNav: FC<AdminNavProps> = ({ handleLogout }) => {
  const location = useLocation();
  const [isHotelsMenuOpen, setIsHotelsMenuOpen] = useState(false);
  const [isRestaurantsMenuOpen, setIsRestaurantsMenuOpen] = useState(false);

  // Определяем активные состояния
  const isHotelsActive = location.pathname.startsWith('/admin/hotels');
  const isRestaurantsActive = location.pathname.startsWith('/admin/restaurants');
  const isItinerariesActive = location.pathname === '/admin' || location.pathname === '/admin/';

  // Закрываем выпадающие меню при клике вне их области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const nav = target.closest(`.${styles.nav}`);

      if (nav) {
        const hotelsContainer = nav.querySelector(`.${styles.dropdownContainer}:nth-child(2)`);
        const restaurantsContainer = nav.querySelector(`.${styles.dropdownContainer}:nth-child(3)`);

        // Если клик не в области выпадающих меню, закрываем их
        if (!hotelsContainer?.contains(target) && !restaurantsContainer?.contains(target)) {
          setIsHotelsMenuOpen(false);
          setIsRestaurantsMenuOpen(false);
        }
      } else {
        // Если клик вне навигации, закрываем все меню
        setIsHotelsMenuOpen(false);
        setIsRestaurantsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Функции для управления выпадающими меню
  const handleHotelsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    setIsHotelsMenuOpen(!isHotelsMenuOpen);
    setIsRestaurantsMenuOpen(false); // Закрываем другое меню
  };

  const handleRestaurantsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    setIsRestaurantsMenuOpen(!isRestaurantsMenuOpen);
    setIsHotelsMenuOpen(false); // Закрываем другое меню
  };

  const handleHotelsItemClick = () => {
    setIsHotelsMenuOpen(false);
  };

  const handleRestaurantsItemClick = () => {
    setIsRestaurantsMenuOpen(false);
  };

  const handleCloseDropdowns = () => {
    setIsHotelsMenuOpen(false);
    setIsRestaurantsMenuOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive || isItinerariesActive ? styles.active : ''}`
        }
        end
        onClick={handleCloseDropdowns}>
        Itineraries
      </NavLink>

      <div className={styles.dropdownContainer}>
        <button
          className={`${styles.navItem} ${isHotelsActive ? styles.active : ''}`}
          onClick={handleHotelsClick}>
          Hotels
        </button>
        <div
          className={`${styles.dropdownMenu} ${
            isHotelsMenuOpen ? styles.dropdownMenuVisible : ''
          }`}>
          <NavLink
            to="/admin/hotels"
            className={({ isActive }) => `${styles.dropdownItem} ${isActive ? styles.active : ''}`}
            onClick={handleHotelsItemClick}>
            Single Hotel
          </NavLink>
          <NavLink
            to="/admin/hotels/lists"
            className={({ isActive }) => `${styles.dropdownItem} ${isActive ? styles.active : ''}`}
            onClick={handleHotelsItemClick}>
            Hotels List
          </NavLink>
        </div>
      </div>

      <div className={styles.dropdownContainer}>
        <button
          className={`${styles.navItem} ${isRestaurantsActive ? styles.active : ''}`}
          onClick={handleRestaurantsClick}>
          Restaurants
        </button>
        <div
          className={`${styles.dropdownMenu} ${
            isRestaurantsMenuOpen ? styles.dropdownMenuVisible : ''
          }`}>
          <NavLink
            to="/admin/restaurants"
            className={({ isActive }) => `${styles.dropdownItem} ${isActive ? styles.active : ''}`}
            onClick={handleRestaurantsItemClick}>
            Single Rest
          </NavLink>
          <NavLink
            to="/admin/restaurants/lists"
            className={({ isActive }) => `${styles.dropdownItem} ${isActive ? styles.active : ''}`}
            onClick={handleRestaurantsItemClick}>
            Rest List
          </NavLink>
        </div>
      </div>

      <NavLink
        to="/admin/info"
        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        onClick={handleCloseDropdowns}>
        Info
      </NavLink>

      <NavLink
        to="/admin/references"
        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        onClick={handleCloseDropdowns}>
        References
      </NavLink>

      <button className={styles.logoutButton} onClick={handleLogout}>
        <IconExit width={24} height={24} />
      </button>
    </nav>
  );
};

export default AdminNav;
