import jwt from "jsonwebtoken";
export const TOKEN_KEY = "API-REST";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => JSON.parse(localStorage.getItem(TOKEN_KEY));
export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};
export const getUserId = () => {
  const token = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return jwt.decode(token, {
    complete: true,
  }).payload.id;
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
