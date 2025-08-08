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
import DaysGallery from '../../../components/Gallery/DaysGallery.tsx';
import { Loader } from '../../../components/Loader/Loader.tsx';

interface DesktopLayoutProps {
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

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  firstPageBg,
  secondPageBg,
  firstPage,
  programName,
  isLoggedIn,
  onScrollToDetails,
  setIsModalOpen,
  detailsRef,
  markerId,
  setMarkerId,
}) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftSide}>
        <div className={styles.backgroundImage}>
          <img
            src={firstPageBg}
            alt="First page background"
            onClick={() => setIsModalOpen(true)}
            className={styles.leftSideBgImage}
          />
        </div>
        <div className={styles.backgroundImage}>
          <img
            src={secondPageBg}
            alt="Second page background"
            onClick={() => setIsModalOpen(true)}
            className={styles.leftSideBgImage}
          />
        </div>
        <div className={styles.backgroundImage}>
          <Suspense fallback={<Loader />}>
            <MapBoxWithTrack isLoggedIn={isLoggedIn} markerId={markerId} />
          </Suspense>
        </div>
        <div className={styles.backgroundImage}>
          <DaysGallery isLoggedIn={isLoggedIn} />
        </div>
      </div>
      <div className={styles.rightSide}>
        <FirstPage
          firstPage={firstPage}
          programName={programName}
          isLoggedIn={isLoggedIn}
          onScrollToDetails={onScrollToDetails}
        />
        <DetailsSection ref={detailsRef} />
        <MapPage isLoggedIn={isLoggedIn} setMarkerId={setMarkerId} />
        <DaySection />
      </div>
    </div>
  );
};

export default DesktopLayout;
