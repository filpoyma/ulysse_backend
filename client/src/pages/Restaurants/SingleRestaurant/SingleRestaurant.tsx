import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../../../components/Loader/Loader.tsx';
import NotFoundPage from '../../NotFoundPage/NotFoundPage.tsx';
import { restaurantService } from '../../../services/restaurant.service.ts';
import { IRestaurant } from '../../../types/restaurant.types.ts';
import SingleRestaurantComponent from './SingleRestaurant.component.tsx';
import EditButton from './EditButton.tsx';

const SingleRestaurant = () => {
  const { name } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);

  React.useEffect(() => {
    if (name)
      restaurantService
        .getByName(name)
        .then((restaurant) => {
          console.log('Hotel data received:', restaurant);
          setRestaurant(restaurant.data);
        })
        .catch((error) => {
          console.error('Error fetching restaurant:', error);
        })
        .finally(() => setIsLoading(false));
  }, [name]);

  if (isLoading) return <Loader />;
  if (!restaurant) return <NotFoundPage />;

  return (
    <>
      <EditButton restaurantId={restaurant._id} />
      <SingleRestaurantComponent restaurant={restaurant} />
    </>
  );
};

export default SingleRestaurant;
