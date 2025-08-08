import React from 'react';
import IconFlighrArrivalMarker from './flightArrivalMarker.svg';
import IconFlight from './flight.svg';
import IconHotelMarker from './hotelMarker.svg';
import IconTrain from './train.svg';
import IconYacht from './yacht.svg';
import IconDriving from './driving.svg';
import IconFlightDepartureMarker from './flightDepartureMarker.svg';
import IconParkMarker from './parkMarker.svg';
import IconPhotoSpotMarker from './photospotMarker.svg';
import IconRestMarker from './restaurantMarker.svg';
import IconSightMarker from './sightMarker.svg';

const iconsMapList: Record<string, React.ReactNode> = {
  flightArrivalMarker: <IconFlighrArrivalMarker height={44} width={37} />,
  flightDepartureMarker: <IconFlightDepartureMarker height={44} width={37} />,
  hotelMarker: <IconHotelMarker height={44} width={37} />,
  parkMarker: <IconParkMarker height={44} width={37} />,
  photoSpotMarker: <IconPhotoSpotMarker height={44} width={37} />,
  sightMarker: <IconSightMarker height={44} width={37} />,
  restMarker: <IconRestMarker height={44} width={37} />,
  flight: <IconFlight height={37} width={37} />,
  train: <IconTrain height={37} width={37} />,
  yacht: <IconYacht height={37} width={37} />,
  driving: <IconDriving height={37} width={37} />,
};

export default iconsMapList;
