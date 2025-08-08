import styles from './SingleHotel.module.css';

const HotelHeader = ({ title = 'Название', Icon }: { title: string; Icon?: any }) => {
  return (
    <div>
      <div className={styles.dividerList} />
      <div className={styles.dividerWrap}>
        {Icon && <Icon width={30} height={30} />}
        <div className={styles.dividerText}>{title}</div>
      </div>

      <div className={styles.dividerList} />
    </div>
  );
};

export default HotelHeader;
