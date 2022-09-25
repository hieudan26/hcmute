import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {};

const store = configureStore({
  reducer: rootReducer,
  devTools: false,
});

export default store;
