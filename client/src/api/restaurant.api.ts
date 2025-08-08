import api from './baseApi';
import { IRestaurant } from '../types/restaurant.types.ts';

const RestaurantApi = {
  basePath: 'restaurants',

  getUrl(path: string = '') {
    return path ? `${this.basePath}/${path}` : this.basePath;
  },

  getAll(): Promise<{ data: IRestaurant[] }> {
    return api.get(this.getUrl()).json();
  },

  getById(id: string): Promise<{ data: IRestaurant }> {
    return api.get(this.getUrl(id)).json();
  },

  getByName(name: string): Promise<{ data: IRestaurant }> {
    return api.get(this.getUrl(`name/${name}`)).json();
  },

  create(
    data: Omit<IRestaurant, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<{ data: IRestaurant }> {
    return api.post(this.getUrl(), { json: data }).json();
  },

  update(id: string, data: Partial<IRestaurant>): Promise<{ data: IRestaurant }> {
    return api.put(this.getUrl(id), { json: data }).json();
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete(this.getUrl(id)).json();
  },

  updateTitleImage(restaurantId: string, imageId: string): Promise<{ data: IRestaurant }> {
    return api
      .put(this.getUrl('update-title-image'), {
        json: { restaurantId, imageId },
      })
      .json();
  },

  updateGallery(restaurantId: string, imageIds: string[]): Promise<{ data: IRestaurant }> {
    return api
      .put(this.getUrl('update-gallery'), {
        json: { restaurantId, imageIds },
      })
      .json();
  },
};

export default RestaurantApi;
