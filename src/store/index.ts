import { configureStore } from '@reduxjs/toolkit';
import { HttpStatusCode, AxiosError } from 'axios';

import { offersSlice } from './offers/offers-slice.ts';
import { citiesSlice } from './cities/cities-slice.ts';
import { changeUserInfo, userSlice } from './user/user-slice.ts';
import { errorSlice } from './error/error-slice.ts';
import { createApi } from '../services/api.ts';
import { AuthStatus } from '../enums/auth-status.ts';

const api = createApi();

export const store = configureStore({
  reducer: {
    offers: offersSlice.reducer,
    cities: citiesSlice.reducer,
    user: userSlice.reducer,
    error: errorSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api
      }
    })
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      store.dispatch(changeUserInfo({ authStatus: AuthStatus.Unauthorized, info: null }));
    }
    return Promise.reject(error);
  }
);
