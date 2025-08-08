import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInfoResponse } from '../../../types/info.types';

interface InfoState {
  infos: IInfoResponse[];
  info: IInfoResponse | null;
}

const initialState: InfoState = {
  infos: [],
  info: null,
};

const { reducer: infoReducer, actions: infoActions } = createSlice({
  name: 'infoData',
  initialState,
  reducers: {
    setInfos(state, action: PayloadAction<IInfoResponse[]>) {
      state.infos = action.payload;
    },
    setInfo(state, action: PayloadAction<IInfoResponse | null>) {
      state.info = action.payload;
    },
    addInfo(state, action: PayloadAction<IInfoResponse>) {
      state.infos.unshift(action.payload);
    },
    updateInfo(state, action: PayloadAction<IInfoResponse>) {
      state.infos = state.infos.map((info) =>
        info._id === action.payload._id ? action.payload : info,
      );
      if (state.info && state.info._id === action.payload._id) {
        state.info = action.payload;
      }
    },
    removeInfo(state, action: PayloadAction<string>) {
      state.infos = state.infos.filter((i) => i._id !== action.payload);
      if (state.info && state.info._id === action.payload) state.info = null;
    },
  },
});

export { infoReducer, infoActions }; 