import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constant/backendAPI";

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  try {
    const response = await fetch("/api/token/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
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
    // 로그아웃 처리
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    window.location.href = "/login";
    throw error;
  }
};

export const request = async (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  try {
    const response = await fetch(options.url, options);
    const json = await response.json();

    if (response.ok) {
      return json;
    }

    if (response.status === 401) {
      // accessToken이 만료된 경우
      const newAccessToken = await refreshAccessToken();
      headers.set("Authorization", "Bearer " + newAccessToken);
      options.headers = headers;

      // 새로운 accessToken으로 요청 재시도
      const retryResponse = await fetch(options.url, options);
      const retryJson = await retryResponse.json();

      if (!retryResponse.ok) {
        return Promise.reject(retryJson);
      }
      return retryJson;
    }

    return Promise.reject(json);
  } catch (error) {
    console.error("Request failed: ", error);
    return Promise.reject(error);
  }
};

export const formRequest = (options) => {
  const headers = new Headers({
    "Content-Type": "multipart/form-data",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

class APIService {}
export default new APIService();