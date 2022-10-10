import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './slices/authSlice';
import { LocalUtils } from '../utils/local.utils';
import { LocalStorageConstants } from '../constants/store.constant';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const env = process.env.NODE_ENV;

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
};

const reducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const rootReducer = {
  theme: themeReducer,
  auth: authReducer,
};

const store = configureStore({
  // reducer: rootReducer,
  reducer: persistedReducer,
  devTools: env === 'development',
  middleware: [thunk],
});

export default store;

export type RootState = ReturnType<typeof store.getState>; // A global type to access reducers types
export type AppDispatch = typeof store.dispatch; // Type to access dispatch
