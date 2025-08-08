import { IUploadedImage } from './uploadImage.types.ts';

export interface IRestaurant {
  _id?: string;
  name: string;
  name_eng: string;
  country: string;
  city: string;
  region: string;
  link: string;
  manager: string;
  address: string;
  description: string;
  cookDescription: string;
  coordinates: [number, number];
  gallery: IUploadedImage[];
  titleImage: IUploadedImage;
  stars: number;
  shortInfo: string[];
  createdAt?: string;
  updatedAt?: string;
}
