import restaurantsListApi from '../api/restaurantsList.api';
import {
  ICreateRestaurantsListData,
  IRestaurantsList,
  IUpdateRestaurantsListData,
} from '../types/restaurantsList.types';
import { store } from '../store';
import { restaurantActions } from '../store/reducers/restaurant';

export const restaurantsListService = {
  async getAll(params?: { active?: boolean; withRestaurants?: boolean }) {
    const res = await restaurantsListApi.getAll(params);
    if (res.data)
      store.dispatch(restaurantActions.setRestaurantsList(res.data as IRestaurantsList[]));
  },

  getById(id: string) {
    return restaurantsListApi.getById(id);
  },

  async getFullById(id: string) {
    const res = await restaurantsListApi.getFullById(id);
    store.dispatch(restaurantActions.setRestaurantsListFull(res.data));
  },

  create(data: ICreateRestaurantsListData) {
    return restaurantsListApi.create(data);
  },

  async update(id: string, data: IUpdateRestaurantsListData) {
    const res = await restaurantsListApi.update(id, data);
    if (res.data) store.dispatch(restaurantActions.updateRestaurantList(res.data));
  },

  delete(id: string) {
    return restaurantsListApi.delete(id);
  },

  addRestaurant(listId: string, restaurantId: string) {
    return restaurantsListApi.addRestaurant(listId, restaurantId);
  },

  removeRestaurant(listId: string, restaurantId: string) {
    return restaurantsListApi.removeRestaurant(listId, restaurantId);
  },
};
