import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => (
  <div className={styles.notFoundWrapper}>
    <img
      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
      alt="Путешествие"
      className={styles.notFoundImage}
    />
    <h1 className={styles.notFoundTitle}>404</h1>
    <h2 className={styles.notFoundSubtitle}>Страница не найдена</h2>
    <p className={styles.notFoundText}>
      Похоже, вы заблудились в путешествии! Попробуйте вернуться на главную или
      воспользуйтесь меню.
    </p>
  </div>
);

export default NotFoundPage;
