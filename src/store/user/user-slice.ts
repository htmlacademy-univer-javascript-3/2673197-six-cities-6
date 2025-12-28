import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ActionNamespace } from '../../enums/action-namespace.ts';
import { AuthStatus } from '../../enums/auth-status.ts';
import { checkAuthStatus, login, logout } from '../api-actions.ts';
import type { User } from '../../types/user.ts';

const initialState: User = {
  authStatus: AuthStatus.Unknown,
  info: null
};

export const userSlice = createSlice<
  User,
  { changeUserInfo: (state: User, action: PayloadAction<User>) => void },
  ActionNamespace.User
    >({
      name: ActionNamespace.User,
      initialState,
      reducers: {
        changeUserInfo(state, action: PayloadAction<User>) {
          state.authStatus = action.payload.authStatus;
          state.info = action.payload.info;
        }
      },
      extraReducers(builder) {
        builder
          .addCase(checkAuthStatus.fulfilled, (state, action) => {
            state.authStatus = AuthStatus.Authorized;
            state.info = action.payload;
          })
          .addCase(checkAuthStatus.rejected, (state) => {
            state.authStatus = AuthStatus.Unauthorized;
            state.info = null;
          })
          .addCase(login.fulfilled, (state, action) => {
            state.authStatus = AuthStatus.Authorized;
            state.info = action.payload;
          })
          .addCase(login.rejected, (state) => {
            state.authStatus = AuthStatus.Unauthorized;
            state.info = null;
          })
          .addCase(logout.fulfilled, (state) => {
            state.authStatus = AuthStatus.Unauthorized;
            state.info = null;
          });
      }
    });

export const { changeUserInfo } = userSlice.actions;
