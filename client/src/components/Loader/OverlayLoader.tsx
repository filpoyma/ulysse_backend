import styles from "./Loader.module.css";

interface OverlayLoaderProps {
  isLoading: boolean;
}

const OverlayLoader = ({ isLoading }: OverlayLoaderProps) => {
  if (!isLoading) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
};

export default OverlayLoader;
