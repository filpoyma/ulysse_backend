import { referencesApi } from '../api/references.api';
import { store } from '../store';
import { referencesActions } from '../store/reducers/references';
import { IReferencesResponse } from '../types/references.types';

export const referencesService = {
  async getAll(): Promise<IReferencesResponse[]> {
    try {
      const data = await referencesApi.getAll();
      store.dispatch(referencesActions.setReferences(data));
      return data;
    } catch (error) {
      console.error('Error fetching references:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<IReferencesResponse> {
    try {
      const data = await referencesApi.getById(id);
      store.dispatch(referencesActions.setReference(data));
      return data;
    } catch (error) {
      console.error('Error fetching reference:', error);
      throw error;
    }
  },

  async create(data: Partial<IReferencesResponse>): Promise<IReferencesResponse> {
    try {
      const newReference = await referencesApi.create(data);
      store.dispatch(referencesActions.addReference(newReference));
      return newReference;
    } catch (error) {
      console.error('Error creating reference:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<IReferencesResponse>): Promise<IReferencesResponse> {
    try {
      const updatedReference = await referencesApi.update(id, data);
      store.dispatch(referencesActions.updateReference(updatedReference));
      return updatedReference;
    } catch (error) {
      console.error('Error updating reference:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await referencesApi.delete(id);
      store.dispatch(referencesActions.removeReference(id));
    } catch (error) {
      console.error('Error deleting reference:', error);
      throw error;
    }
  },

  async updateTitleImage(referencesId: string, imageId: string): Promise<IReferencesResponse> {
    try {
      const updatedReference = await referencesApi.updateTitleImage(referencesId, imageId);
      store.dispatch(referencesActions.updateReference(updatedReference));
      return updatedReference;
    } catch (error) {
      console.error('Error updating reference title image:', error);
      throw error;
    }
  },
}; 