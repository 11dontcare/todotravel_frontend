export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const WS_BASE_URL =
  process.env.REACT_APP_WS_BASE_URL || "localhost:8080";

export const ACCESS_TOKEN = "accessToken";

export const OAUTH2_REDIRECT_URI =
  process.env.REACT_APP_OAUTH2_REDIRECT_URI ||
  "http://localhost:3000/oauth2/redirect";

export const GOOGLE_AUTH_URL =
  API_BASE_URL + "/oauth2/authorize/google?redirect_uri=" + OAUTH2_REDIRECT_URI;

export const NAVER_AUTH_URL =
  API_BASE_URL + "/oauth2/authorize/naver?redirect_uri=" + OAUTH2_REDIRECT_URI;

export const KAKAO_AUTH_URL =
  API_BASE_URL + "/oauth2/authorize/kakao?redirect_uri=" + OAUTH2_REDIRECT_URI;
