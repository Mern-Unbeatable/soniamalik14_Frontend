import { STORAGE_KEYS } from '../config/constants';

// Cookie helpers (simple, not httpOnly) - used for storing the auth token
const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, null);
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

// Token stored in cookie for slightly better control than localStorage
export const getToken = () => {
  try {
    return getCookie(STORAGE_KEYS.TOKEN) || null;
  } catch (e) {
    return null;
  }
};

export const setToken = (token) => {
  try {
    // store token for 7 days by default
    setCookie(STORAGE_KEYS.TOKEN, token, 7);
  } catch (e) {
    // fallback to localStorage if cookies not available
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }
};

export const removeToken = () => {
  try {
    deleteCookie(STORAGE_KEYS.TOKEN);
  } catch (e) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};
