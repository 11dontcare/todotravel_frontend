export const API_BASE_URL = "http://localhost:8080";

export const ACCESS_TOKEN = "accessToken";
export const ACCESS_TOKEN_EXPIRED_MESC = 30 * 60 * 1000; // 30분

export const REFRESH_TOKEN = "refreshToken";
export const REFRESH_TOKEN_EXPIRED_MESC = 14 * 24 * 60 * 60 * 1000; // 14일

// API Endpoints
export const LOGIN_ENDPOINT = "/api/auth/login";
export const SIGNUP_ENDPOINT = "/api/auth/signup";
export const LOGOUT_ENDPOINT = "/api/auth/logout";
export const CHECK_USERNAME_ENDPOINT = "/api/auth/check-username";
export const CHECK_EMAIL_ENDPOINT = "/api/auth/check-email";
export const CHECK_NICKNAME_ENDPOINT = "/api/auth/check-nickname";
export const FIND_USERNAME_ENDPOINT = "/api/auth/find-username";
export const REFRESH_TOKEN_ENDPOINT = "/api/token/refresh";

// export const OAUTH2_REDIRECT_URI = "http://localhost:3000/oauth2/redirect";
// export const GOOGLE_AUTH_URL =
//   API_BASE_URL + "/oauth2/authorize/google?redirect_uri=" + OAUTH2_REDIRECT_URI;

// export const NAVER_AUTH_URL =
//   API_BASE_URL + "/oauth2/authorize/naver?redirect_uri=" + OAUTH2_REDIRECT_URI;

// export const KAKAO_AUTH_URL =
//   API_BASE_URL + "/oauth2/authorize/kakao?redirect_uri=" + OAUTH2_REDIRECT_URI;

// Token 관련 함수
export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};

export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN);
};

export const removeTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem("tokenExpirationTime");
};

export const setTokenExpirationTime = (expirationTime) => {
  localStorage.setItem("tokenExpirationTime", expirationTime);
};

export const getTokenExpirationTime = () => {
  return localStorage.getItem("tokenExpirationTime");
};

export const isTokenExpired = () => {
  const expirationTime = getTokenExpirationTime();
  if (!expirationTime) return true;
  return new Date().getTime() > parseInt(expirationTime);
};

export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(API_BASE_URL + REFRESH_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    setTokenExpirationTime(data.accessTokenExpirationTime);

    return data.accessToken;
  } catch (error) {
    console.error("Token refresh failed: ", error);
    removeTokens();
    throw error;
  }
};

export const checkIfLoggedIn = () => {
  return !!getAccessToken() && !isTokenExpired();
};
