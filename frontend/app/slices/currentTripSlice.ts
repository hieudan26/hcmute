import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITripDayResponseModel, ITripsResponseModel } from '../../models/trip/trip.model';

interface IinitialState {
  value: ITripsResponseModel | undefined;
}

const initialState: IinitialState = {
  value: undefined,
};

export const currentTripSlice = createSlice({
  name: 'currentTrip',
  initialState,
  reducers: {
    setTripDays: (state, action: PayloadAction<ITripDayResponseModel[]>) => {
      if (state.value) {
        let temp = { ...state.value };
        temp.tripDays = action.payload;
        state.value = { ...temp };
      }
    },
    setCurrentTrip: (state, action: PayloadAction<ITripsResponseModel>) => {
      state.value = { ...action.payload };
    },
    clearCurrentTrip: (state) => {
      state.value = undefined;
    },
  },
});

export const { setCurrentTrip, clearCurrentTrip, setTripDays } = currentTripSlice.actions;
export default currentTripSlice.reducer;
