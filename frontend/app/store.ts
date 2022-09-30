import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';

const rootReducer = {
  theme: themeReducer,
};

const store = configureStore({
  reducer: rootReducer,
  devTools: false,
});

export default store;

export type RootState = ReturnType<typeof store.getState>; // A global type to access reducers types
export type AppDispatch = typeof store.dispatch; // Type to access dispatch
