import api from '../api/baseApi';
import { ITravelProgramResponse } from '../types/travelProgram.types.ts';
import { IUploadedImage } from '../types/uploadImage.types.ts';

export const imageService = {
  async uploadImage(file: File): Promise<{ image: IUploadedImage; message: string }> {
    const formData = new FormData();
    formData.append('image', file);
    // Не указываем Content-Type, ky сам выставит multipart boundary
    return api
      .post('upload/image', {
        body: formData,
        timeout: 20000,
      })
      .json();
  },

  async uploadMultipleImages(
    files: File[],
    belongsToId?: string,
  ): Promise<{ images: IUploadedImage[]; message: string }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('belongsToId', belongsToId ? belongsToId : '');
    return api
      .post('upload/images', {
        body: formData,
        timeout: 20000,
      })
      .json();
  },

  async getAllImages(belongsId?: string): Promise<IUploadedImage[]> {
    return api
      .get('upload/images', {
        timeout: 10000,
        searchParams: { id: belongsId || '' },
      })
      .json();
  },

  async deleteImage(id: string) {
    return api
      .delete(`upload/image/${id}`, {
        timeout: 10000,
      })
      .json();
  },

  async setBgImage({
    programName,
    imageId,
    imageNumber,
  }: {
    programName: string;
    imageId: string;
    imageNumber: number;
  }): Promise<{ data: { program: ITravelProgramResponse; message: string } }> {
    return api
      .post('travel-program/bg-image', {
        json: { programName, imageId, imageNumber },
        timeout: 10000,
      })
      .json();
  },
};
