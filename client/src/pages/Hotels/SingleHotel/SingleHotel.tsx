import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import 'react-image-gallery/styles/css/image-gallery.css';
import { hotelService } from '../../../services/hotel.service.ts';
import { IHotel } from '../../../types/hotel.types.ts';
import { Loader } from '../../../components/Loader/Loader.tsx';
import NotFoundPage from '../../NotFoundPage/NotFoundPage.tsx';
import SingleHotelComponent from './SingleHotel.component.tsx';

const SingleHotel = () => {
  const { name } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hotel, setHotel] = useState<IHotel | null>(null);

  React.useEffect(() => {
    if (name)
      hotelService
        .getByName(name)
        .then((hotel) => {
          console.log('Hotel data received:', hotel);
          setHotel(hotel.data);
        })
        .catch((error) => {
          console.error('Error fetching hotel:', error);
        })
        .finally(() => setIsLoading(false));
  }, [name]);

  if (isLoading) return <Loader />;
  if (!hotel) return <NotFoundPage />;

  return <SingleHotelComponent hotel={hotel} />;
};

export default SingleHotel;
