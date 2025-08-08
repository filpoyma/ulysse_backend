import api from './baseApi';
import { IInfoResponse, InfoSingleResponse } from '../types/info.types';

const infoApi = {
  basePath: 'info',
  getUrl(path?: string) {
    return path ? `${this.basePath}/${path}` : `${this.basePath}`;
  },
  async getAll(): Promise<{ data: IInfoResponse[] }> {
    const url = this.getUrl();
    return api.get(url).json();
  },
  async getById(id: string): Promise<InfoSingleResponse> {
    const url = this.getUrl(id);
    return api.get(url).json();
  },
  async create(data: Partial<IInfoResponse>): Promise<{ data: IInfoResponse }> {
    const url = this.getUrl();
    return api.post(url, { json: data }).json();
  },
  async update(id: string, data: Partial<IInfoResponse>): Promise<{ data: IInfoResponse }> {
    const url = this.getUrl(id);
    return api.put(url, { json: data }).json();
  },
  async delete(id: string): Promise<{ message: string }> {
    const url = this.getUrl(id);
    return api.delete(url).json();
  },
  async updateTitleImage(infoId: string, imageId: string): Promise<{ data: IInfoResponse }> {
    const url = this.getUrl('title-image');
    return api.patch(url, { json: { infoId, imageId } }).json();
  },
};

export default infoApi; 