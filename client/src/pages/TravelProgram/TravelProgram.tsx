import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header.tsx';
import ImageUploadModal from '../../components/ImageUploadModal/ImageUploadModal.tsx';
import { useSelector } from 'react-redux';
import { travelProgramService } from '../../services/travelProgram.service.ts';
import { IFirstPageData as FirstPageType } from '../../types/travelProgram.types.ts';
import { selectIsLoggedIn, selectTravelProgram } from '../../store/selectors.ts';
import useIsMobile from '../../hooks/useIsMobile.tsx';
import styles from './TravelProgram.module.css';
import MobileLayout from './components/MobileLayout';
import DesktopLayout from './components/DesktopLayout';
import { Loader } from '../../components/Loader/Loader.tsx';
import NotFoundPage from '../NotFoundPage/NotFoundPage.tsx';
import { getImagePath } from '../../utils/helpers.ts';

const DEFAULT_FIRST_PAGE: FirstPageType = {
  title: '',
  subtitle: '',
  footer: '',
};

const TravelProgram: React.FC = () => {
  const { programName } = useParams();
  const detailsRef = useRef<HTMLElement>(null);
  const headerNavRef = useRef<HTMLElement>(null);
  const [currentSection, setCurrentSection] = useState('hero');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const selectedImageNumberRef = useRef<number | null>(0);
  const isMobile = useIsMobile();
  const [markerId, setMarkerId] = useState<string | null>(null);

  const program = useSelector(selectTravelProgram);
  const numOfDays = (program?.fourthPageDay.daysData || []).length;
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const firstPage: FirstPageType = program?.firstPage || DEFAULT_FIRST_PAGE;

  useEffect(() => {
    if (programName) {
      travelProgramService
        .getByName(programName)
        .catch(console.error)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [programName]);

  // const scrollToHero = useCallback(() => {
  //   //setCurrentSection('hero');
  // }, []);

  const scrollToDetails = useCallback(() => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentSection('details');
  }, []);

  const scrollToMap = useCallback(() => {
    //setCurrentSection('map');
  }, []);

  const scrollToDay = useCallback(() => {
    const daySection = document.getElementById('day0');
    if (daySection) {
      if (isMobile) {
        daySection.scrollIntoView({ behavior: 'smooth' });
      } else {
        const rightSide = document.querySelector(`.${styles.rightSide}`);
        if (rightSide) {
          rightSide.scrollTo({
            top: daySection.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      }
    }
    setCurrentSection('day0');
  }, [isMobile]);

  const scrollY = (element: HTMLElement, leftSideHeight: number, elScrolled: number) => {
    let translateY = leftSideHeight;
    if (elScrolled > 0) {
      translateY = Math.max(0, leftSideHeight - elScrolled);
    }
    element.style.transform = `translateY(${translateY}px)`;
  };

  const handleScroll = useCallback(() => {
    const rightSide = document.querySelector(`.${styles.rightSide}`);
    const leftSide = document.querySelector(`.${styles.leftSide}`);
    if (!rightSide || !leftSide || isMobile) return;

    const detailsSection = document.getElementById('details');
    const leftSideImages = document.querySelectorAll(`.${styles.backgroundImage}`);
    const mapSection = document.getElementById('map');
    const daySection = document.getElementById('day1');

    if (!detailsSection || !mapSection || !daySection) return;

    const headerHeight = 80;
    const scrollTop = rightSide.scrollTop;
    const leftSideHeight = (leftSide as HTMLElement).offsetHeight;

    const detailsSectionStart = detailsSection.offsetTop - leftSideHeight;
    const detailsScrolled = scrollTop + headerHeight - detailsSectionStart;

    const mapSectionStart = (mapSection as HTMLElement).offsetTop - leftSideHeight;
    const mapScrolled = scrollTop + headerHeight - mapSectionStart;

    const daySectionStart = (daySection as HTMLElement).offsetTop - leftSideHeight;
    const dayScrolled = scrollTop + headerHeight - daySectionStart;

    const secondImage = leftSideImages[1] as HTMLElement;
    const thirdImage = leftSideImages[2] as HTMLElement;
    const fourthImage = leftSideImages[3] as HTMLElement;

    scrollY(secondImage, leftSideHeight, detailsScrolled);
    scrollY(thirdImage, leftSideHeight, mapScrolled);
    scrollY(fourthImage, leftSideHeight, dayScrolled);
  }, [isMobile]);

  const handleWindowScroll = useCallback(() => {
    if (!isMobile) return;
  }, [isMobile]);

  useEffect(() => {
    if (isLoading) return;
    const rightSide = document.querySelector(`.${styles.rightSide}`);
    if (!rightSide) return;

    // Удаляем все обработчики
    window.removeEventListener('scroll', handleWindowScroll);
    rightSide.removeEventListener('scroll', handleScroll);
    // window.removeEventListener('resize', handleResize);

    if (isMobile) {
      window.addEventListener('scroll', handleWindowScroll);
    } else {
      rightSide.addEventListener('scroll', handleScroll);
      setTimeout(handleScroll, 100);
    }

    // Добавляем нужные обработчики
    // handleResize();
    // window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      rightSide.removeEventListener('scroll', handleScroll);
      // window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleWindowScroll, isLoading]);

  useEffect(() => {
    if (isMobile || isLoading) return;
    const rightSide = document.querySelector(`.${styles.rightSide}`);
    if (!rightSide) return;

    const hero = document.getElementById('hero');
    const details = document.getElementById('details');
    const map = document.getElementById('map');
    const daysSection = document.querySelectorAll('[data-days="days"] > div');
    const days = Array.from(daysSection);

    const createDaysSections = days.map((el, i) => ({ el: el, name: `day${i + 1}` }));

    const sections = [
      { el: hero, name: 'hero' },
      { el: details, name: 'details' },
      { el: map, name: 'map' },
      ...createDaysSections,
    ];

    const observer = new window.IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);
        if (visible.length > 0) {
          const entry = visible[0];
          const found = sections.find((s) => s.el === entry.target);
          if (found) {
            switch (found.name) {
              case 'hero':
                selectedImageNumberRef.current = 0;
                break;
              case 'details':
                selectedImageNumberRef.current = 1;
                break;
              default:
                selectedImageNumberRef.current = null;
                break;
            }
            setCurrentSection(found.name);
          }
        }
      },
      {
        root: rightSide,
        threshold: 0.3,
      },
    );

    sections.forEach((section) => {
      if (section.el) observer.observe(section.el);
    });

    return () => observer.disconnect();
  }, [isMobile, isLoading]);

  const firstPageBg = getImagePath(program?.bgImages[0]?.path);
  const secondPageBg = getImagePath(program?.bgImages[1]?.path);

  if (isLoading) return <Loader />;
  if (!program) return <NotFoundPage />;

  return (
    <>
      <Header
        currentSection={currentSection}
        navRef={headerNavRef}
        scrollToMap={scrollToMap}
        isLoggedIn={isLoggedIn}
        numOfDays={numOfDays}
      />
      {isLoggedIn && (
        <ImageUploadModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          programName={programName}
          imageNumber={selectedImageNumberRef.current}
        />
      )}
      {isMobile ? (
        <MobileLayout
          firstPageBg={firstPageBg}
          secondPageBg={secondPageBg}
          firstPage={firstPage}
          programName={programName}
          isLoggedIn={isLoggedIn}
          onScrollToDetails={scrollToDetails}
          onScrollToDay={scrollToDay}
          setIsModalOpen={setIsModalOpen}
          detailsRef={detailsRef}
          markerId={markerId}
          setMarkerId={setMarkerId}
        />
      ) : (
        <DesktopLayout
          firstPageBg={firstPageBg}
          secondPageBg={secondPageBg}
          firstPage={firstPage}
          programName={programName}
          isLoggedIn={isLoggedIn}
          onScrollToDetails={scrollToDetails}
          onScrollToDay={scrollToDay}
          setIsModalOpen={setIsModalOpen}
          detailsRef={detailsRef}
          markerId={markerId}
          setMarkerId={setMarkerId}
        />
      )}
    </>
  );
};

export default TravelProgram;
