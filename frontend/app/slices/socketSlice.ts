import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as StompJS from '@stomp/stompjs';

interface IinitialState {
  value: boolean;
}

const initialState: IinitialState = {
  value: false,
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    isConnected: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { isConnected } = socketSlice.actions;
export default socketSlice.reducer;
