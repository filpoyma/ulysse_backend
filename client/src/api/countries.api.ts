import api from './baseApi';

export interface ICountriesApiModel {
  name: string;
  name_ru: string;
  code: string;
}

const CountriesApi = {
  basePath: 'countries',

  getUrl(path: string = '') {
    return path ? `${this.basePath}/${path}` : this.basePath;
  },

  getAll(): Promise<{ data: ICountriesApiModel[] }> {
    return api.get(this.getUrl()).json();
  },
};

export default CountriesApi;
