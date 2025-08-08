import { memo, RefObject } from 'react';
import Share2 from '../../assets/icons/share2.svg';
import Sun from '../../assets/icons/sun.svg';
import Menu from '../../assets/icons/menu.svg';

import { useDebouncedCallback } from 'use-debounce';
import { Logo } from '../../assets/icons/Logo.tsx';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import styles from './Header.module.css';
import { createArrayFromNumberWithId } from '../../utils/helpers.ts';

interface HeaderProps {
  currentSection: string;
  navRef: RefObject<HTMLElement>;
  scrollToMap: () => void;
  isLoggedIn: boolean;
  numOfDays: number;
}

const Header = ({ currentSection, navRef, scrollToMap, isLoggedIn, numOfDays }: HeaderProps) => {
  const name_eng = useSelector((state: RootState) => state.travelProgram.program?.name_eng);
  const days = createArrayFromNumberWithId(numOfDays);

  const scrollMenuToCenter = useDebouncedCallback(() => {
    const activeElement = navRef.current?.querySelector(`.${styles.navLinkActive}`);
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
      <Link to={isLoggedIn ? '/admin' : `/travel-programm/${name_eng}`} className={styles.logo}>
        {isLoggedIn ? <span className={styles.adminText}>ADMIN</span> : <Logo />}
      </Link>
      <nav className={styles.nav} ref={navRef}>
        <a
          href="#hero"
          className={`${styles.navLink} ${currentSection === 'hero' ? styles.navLinkActive : ''}`}>
          Титульная страница
        </a>
        <a
          href="#details"
          className={`${styles.navLink} ${
            currentSection === 'details' ? styles.navLinkActive : ''
          }`}>
          Детали маршрута
        </a>
        <a
          href="#map"
          onClick={scrollToMap}
          className={`${styles.navLink} ${currentSection === 'map' ? styles.navLinkActive : ''}`}>
          Карта
        </a>
        {days.map((day) => (
          <a
            key={day.id}
            href={`#day${day.num}`}
            className={`${styles.navLink} ${
              currentSection === `day${day.num}` ? styles.navLinkActive : ''
            }`}>
            День {day.num}
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

export default memo(Header);
