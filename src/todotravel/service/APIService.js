import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";

const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh`, {
      method: "POST",
      credentials: "include", // 쿠키를 포함하기 위해 추가
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      localStorage.setItem(ACCESS_TOKEN, data.data.accessToken);
      return data.data.accessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Failed to refresh token: ", error);
    // 갱신 실패 시 강제 로그아웃 처리
    alert("요청을 승인할 수 없습니다. 다시 로그인 후 시도해주세요.");
    clearLocalStorage();
    window.location.href = "/login";
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

  const defaults = {
    headers: headers,
    credentials: "include", // 모든 요청에 쿠키 포함
  };
  options = Object.assign({}, defaults, options);

  try {
    const response = await fetch(options.url, options);
    console.log(response);

    // AccessToken 만료된 경우 갱신 시도
    if (response.status === 401) {
      const errorData = await response.json();

      // 토큰이 만료된 경우에만 재발급 시도
      if (errorData.code === "EXPIRED_TOKEN") {
        try {
          const newAccessToken = await refreshAccessToken();
          headers.set("Authorization", "Bearer " + newAccessToken);
          options.headers = headers;

          const retryResponse = await fetch(options.url, options);
          return await handleJsonResponse(retryResponse);
        } catch (refreshError) {
          clearLocalStorage();
          window.location.href = "/login";
          throw new Error("회원 인증에 실패했습니다. 로그인을 다시 해주세요.");
        }
      } else if (
        [
          "NOT_FOUND_TOKEN",
          "INVALID_TOKEN",
          "UNSUPPORTED_TOKEN",
          "UNKNOWN_ERROR",
        ].includes(errorData.code)
      ) {
        // 다른 인증 오류의 경우 (예: 유효하지 않은 토큰, 지원되지 않는 토큰 등)
        clearLocalStorage();
        window.location.href = "/login";
        throw new Error(
          errorData.message || "인증에 실패했습니다. 로그인을 다시 해주세요."
        );
      } else {
        throw new Error(errorData.message);
      }
    }

    // 만료된게 아니라면 응답을 그대로 전달
    return await handleJsonResponse(response);
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
