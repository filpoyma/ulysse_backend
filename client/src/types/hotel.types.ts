import { IUploadedImage } from './uploadImage.types.ts';

export interface IHotel {
  _id: string;
  name: string;
  name_eng: string;
  country: string;
  city: string;
  region: string;
  link: string;
  address: string;
  manager: string;
  mainImage: IUploadedImage;
  coordinates: [number, number];
  hotelInfo: {
    gallery: IUploadedImage[];
    about: string;
  };
  roomInfo: {
    gallery: IUploadedImage[];
    about: string;
  };
  pros: string[];
  shortInfo: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IHotelCreate {
  name: string;
  country: string;
  region: string;
  city: string;
}

export type TGalleryType = 'hotelInfo.gallery' | 'roomInfo.gallery';
