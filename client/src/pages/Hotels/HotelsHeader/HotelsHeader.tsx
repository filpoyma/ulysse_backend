import { memo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Share2 from '../../../assets/icons/share2.svg';
import Sun from '../../../assets/icons/sun.svg';
import Menu from '../../../assets/icons/menu.svg';
import { useDebouncedCallback } from 'use-debounce';

import { Logo } from '../../../assets/icons/Logo.tsx';
import styles from './styles.module.css';
import {
  selectHotelsListId,
  selectHotelsListName,
  selectIsLoggedIn,
  selectRestListId,
  selectRestListName,
} from '../../../store/selectors.ts';
import { selectHotelsNames, selectRestaurantsNames } from '../../../store/reSelect.ts';

interface HeaderProps {
  currentSection: string;
}

const HotelsHeader = ({ currentSection }: HeaderProps) => {
  const headerNavRef = useRef<HTMLElement>(null);
  const listName = useSelector(selectHotelsListName);
  const listId = useSelector(selectHotelsListId);
  const hotelsNames = useSelector(selectHotelsNames);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const scrollMenuToCenter = useDebouncedCallback(() => {
    const activeElement = headerNavRef.current?.querySelector(`.${styles.navLinkActive}`);
    if (activeElement) {
      (activeElement as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, 300);

  scrollMenuToCenter();

  return (
    <header className={styles.header}>
      <Link
        to={isLoggedIn ? `/admin/hotels/list/edit/${listId}` : `/hotels/${listName}`}
        className={styles.logo}>
        {isLoggedIn ? <span className={styles.adminText}>EDIT</span> : <Logo />}
      </Link>
      <nav className={styles.nav} ref={headerNavRef}>
        <a
          href="#hero"
          className={`${styles.navLink} ${currentSection === 'hero' ? styles.navLinkActive : ''}`}>
          {listName}
        </a>
        <a
          href="#map"
          className={`${styles.navLink} ${currentSection === 'map' ? styles.navLinkActive : ''}`}>
          Карта
        </a>
        {hotelsNames.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`${styles.navLink} ${
              currentSection === `${item.id}` ? styles.navLinkActive : ''
            }`}>
            {item.name}
          </a>
        ))}
      </nav>
      <div className={styles.utilities}>
        <Share2 height={20} width={20} className={styles.utilityIcon} />
        <Sun height={20} width={20} className={styles.utilityIcon} />
        <Menu height={20} width={20} className={styles.utilityIcon} />
      </div>
    </header>
  );
};

export default memo(HotelsHeader);
