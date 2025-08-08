import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IReferencesResponse } from '../../../types/references.types';

interface ReferencesState {
  references: IReferencesResponse[];
  currentReference: IReferencesResponse | null;
}

const initialState: ReferencesState = {
  references: [],
  currentReference: null,
};

const referencesSlice = createSlice({
  name: 'references',
  initialState,
  reducers: {
    setReferences: (state, action: PayloadAction<IReferencesResponse[]>) => {
      state.references = action.payload;
    },
    setReference: (state, action: PayloadAction<IReferencesResponse>) => {
      state.currentReference = action.payload;
    },
    addReference: (state, action: PayloadAction<IReferencesResponse>) => {
      state.references.push(action.payload);
    },
    updateReference: (state, action: PayloadAction<IReferencesResponse>) => {
      const index = state.references.findIndex(ref => ref._id === action.payload._id);
      if (index !== -1) {
        state.references[index] = action.payload;
      }
      if (state.currentReference?._id === action.payload._id) {
        state.currentReference = action.payload;
      }
    },
    removeReference: (state, action: PayloadAction<string>) => {
      state.references = state.references.filter(ref => ref._id !== action.payload);
      if (state.currentReference?._id === action.payload) {
        state.currentReference = null;
      }
    },
  },
});

export const referencesActions = referencesSlice.actions;
export const referencesReducer = referencesSlice.reducer; 