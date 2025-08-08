import HotelApi from '../api/hotel.api';
import { store } from '../store';
import { hotelActions } from '../store/reducers/hotel';
import { IHotel, IHotelCreate, TGalleryType } from '../types/hotel.types.ts';

export const hotelService = {
  async getAll() {
    const response = await HotelApi.getAll();
    store.dispatch(hotelActions.setHotels(response.data || []));
  },
  async getById(id: string) {
    return HotelApi.getById(id);
    //store.dispatch(hotelActions.setHotel(response.data || []));
  },
  async getByName(name_eng: string) {
    return HotelApi.getByName(name_eng);
  },
  async create(data: IHotelCreate) {
    return HotelApi.create(data);
  },
  async copyHotel(id: string) {
    const res = await HotelApi.copyHotel(id);
    store.dispatch(hotelActions.addHotel(res.data));
  },
  async update(id: string, data: Partial<IHotel>) {
    const res = await HotelApi.update(id, data);
    store.dispatch(hotelActions.updateHotel(res.data));
  },
  async delete(id: string) {
    await HotelApi.delete(id);
    store.dispatch(hotelActions.removeHotel(id));
  },
  async updateMainImage(hotelId: string, imageId: string) {
    const response = await HotelApi.updateMainImage(hotelId, imageId);
    store.dispatch(hotelActions.updateHotel(response.data));
    return response;
  },
  async updateGallery(hotelId: string, galleryType: TGalleryType, imageIds: string[]) {
    const response = await HotelApi.updateGallery(hotelId, galleryType, imageIds);
    store.dispatch(hotelActions.updateHotel(response.data));
    return response;
  },
};
