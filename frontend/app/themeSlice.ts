import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeConstants } from '../constants/settings.constant';

type initialStateType = {
  currentTheme: string;
};

const initialState: initialStateType = {
  currentTheme: ThemeConstants.LIGHT,
};

const themeSlice = createSlice({
  name: 'themeMode',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<string>) => {
      return {
        currentTheme: action.payload,
      };
    },
  },
});

const { reducer, actions } = themeSlice;

export const { setThemeMode } = actions;
export default reducer;
