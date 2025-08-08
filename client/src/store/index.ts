import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/auth';
import { travelProgramReducer } from './reducers/travelProgram';
import { hotelReducer } from './reducers/hotel';
import { restaurantReducer } from './reducers/restaurant';
import { countriesReducer } from './reducers/countries';
import { infoReducer } from './reducers/info';
import { referencesReducer } from './reducers/references';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    travelProgram: travelProgramReducer,
    hotelsData: hotelReducer,
    restaurantsData: restaurantReducer,
    countries: countriesReducer,
    infoData: infoReducer,
    referencesData: referencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
