import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IinitialState {
  value: boolean;
}

const initialState: IinitialState = {
  value: false,
};

export const receivedMessSlice = createSlice({
  name: 'receivedMess',
  initialState,
  reducers: {
    setValueReceivedMessage: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
    isReceivedNewMessage: (state) => {
      state.value = true;
    },
  },
});

export const { setValueReceivedMessage, isReceivedNewMessage } = receivedMessSlice.actions;
export default receivedMessSlice.reducer;
