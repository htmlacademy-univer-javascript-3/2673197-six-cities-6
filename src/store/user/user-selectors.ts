import { ActionNamespace } from '../../enums/action-namespace.ts';
import { AuthStatus } from '../../enums/auth-status.ts';
import type { State } from '../../types/state.ts';
import type { UserInfo } from '../../types/user-info.ts';

export const getAuthStatus = (state: State): AuthStatus => state[ActionNamespace.User].authStatus;
export const getUserInfo = (state: State): UserInfo | null => state[ActionNamespace.User].info;
