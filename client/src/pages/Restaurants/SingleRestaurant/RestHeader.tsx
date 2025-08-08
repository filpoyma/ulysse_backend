import styles from './styles.module.css';

const RestHeader = ({ title = 'Название', Icon }: { title: string; Icon?: any }) => {
  return (
    <div>
      <div className={styles.divider} />
      <div className={styles.dividerWrap}>
        {Icon && <Icon width={30} height={30} />}
        <div className={styles.dividerText}>{title}</div>
      </div>

      <div className={styles.divider} />
    </div>
  );
};

export default RestHeader;
