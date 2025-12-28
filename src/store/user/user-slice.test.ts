import { describe, it, expect } from 'vitest';

import { changeUserInfo, userSlice } from './user-slice.ts';
import { AuthStatus } from '../../enums/auth-status.ts';
import { checkAuthStatus, login, logout } from '../api-actions.ts';
import { makeUserInfo } from '../../utils/mocks.ts';
import type { User } from '../../types/user.ts';

describe('User slice', () => {
  const initialState: User = {
    authStatus: AuthStatus.Unknown,
    info: null
  };

  it('should change user info with "changeUserInfo" action', () => {
    const expectedState: User = {
      authStatus: AuthStatus.Authorized,
      info: makeUserInfo()
    };

    const result = userSlice.reducer(initialState, changeUserInfo(expectedState));

    expect(result).toEqual(expectedState);
  });

  it('should set Authorized status on checkAuthStatus.fulfilled', () => {
    const userInfo = makeUserInfo();
    const result = userSlice.reducer(
      initialState,
      checkAuthStatus.fulfilled(userInfo, 'requestId', undefined)
    );

    expect(result.authStatus).toBe(AuthStatus.Authorized);
    expect(result.info).toEqual(userInfo);
  });

  it('should set Unauthorized status on checkAuthStatus.rejected', () => {
    const result = userSlice.reducer(
      { authStatus: AuthStatus.Unknown, info: null },
      checkAuthStatus.rejected(null, 'requestId', undefined)
    );

    expect(result.authStatus).toBe(AuthStatus.Unauthorized);
    expect(result.info).toBeNull();
  });

  it('should set Authorized status on login.fulfilled', () => {
    const userInfo = makeUserInfo();
    const result = userSlice.reducer(
      initialState,
      login.fulfilled(userInfo, 'requestId', { email: 'test', password: 'test' })
    );

    expect(result.authStatus).toBe(AuthStatus.Authorized);
    expect(result.info).toEqual(userInfo);
  });

  it('should set Unauthorized status on login.rejected', () => {
    const result = userSlice.reducer(
      initialState,
      login.rejected(null, 'requestId', { email: 'test', password: 'test' })
    );

    expect(result.authStatus).toBe(AuthStatus.Unauthorized);
    expect(result.info).toBeNull();
  });

  it('should set Unauthorized on logout.fulfilled', () => {
    const state: User = {
      authStatus: AuthStatus.Authorized,
      info: makeUserInfo()
    };

    const result = userSlice.reducer(
      state,
      logout.fulfilled(undefined, 'requestId', undefined)
    );

    expect(result.authStatus).toBe(AuthStatus.Unauthorized);
    expect(result.info).toBeNull();
  });
});
