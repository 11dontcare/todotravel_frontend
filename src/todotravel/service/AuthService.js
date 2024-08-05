import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constant/backendAPI";
import APIService from "./APIService";

export const login = async (loginRequest) => {
  try {
    const response = await APIService.login(loginRequest);
    if (response.data.success) {
      setSession(response.data.data);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (signupRequest) => {
  try {
    const response = await APIService.signup(signupRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await APIService.logout();
    clearSession();
  } catch (error) {
    throw error;
  }
};

export const setSession = (authData) => {
  localStorage.setItem(ACCESS_TOKEN, authData.accessToken);
  localStorage.setItem(REFRESH_TOKEN, authData.refreshToken);
  localStorage.setItem('tokenExpirationTime', authData.accessTokenExpirationTime);
};

export const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem('tokenExpirationTime');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem(ACCESS_TOKEN);
};

// 모든 함수를 객체로 묶어서 export
const AuthService = {
  login,
  signup,
  logout,
  setSession,
  clearSession,
  isLoggedIn
};

export default AuthService;