import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IinitialState {
  value: 'Public' | 'Private';
}

const initialState: IinitialState = {
  value: 'Private',
};

export const statusItinerarySlice = createSlice({
  name: 'statusItinerary',
  initialState,
  reducers: {
    setValueStatusItinerary: (state, action: PayloadAction<'Public' | 'Private'>) => {
      state.value = action.payload;
    },
  },
});

export const { setValueStatusItinerary } = statusItinerarySlice.actions;
export default statusItinerarySlice.reducer;
