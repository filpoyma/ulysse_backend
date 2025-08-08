import api from './baseApi';
import { ILogistics } from '../types/travelProgram.types';

const mapApi = {
  basePath: 'map',

  getUrl(path: string = '') {
    return path ? `${this.basePath}/${path}` : this.basePath;
  },

  async updateLogistics(
    programId: string,
    logistics: ILogistics[],
  ): Promise<{ data: ILogistics[]; success: boolean }> {
    const url = this.getUrl(`${programId}/logistics`);
    return api.put(url, { json: { logistics } }).json();
  },
};

export default mapApi;
