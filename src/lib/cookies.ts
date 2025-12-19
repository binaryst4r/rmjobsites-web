import { Cookies } from 'react-cookie';
import type { User } from '../types/auth';

const cookies = new Cookies();

type UserCookie = {
  id: number;
  email: string;
  admin: boolean;
  jwt: string;
}

export const setUser = (user: User, token: string) => {
  if (!import.meta.env.VITE_USER_COOKIE) { return null; }
  const payload: UserCookie = {
    id: user.id,
    email: user.email,
    admin: user.admin,
    jwt: token,
  };
  return cookies.set(import.meta.env.VITE_USER_COOKIE, payload, { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
};

export const getUser = (): UserCookie | null => {
  if (!import.meta.env.VITE_USER_COOKIE) { return null; }
  return cookies.get(import.meta.env.VITE_USER_COOKIE);
};

export const getToken = (): string | null => {
  const user = getUser();
  return user?.jwt || null;
};

export const clearUser = () => {
  if (!import.meta.env.VITE_USER_COOKIE) { return null; }
  return cookies.remove(import.meta.env.VITE_USER_COOKIE, { path: '/' });
};
