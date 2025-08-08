import api from './baseApi';
import {
  ICreateRestaurantsListData,
  IRestaurantsList,
  IRestaurantsListWithRestaurants,
  IUpdateRestaurantsListData,
} from '../types/restaurantsList.types';

const restaurantsListApi = {
  basePath: 'restaurants-lists',

  getUrl(path: string = '') {
    return path ? `${this.basePath}/${path}` : this.basePath;
  },

  getFullById(id: string): Promise<{ data: IRestaurantsListWithRestaurants }> {
    const url = this.getUrl(id);
    return api.get(url, { searchParams: { fullData: true } }).json();
  },

  // Получить все списки ресторанов
  getAll(params?: {
    active?: boolean;
    withRestaurants?: boolean;
  }): Promise<{ data: IRestaurantsList[] | IRestaurantsListWithRestaurants[] }> {
    const searchParams = new URLSearchParams();
    if (params?.active !== undefined) {
      searchParams.append('active', params.active.toString());
    }
    if (params?.withRestaurants !== undefined) {
      searchParams.append('withRestaurants', params.withRestaurants.toString());
    }
    const url = searchParams.toString()
      ? `${this.getUrl()}?${searchParams.toString()}`
      : this.getUrl();
    return api.get(url).json();
  },

  // Получить список ресторанов по ID
  getById(id: string): Promise<{ data: IRestaurantsListWithRestaurants }> {
    const url = this.getUrl(id);
    return api.get(url).json();
  },

  // Создать новый список ресторанов
  create(data: ICreateRestaurantsListData): Promise<{ data: IRestaurantsList }> {
    return api.post(this.getUrl(), { json: data }).json();
  },

  // Обновить список ресторанов
  update(id: string, data: IUpdateRestaurantsListData): Promise<{ data: IRestaurantsList }> {
    return api.patch(this.getUrl(id), { json: data }).json();
  },

  // Удалить список ресторанов
  delete(id: string): Promise<{ message: string }> {
    return api.delete(this.getUrl(id)).json();
  },

  // Добавить ресторан в список
  addRestaurant(listId: string, restaurantId: string): Promise<{ data: IRestaurantsList }> {
    return api.post(this.getUrl(`${listId}/restaurants/${restaurantId}`)).json();
  },

  // Удалить ресторан из списка
  removeRestaurant(listId: string, restaurantId: string): Promise<{ data: IRestaurantsList }> {
    return api.delete(this.getUrl(`${listId}/restaurants/${restaurantId}`)).json();
  },
};

export default restaurantsListApi;
