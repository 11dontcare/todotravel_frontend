import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { logout } from "../context/AuthContext";

const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem(ACCESS_TOKEN, data.data.accessToken);
      return data.data.accessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Failed to refresh token: ", error);
    alert("요청을 승인할 수 없습니다. 다시 로그인 후 시도해주세요.");
    clearLocalStorage();
    // window.location.href = "/login";
    throw error;
  }
};

async function handleJsonResponse(response) {
  const json = await response.json();
  if (!response.ok) {
    return Promise.reject(json);
  }
  return json;
}

const clearLocalStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem("userId");
  localStorage.removeItem("nickname");
  localStorage.removeItem("role");
  logout(); // isLoggedIn 상태를 false로 설정
};

const createHeaders = (contentType) => {
  const headers = new Headers();
  if (contentType) {
    headers.append("Content-Type", contentType);
  }
  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }
  return headers;
};

const handleRequestError = async (response) => {
  if (response.status === 401) {
    const errorData = await response.json();
    if (errorData.code === "EXPIRED_TOKEN") {
      return await refreshAccessToken();
    } else if (
      [
        "NOT_FOUND_TOKEN",
        "INVALID_TOKEN",
        "UNSUPPORTED_TOKEN",
        "UNKNOWN_ERROR",
      ].includes(errorData.code)
    ) {
      clearLocalStorage();
      window.location.href = "/login";
      throw new Error(
        errorData.message || "인증에 실패했습니다. 로그인을 다시 해주세요."
      );
    } else {
      throw new Error(errorData.message);
    }
  }
  return null;
};

const makeRequest = async (url, options, contentType) => {
  const headers = createHeaders(contentType);
  const defaultOptions = {
    headers: headers,
    credentials: "include",
  };
  options = Object.assign({}, defaultOptions, options);

  try {
    let response = await fetch(url, options);

    const newToken = await handleRequestError(response);
    if (newToken) {
      headers.set("Authorization", "Bearer " + newToken);
      options.headers = headers;
      response = await fetch(url, options);
    }

    return await handleJsonResponse(response);
  } catch (error) {
    console.error("Request failed: ", error);
    return Promise.reject(error);
  }
};

export const request = (options) => {
  return makeRequest(options.url, options, "application/json");
};

export const formRequest = (options) => {
  return makeRequest(options.url, options);
};

class APIService {}
export default new APIService();
