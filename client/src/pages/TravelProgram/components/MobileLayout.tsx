import React, { Suspense } from 'react';
import { IFirstPageData } from '../../../types/travelProgram.types';
import FirstPage from '../../../components/FirstPage/FirstPage';
import DetailsSection from '../../../components/DetailsSection/DetailsSection.tsx';

const MapBoxWithTrack = React.lazy(
  () => import('../../../components/MapBox/MapBox.track.component.tsx'),
);

import MapPage from '../../../components/MapPage/MapPage';
import DaySection from '../../../components/DaySection/DaySection';
import styles from '../TravelProgram.module.css';
import { Loader } from '../../../components/Loader/Loader.tsx';

interface MobileLayoutProps {
  firstPageBg: string;
  secondPageBg: string;
  firstPage: IFirstPageData;
  programName: string | undefined;
  isLoggedIn: boolean;
  onScrollToDetails: () => void;
  onScrollToDay: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
  detailsRef: React.RefObject<HTMLElement>;
  markerId: string | null;
  setMarkerId: (id: string) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  firstPageBg,
  secondPageBg,
  firstPage,
  programName,
  isLoggedIn,
  onScrollToDetails,
  // onScrollToDay,
  setIsModalOpen,
  detailsRef,
  markerId,
  setMarkerId,
}) => (
  <div className={styles.pageContainer}>
    <div className={styles.backgroundImage}>
      <img
        src={firstPageBg}
        alt="First page background"
        onClick={() => setIsModalOpen(true)}
        className={styles.leftSideBgImage}
      />
    </div>
    <section>
      <FirstPage
        firstPage={firstPage}
        programName={programName}
        isLoggedIn={isLoggedIn}
        onScrollToDetails={onScrollToDetails}
      />
    </section>
    <div className={styles.backgroundImage}>
      <img
        src={secondPageBg}
        alt="Second page background"
        onClick={() => setIsModalOpen(true)}
        className={styles.leftSideBgImage}
      />
    </div>
    <section>
      <DetailsSection ref={detailsRef} />
    </section>
    <div className={styles.backgroundImage}>
      <Suspense fallback={<Loader />}>
        <MapBoxWithTrack isLoggedIn={isLoggedIn} markerId={markerId} />
      </Suspense>
    </div>
    <section>
      <MapPage isLoggedIn={isLoggedIn} setMarkerId={setMarkerId} />
    </section>
    <div className={styles.backgroundImage}>
      <img
        src={secondPageBg}
        alt="Day section background"
        onClick={() => setIsModalOpen(true)}
        className={styles.leftSideBgImage}
      />
    </div>
    <section>
      <DaySection />
    </section>
  </div>
);

export default MobileLayout;
