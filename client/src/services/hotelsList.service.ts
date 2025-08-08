import hotelsListApi from '../api/hotelsList.api.ts';
import {
  ICreateHotelsListData,
  IHotelsList,
  IHotelsListStats,
  IUpdateHotelsListData,
} from '../types/hotelsList.types.ts';
import { store } from '../store';
import { hotelActions } from '../store/reducers/hotel';

export const hotelsListService = {
  async getAll(params?: { active?: boolean; withHotels?: boolean }) {
    const response = await hotelsListApi.getAll(params);
    // Приводим к базовому типу IHotelsList
    const lists = (response.data as IHotelsList[]).map((list) => ({
      ...list,
      hotels:
        Array.isArray(list.hotels) && typeof list.hotels[0] === 'string'
          ? list.hotels
          : (list.hotels as any[]).map((hotel: any) => hotel._id || hotel),
    }));
    store.dispatch(hotelActions.setHotelsList(lists));
  },

  // Получить список отелей по ID
  getById(id: string) {
    return hotelsListApi.getById(id);
  },

  async getFullById(id: string) {
    const res = await hotelsListApi.getFullById(id);
    store.dispatch(hotelActions.setHotelsListFull(res.data));
  },

  // Создать новый список отелей
  create(data: ICreateHotelsListData) {
    return hotelsListApi.create(data);
  },

  // Обновить список отелей
  async update(id: string, data: IUpdateHotelsListData) {
    const resp = await hotelsListApi.update(id, data);
    store.dispatch(hotelActions.updateHotelsList(resp.data));
  },

  // Удалить список отелей
  delete(id: string) {
    return hotelsListApi.delete(id);
  },

  // Добавить отель в список
  addHotel(listId: string, hotelId: string) {
    return hotelsListApi.addHotel(listId, hotelId);
  },

  // Удалить отель из списка
  removeHotel(listId: string, hotelId: string) {
    return hotelsListApi.removeHotel(listId, hotelId);
  },

  // Получить статистику списков отелей
  getStats(): Promise<{ data: IHotelsListStats }> {
    return hotelsListApi.getStats();
  },
};
