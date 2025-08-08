import styles from './DetailsSection.module.css';
import { DetailsTabs } from './DetailsTabs.tsx';
import stylesTable from './index.module.css';

const StickyHeader = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <div className={styles.title}>
      <h2 className={styles.detailsTitle}>ДЕТАЛИ МАРШРУТА</h2>
      <DetailsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'accommodation' ? (
        <div className={`${stylesTable['details-header']} ${stylesTable['accommodation-table']}`}>
          <div className={stylesTable['table-header']}>
            <div className={stylesTable['header-cell']}>День</div>
            <div className={stylesTable['header-cell']}>Проживание</div>
            <div className={stylesTable['header-cell']}>Детали</div>
            <div className={stylesTable['header-cell']}>Ночи</div>
          </div>
        </div>
      ) : (
        <div className={`${stylesTable['details-header']} ${stylesTable['overview-table']}`}>
          <div className={stylesTable['table-header']}>
            <div className={stylesTable['header-cell']}>День</div>
            <div className={stylesTable['header-cell']}>Рейс</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyHeader;
