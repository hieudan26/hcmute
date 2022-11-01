import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserFirstLoginRequest } from '../../models/user/user.model';

interface IinitialState {
  value: IUserFirstLoginRequest | null;
}

const initialState: IinitialState = {
  value: null,
};

export const userNotAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserNotAuth: (state, action: PayloadAction<IUserFirstLoginRequest>) => {
      const firstName = action.payload.firstName;
      const lastName = action.payload.lastName;
      const fullName = firstName + ' ' + lastName;
      state.value = { ...action.payload, isFirstLogin: false, isLoggedIn: false, fullName: fullName };
    },
    clearUserNotAuth: (state) => {
      state.value = null;
    },
  },
});

export const { setUserNotAuth, clearUserNotAuth } = userNotAuthSlice.actions;
export default userNotAuthSlice.reducer;
