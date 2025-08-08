import { store } from "../store";
import CountriesApi from "../api/countries.api";
import { countriesActions } from "../store/reducers/countries";

export const countriesService = {
  async getAll() {
    const { data } = await CountriesApi.getAll();
    store.dispatch(countriesActions.setCountries(data));
  },

};
