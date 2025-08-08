import RestaurantApi from '../api/restaurant.api';
import { restaurantActions } from '../store/reducers/restaurant';
import { store } from '../store';
import { IRestaurant } from '../types/restaurant.types.ts';
// import { store } from "../store";
// import { restaurantActions } from "../store/reducers/restaurant";

export const restaurantService = {
  async getAll() {
    const { data } = await RestaurantApi.getAll();
    store.dispatch(restaurantActions.setRestaurants(data));
  },
  async getById(id: string) {
    return RestaurantApi.getById(id);
  },

  async getByName(name: string) {
    return RestaurantApi.getByName(name);
  },
  async create(data: Omit<IRestaurant, '_id' | 'createdAt' | 'updatedAt'>) {
    const res = await RestaurantApi.create(data);
    store.dispatch(restaurantActions.addRestaurant(res.data));
  },
  async update(id: string, data: Partial<IRestaurant>) {
    const res = await RestaurantApi.update(id, data);
    store.dispatch(restaurantActions.updateRestaurant(res.data));
  },
  async delete(id: string) {
    await RestaurantApi.delete(id);
    store.dispatch(restaurantActions.removeRestaurant(id));
  },
  async updateTitleImage(restaurantId: string, imageId: string) {
    const response = await RestaurantApi.updateTitleImage(restaurantId, imageId);
    store.dispatch(restaurantActions.updateRestaurant(response.data));
    return response;
  },
  async updateGallery(restaurantId: string, imageIds: string[]) {
    const response = await RestaurantApi.updateGallery(restaurantId, imageIds);
    store.dispatch(restaurantActions.updateRestaurant(response.data));
    return response;
  },
};
