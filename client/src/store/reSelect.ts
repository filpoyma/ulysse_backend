import { createSelector } from '@reduxjs/toolkit';
import {
  selectFullDataListRestaurants,
  selectHotelsListFull,
  selectMapData,
  selectTravelProgram,
} from './selectors.ts';
import { getImagePath } from '../utils/helpers.ts';

export const selectTravelProgramGallery = createSelector(
  [selectTravelProgram],
  (travelProgram) =>
    travelProgram?.fourthPageDay?.gallery?.map((image) => ({
      original: getImagePath(image.path),
    })) || [],
);

export const selectTravelProgramDaySection = createSelector(
  [selectTravelProgram],
  (travelProgram) => travelProgram?.fourthPageDay?.daysData || [],
);

export const selectTravelProgramImages = createSelector(
  [selectTravelProgram],
  (travelProgram) => travelProgram?.fourthPageDay?.gallery || [],
);

export const selectLogisticsData = createSelector(
  [selectMapData],
  (mapData) => mapData?.logistics || [],
);

export const selectRestaurantsNames = createSelector(
  [selectFullDataListRestaurants],
  (restaurants) =>
    restaurants.map((restaurant) => ({
      name: restaurant.name,
      id: restaurant._id,
    })),
);

export const selectRestsForMap = createSelector([selectFullDataListRestaurants], (rests) => {
  if (!rests) return [];
  return rests.map((rest) => ({
    coordinates: rest.coordinates,
    name: rest.name,
    id: rest._id,
  }));
});

export const selectHotelsNames = createSelector([selectHotelsListFull], (hotels) => {
  if (!hotels) return [];
  return hotels.map((hotel) => ({
    name: hotel.name,
    id: hotel._id,
  }));
});

export const selectHotelsForMap = createSelector([selectHotelsListFull], (hotels) => {
  if (!hotels) return [];
  return hotels.map((hotel) => ({
    coordinates: hotel.coordinates,
    name: hotel.name,
    id: hotel._id,
  }));
});
