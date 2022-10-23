import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserFirstLoginRequest } from '../../models/user/user.model';
import { LocalUtils } from '../../utils/local.utils';

interface IinitialState {
  value: IUserFirstLoginRequest | null;
}

const initialState: IinitialState = {
  value: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<any>) => {
      LocalUtils.resetAdditionalData();
      LocalUtils.storeAdditionalData(action.payload);
      const firstName = action.payload.firstName;
      const lastName = action.payload.lastName;
      const fullName = firstName + ' ' + lastName;
      state.value = { ...action.payload, isFirstLogin: false, isLoggedIn: true, fullName: fullName };
    },
    login: (state, action: PayloadAction<IUserFirstLoginRequest>) => {
      LocalUtils.storeAdditionalData(action.payload);
      const firstName = action.payload.firstName;
      const lastName = action.payload.lastName;
      const fullName = firstName + ' ' + lastName;
      state.value = { ...action.payload, isFirstLogin: false, isLoggedIn: true, fullName: fullName };
    },
    logout: (state) => {
      state.value = null;
    },
  },
});

export const { login, logout, update } = authSlice.actions;
export default authSlice.reducer;
