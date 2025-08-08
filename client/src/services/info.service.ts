import infoApi from '../api/info.api';
import { infoActions } from '../store/reducers/info';
import { store } from '../store';
import { IInfoResponse } from '../types/info.types';

export const infoService = {
  async getAll() {
    const resp = await infoApi.getAll();
    if (resp?.data) store.dispatch(infoActions.setInfos(resp.data));
  },
  async create(data: Partial<IInfoResponse>) {
    const resp = await infoApi.create(data);
    if (resp?.data) store.dispatch(infoActions.addInfo(resp.data));
  },
  async getById(id: string) {
    const res = await infoApi.getById(id);
    if (res?.data) store.dispatch(infoActions.setInfo(res.data));
  },
  async delete(id: string) {
    await infoApi.delete(id);
    store.dispatch(infoActions.removeInfo(id));
  },
  async update(id: string, data: Partial<IInfoResponse>) {
    const res = await infoApi.update(id, data);
    if (res?.data) store.dispatch(infoActions.updateInfo(res.data));
  },
  async updateTitleImage(infoId: string, imageId: string) {
    const res = await infoApi.updateTitleImage(infoId, imageId);
    if (res?.data) store.dispatch(infoActions.updateInfo(res.data));
  },
}; 