import { Action, combineReducers, configureStore, EnhancedStore, Store, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { createLogger } from 'redux-logger';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import authReducer from './slices/authSlice';
import storage from './sync_storage';
import themeReducer from './themeSlice';
import userNotAuthReducer from './slices/userNotAuthSlice';
import singleChatsReducer from './slices/singleChatsSlice';
import socketReducer from './slices/socketSlice';
import receivedMessReducer from './slices/receivedMessSlice';
import itineraryMapReducer from './slices/itineraryMapSlice';
import statusItinararyReducer from './slices/statusItinararySlice';

const logger = createLogger({
  //empty options
});

const env = process.env.NODE_ENV;

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
  blacklist: ['socket', 'statusItinerary'],
};

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  userNotAuthReducer: userNotAuthReducer,
  singleChats: singleChatsReducer,
  socket: socketReducer,
  receivedMessage: receivedMessReducer,
  itineraryMap: itineraryMapReducer,
  statusItinarary: statusItinararyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: env === 'development',
  // middleware: [thunk],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }), //.concat(logger),
});

export default store;

const setupStore = (context: any): EnhancedStore => store;
const makeStore: MakeStore<any> = (context: any) => setupStore(context);
export const persistor = persistStore(store);
export const wrapper = createWrapper<Store>(makeStore);

export type RootState = ReturnType<typeof store.getState>; // A global type to access reducers types
export type AppDispatch = typeof store.dispatch; // Type to access dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
