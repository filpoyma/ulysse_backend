import { IUploadedImage } from './uploadImage.types';

export interface IListInfo {
  title: string;
  description: string;
  _id?: string;
}

export interface IInfoResponse {
  _id: string;
  name: string;
  name_eng: string;
  title: string;
  manager: string;
  description: string;
  titleImage?: IUploadedImage;
  listInfo: IListInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface InfoSingleResponse {
  data: IInfoResponse;
}
