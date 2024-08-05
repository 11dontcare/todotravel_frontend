import axios from "axios";
import {
  refreshToken,
  isTokenExpired,
  getAccessToken,
  removeTokens,
  API_BASE_URL,
  LOGIN_ENDPOINT,
  SIGNUP_ENDPOINT,
  LOGOUT_ENDPOINT
} from "../constant/backendAPI";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 인증 갱신을 건너뛸지 결정하는 함수
const shouldSkipAuthRefresh = (config) => {
  // 여기에 검사를 건너뛸 조건을 정의
  return config.url.startsWith("/api/auth/") || config.method === "options";
};

// 요청 인터셉터
api.interceptors.request.use(
  async (config) => {
    if (shouldSkipAuthRefresh(config)) {
      return config;
    }

    if (isTokenExpired()) {
      try {
        const newToken = await refreshToken();
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch (error) {
        console.error("Failed to refresh token: ", error);
        // 토큰 갱신 실패 시 로그아웃 처리
        removeTokens();
        // 로그인 페이지로 리다이렉트
        window.location.href = "/login";
        return Promise.reject(error);
      }
    } else {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않았다면
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        axios.defaults.headers.common["Authorization"] = "Bearer " + newToken;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token: ", refreshError);
        removeTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API 요청 함수들
const AxiosService = {
  login: (loginData) => api.post(LOGIN_ENDPOINT, loginData),
  signup: (signupData) => api.post(SIGNUP_ENDPOINT, signupData),
  logout: () => api.post(LOGOUT_ENDPOINT),
};

export default AxiosService;
