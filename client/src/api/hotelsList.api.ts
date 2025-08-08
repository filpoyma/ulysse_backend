import api from '../api/baseApi';
import {
  ICreateHotelsListData,
  IHotelsList,
  IHotelsListStats,
  IHotelsListWithHotels,
  IUpdateHotelsListData,
} from '../types/hotelsList.types.ts';

const hotelsListApi = {
  basePath: 'hotels-lists',

  getUrl(path: string = '') {
    return path ? `${this.basePath}/${path}` : this.basePath;
  },

  // Получить все списки отелей
  getAll(params?: {
    active?: boolean;
    withHotels?: boolean;
  }): Promise<{ data: IHotelsList[] | IHotelsListWithHotels[] }> {
    const searchParams = new URLSearchParams();
    if (params?.active !== undefined) {
      searchParams.append('active', params.active.toString());
    }
    if (params?.withHotels !== undefined) {
      searchParams.append('withHotels', params.withHotels.toString());
    }

    const url = searchParams.toString()
      ? `${this.getUrl()}?${searchParams.toString()}`
      : this.getUrl();

    return api.get(url).json();
  },

  // Получить список отелей по ID
  getById(id: string): Promise<{ data: IHotelsListWithHotels }> {
    const url = this.getUrl(id);
    return api.get(url).json();
  },

  getFullById(id: string): Promise<{ data: IHotelsListWithHotels }> {
    const url = this.getUrl(id);
    return api.get(url, { searchParams: { fullData: true } }).json();
  },

  // Создать новый список отелей
  create(data: ICreateHotelsListData): Promise<{ data: IHotelsList }> {
    return api.post(this.getUrl(), { json: data }).json();
  },

  // Обновить список отелей
  update(id: string, data: IUpdateHotelsListData): Promise<{ data: IHotelsList }> {
    return api.patch(this.getUrl(id), { json: data }).json();
  },

  // Удалить список отелей
  delete(id: string): Promise<{ message: string }> {
    return api.delete(this.getUrl(id)).json();
  },

  // Добавить отель в список
  addHotel(listId: string, hotelId: string): Promise<{ data: IHotelsList }> {
    return api.post(this.getUrl(`${listId}/hotels/${hotelId}`)).json();
  },

  // Удалить отель из списка
  removeHotel(listId: string, hotelId: string): Promise<{ data: IHotelsList }> {
    return api.delete(this.getUrl(`${listId}/hotels/${hotelId}`)).json();
  },

  // Удалить отель из всех списков
  removeHotelsFromLists(hotelId: string): Promise<{ data: IHotelsList }> {
    return api.delete(this.getUrl(`lists/${hotelId}`)).json();
  },

  // Получить статистику списков отелей
  getStats(): Promise<{ data: IHotelsListStats }> {
    return api.get(this.getUrl('stats')).json();
  },
};

export default hotelsListApi;
