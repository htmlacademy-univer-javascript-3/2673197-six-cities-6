import { AUTH_TOKEN_KEY_NAME } from '../const.ts';

export const getToken = (): string | null =>
  localStorage.getItem(AUTH_TOKEN_KEY_NAME) ?? null;

export const saveToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY_NAME, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
};
