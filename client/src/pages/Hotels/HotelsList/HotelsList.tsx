import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { hotelsListService } from '../../../services/hotelsList.service.ts';
import { useSelector } from 'react-redux';
import { selectHotelsListFull } from '../../../store/selectors.ts';
import SingleHotelComponent from '../SingleHotel/SingleHotel.component.tsx';
import styles from './styles.module.css';
import HotelsHeader from '../HotelsHeader/HotelsHeader.tsx';
import TitlePage from './TitlePage.tsx';
import HotelsMapPage from './HotelsMapPage.tsx';

const HotelsList = () => {
  const { id } = useParams();
  const hotels = useSelector(selectHotelsListFull);
  const hotelsListFull = useSelector(selectHotelsListFull);
  const [currentSection, setCurrentSection] = useState('hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const restaurantRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titlePageRef = useRef<HTMLDivElement>(null);
  const mapPageRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (id) hotelsListService.getFullById(id).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!hotelsListFull) return;
    const observerOptions = {
      root: containerRef.current,
      rootMargin: '0px 0px -60% 0px', // Срабатывает, когда верхняя часть ресторана входит в верхнюю треть контейнера
      threshold: 0.1,
    };
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        setCurrentSection(visible[0].target.id);
      }
    };
    const observer = new window.IntersectionObserver(handleIntersect, observerOptions);
    if (titlePageRef.current) observer.observe(titlePageRef.current);
    if (mapPageRef.current) observer.observe(mapPageRef.current);
    restaurantRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      observer.disconnect();
    };
  }, [hotelsListFull]);

  return (
    <div className={styles.container} ref={containerRef}>
      <HotelsHeader currentSection={currentSection} />
      <div ref={titlePageRef} id={'hero'}>
        <TitlePage />
      </div>
      <div ref={mapPageRef} id={'map'}>
        <HotelsMapPage />
      </div>
      {hotels?.map((hotel, i) => {
        return (
          <div key={hotel._id} id={hotel._id} ref={(el) => (restaurantRefs.current[i] = el)}>
            <SingleHotelComponent hotel={hotel} />
          </div>
        );
      })}
    </div>
  );
};

export default HotelsList;
