import Map from '../../assets/icons/map.svg';
import Plane from '../../assets/icons/plane.svg';
import Home from '../../assets/icons/home.svg';

interface DetailsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DetailsTabs({ activeTab, onTabChange }: DetailsTabsProps) {
  return (
    <div className="details-tabs">
      <button
        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => onTabChange('overview')}>
        <Map width={24} height={24} />
        <span>Обзор</span>
      </button>
      <button
        className={`tab ${activeTab === 'flights' ? 'active' : ''}`}
        onClick={() => onTabChange('flights')}>
        <Plane width={24} height={24} />
        <span>Рейсы</span>
      </button>
      <button
        className={`tab ${activeTab === 'accommodation' ? 'active' : ''}`}
        onClick={() => onTabChange('accommodation')}>
        <Home width={24} height={24} />
        <span>Проживание</span>
      </button>
    </div>
  );
}
