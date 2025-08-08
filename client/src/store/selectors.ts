import { RootState } from '../store';

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAdminName = (state: RootState) => state.auth.user?.name;
export const selectAdminEmail = (state: RootState) => state.auth.user?.email;

export const selectCountries = (state: RootState) => state.countries.data;

export const selectTravelProgram = (state: RootState) => state.travelProgram.program;
export const selectTravelPrograms = (state: RootState) => state.travelProgram.programs;

export const selectMapData = (state: RootState) => state.travelProgram.program?.thirdPageMap;

export const selectHotels = (state: RootState) => state.hotelsData.hotels;
export const selectHotelsList = (state: RootState) => state.hotelsData.hotelsList;
export const selectHotelsListFull = (state: RootState) => state.hotelsData.hotelsListFull?.hotels;
export const selectHotelsListName = (state: RootState) =>
  state.hotelsData.hotelsListFull?.name || '';
export const selectHotelsListId = (state: RootState) => state.hotelsData.hotelsListFull?._id || '';

export const selectHotelListMainImage = (state: RootState) =>
  state.hotelsData.hotelsListFull?.titleImage;

export const selectRestaurants = (state: RootState) => state.restaurantsData.restaurants;
export const selectRestaurantsList = (state: RootState) => state.restaurantsData.restaurantsList;
export const selectRestListName = (state: RootState) =>
  state.restaurantsData.restaurantsListFull?.name || '';
export const selectRestListId = (state: RootState) =>
  state.restaurantsData.restaurantsListFull?._id || '';
export const selectRestListMainImage = (state: RootState) =>
  state.restaurantsData.restaurantsListFull?.titleImage;
export const selectFullDataListRestaurants = (state: RootState) =>
  state.restaurantsData.restaurantsListFull?.restaurants || [];

export const selectInfos = (state: RootState) => state.infoData.infos;
export const selectInfo = (state: RootState) => state.infoData.info;

export const selectReferences = (state: RootState) => state.referencesData.references;
export const selectReference = (state: RootState) => state.referencesData.currentReference;
