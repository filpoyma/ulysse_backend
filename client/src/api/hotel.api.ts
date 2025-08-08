import api from './baseApi';
import { IHotel, IHotelCreate } from '../types/hotel.types.ts';

const HotelApi = {
  basePath: 'hotels',

  getUrl(path: string = '') {
    return path ? `${this.basePath}/${path}` : this.basePath;
  },

  getAll(): Promise<{ data: IHotel[] }> {
    return api.get(this.getUrl()).json();
  },

  getById(id: string): Promise<{ data: IHotel }> {
    return api.get(this.getUrl(id)).json();
  },

  getByName(name: string): Promise<{ data: IHotel }> {
    return api.get(this.getUrl(`name/${name}`)).json();
  },

  create(data: IHotelCreate): Promise<{ data: IHotel }> {
    return api.post(this.getUrl(), { json: data }).json();
  },

  copyHotel(id: string): Promise<{ data: IHotel }> {
    return api.post(this.getUrl('copy'), { json: { id: id } }).json();
  },

  update(id: string, data: Partial<IHotel>): Promise<{ data: IHotel }> {
    return api.put(this.getUrl(id), { json: data }).json();
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete(this.getUrl(id)).json();
  },

  updateMainImage(hotelId: string, imageId: string): Promise<{ data: IHotel }> {
    return api
      .patch(this.getUrl('main-image'), {
        json: { hotelId, imageId },
      })
      .json();
  },

  updateGallery(
    hotelId: string,
    galleryType: 'hotelInfo.gallery' | 'roomInfo.gallery',
    imageIds: string[],
  ): Promise<{ data: IHotel }> {
    return api
      .patch(this.getUrl('gallery'), {
        json: { hotelId, galleryType, imageIds },
      })
      .json();
  },
};

export default HotelApi;
