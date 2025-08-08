import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { Loader } from './components/Loader/Loader';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { authService } from './services';
import { authActions } from './store/reducers/auth';
import { useDispatch } from 'react-redux';
import { countriesService } from './services/countries.service.ts';
import { getErrorMessage } from './utils/helpers.ts';
import Info from './pages/Info/Info.tsx';
import References from './pages/References/References.tsx';

dayjs.locale('ru');
dayjs.extend(customParseFormat);

const TravelProgram = React.lazy(() => import('./pages/TravelProgram/TravelProgram.tsx'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin/AdminSignIn.tsx'));
const AdminRegister = React.lazy(() => import('./pages/AdminLogin/AdminSighUp.tsx'));
const SingleHotel = React.lazy(() => import('./pages/Hotels/SingleHotel/SingleHotel.tsx'));
const HotelsList = React.lazy(() => import('./pages/Hotels/HotelsList/HotelsList.tsx'));
const SingleRestaurant = React.lazy(
  () => import('./pages/Restaurants/SingleRestaurant/SingleRestaurant.tsx'),
);
const RestaurantsList = React.lazy(
  () => import('./pages/Restaurants/RestaurantsList/RestaurantsList.tsx'),
);
const RestaurantsListEditPage = React.lazy(
  () => import('./pages/AdminPanel/components/Restaurants/RestaurantsListEditPage.tsx'),
);
const HotelsListEditPage = React.lazy(
  () => import('./pages/AdminPanel/components/Hotels/HotelsListEditPage.tsx'),
);
const RestaurantEditPage = React.lazy(
  () => import('./pages/AdminPanel/components/Restaurants/RestaurantEditPage.tsx'),
);
const HotelEditPage = React.lazy(
  () => import('./pages/AdminPanel/components/Hotels/HotelEditPage.tsx'),
);
const ReferencesSection = React.lazy(
  () => import('./pages/AdminPanel/components/ReferencesSection.tsx'),
);
const InfoSection = React.lazy(() => import('./pages/AdminPanel/components/InfoSection.tsx'));
const RestaurantsListSection = React.lazy(
  () => import('./pages/AdminPanel/components/Restaurants/RestaurantsListSection.tsx'),
);
const RestaurantsCollectSection = React.lazy(
  () => import('./pages/AdminPanel/components/Restaurants/RestarauntsCollectSection.tsx'),
);
const HotelsListSection = React.lazy(
  () => import('./pages/AdminPanel/components/Hotels/HotelsListSection.tsx'),
);
const HotelsCollectSection = React.lazy(
  () => import('./pages/AdminPanel/components/Hotels/HotelsCollectSection.tsx'),
);
const AdminLayout = React.lazy(() => import('./pages/AdminPanel/AdminLayout.tsx'));
const ProgramsSection = React.lazy(
  () => import('./pages/AdminPanel/components/ProgramsSection.tsx'),
);

const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(authActions.setIsLoading(true));
    (async () => {
      try {
        const user = await authService.validateSession();
        if (user) await countriesService.getAll();
      } catch (err) {
        console.error(getErrorMessage(err));
      } finally {
        dispatch(authActions.setIsLoading(false));
      }
    })();
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/travel-programm/:programName" element={<TravelProgram />} />
        <Route path="/hotel/:name" element={<SingleHotel />} />
        <Route path="/hotels/:id" element={<HotelsList />} />
        <Route path="/restaurant/:name" element={<SingleRestaurant />} />
        <Route path="/restaurants/:id" element={<RestaurantsList />} />
        <Route path="/info/:name" element={<Info />} />
        <Route path="/references/:name" element={<References />} />

        <Route path="/ulyseadmin" element={<AdminLogin />} />
        <Route path="/ulyseadmin/register" element={<AdminRegister />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ProgramsSection />} />
          <Route path="hotels">
            <Route index element={<HotelsCollectSection />} />
            <Route path="lists" element={<HotelsListSection />} />
            <Route path="hotel/edit/:id" element={<HotelEditPage />} />
            <Route path="list/edit/:id" element={<HotelsListEditPage />} />
          </Route>
          <Route path="restaurants">
            <Route index element={<RestaurantsCollectSection />} />
            <Route path="lists" element={<RestaurantsListSection />} />
            <Route path="restaurant/edit/:id" element={<RestaurantEditPage />} />
            <Route path="list/edit/:id" element={<RestaurantsListEditPage />} />
          </Route>
          <Route path="info" element={<InfoSection />} />
          <Route path="references" element={<ReferencesSection />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;

//todo
// продумать порядок катинок при выборе в галерее

//оставить в галлереях только 2 поля
