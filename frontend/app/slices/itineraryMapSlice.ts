import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IinitialState {
  value: boolean;
}

const initialState: IinitialState = {
  value: false,
};

export const itineraryMapSlice = createSlice({
  name: 'itineraryMap',
  initialState,
  reducers: {
    setValueItineraryMap: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setValueItineraryMap } = itineraryMapSlice.actions;
export default itineraryMapSlice.reducer;
