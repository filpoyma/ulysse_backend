import { forwardRef, useState } from 'react';
import { OverviewTable } from './OverviewTable';
import { FlightsTable } from './FlightsTable';
import { AccommodationTable } from './AccommodationTable';
import styles from './DetailsSection.module.css';
import StickyHeader from './StickyHeader.tsx';

const DetailsSection = forwardRef<HTMLElement>((_, ref) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section id="details" ref={ref} className={styles.contentSection}>
      <div className={styles.contentWrapper}>
        <StickyHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'overview' && <OverviewTable />}
        {activeTab === 'flights' && <FlightsTable />}
        {activeTab === 'accommodation' && <AccommodationTable />}
      </div>
    </section>
  );
});

DetailsSection.displayName = 'DetailsSection';

export default DetailsSection;
