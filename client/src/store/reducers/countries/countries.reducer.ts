import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICountriesApiModel } from "../../../api/countries.api";

interface CountriesState {
  data: ICountriesApiModel[];
}

const initialState: CountriesState = {
  data: []
};

const { reducer: countriesReducer, actions: countriesActions } = createSlice({
  name: "countriesData",
  initialState,
  reducers: {
    setCountries(state, action: PayloadAction<ICountriesApiModel[]>) {
      state.data = action.payload;
    },

  },
});

export { countriesReducer, countriesActions }; 