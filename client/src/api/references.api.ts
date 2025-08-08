import api from './baseApi';
import { IReferencesResponse } from '../types/references.types';

export const referencesApi = {
  async getAll(): Promise<IReferencesResponse[]> {
    const response = await api.get('references').json<{ data: IReferencesResponse[] }>();
    return response.data;
  },

  async getById(id: string): Promise<IReferencesResponse> {
    const response = await api.get(`references/${id}`).json<{ data: IReferencesResponse }>();
    return response.data;
  },

  async create(data: Partial<IReferencesResponse>): Promise<IReferencesResponse> {
    const response = await api.post('references', { json: data }).json<{ data: IReferencesResponse }>();
    return response.data;
  },

  async update(id: string, data: Partial<IReferencesResponse>): Promise<IReferencesResponse> {
    const response = await api.put(`references/${id}`, { json: data }).json<{ data: IReferencesResponse }>();
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`references/${id}`);
  },

  async updateTitleImage(referencesId: string, imageId: string): Promise<IReferencesResponse> {
    const response = await api.patch('references/title-image', {
      json: { referencesId, imageId }
    }).json<{ data: IReferencesResponse }>();
    return response.data;
  },
}; 