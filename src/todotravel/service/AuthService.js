import {
  ACCESS_TOKEN,
  API_BASE_URL,
  KAKAO_AUTH_URL,
  NAVER_AUTH_URL,
  GOOGLE_AUTH_URL,
} from "../constant/backendAPI";
import { request } from "./APIService";

// 회원가입 요청
export function signUp(signUpRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/signup",
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
}

// 사용자 아이디 중복 체크
export function checkUsername(username) {
  return request({
    url:
      API_BASE_URL +
      "/api/auth/check-username?username=" +
      encodeURIComponent(username),
    method: "POST",
  });
}

// 사용자 이메일 중복 체크
export function checkEmail(email) {
  return request({
    url:
      API_BASE_URL + "/api/auth/check-email?email=" + encodeURIComponent(email),
    method: "POST",
  });
}

// 사용자 닉네임 중복 체크
export function checkNickname(nickname) {
  return request({
    url:
      API_BASE_URL +
      "/api/auth/check-nickname?nickname=" +
      encodeURIComponent(nickname),
    method: "POST",
  });
}

// 이메일 인증 요청
export function sendEmailVerification(email) {
  return request({
    url: API_BASE_URL + "/api/send-mail/email",
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// 로그인 요청
export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
    credentials: "include", // 쿠키를 포함하기 위해 추가
  });
}

// 로그인 여부 확인 - 토큰
export function checkIfLoggedIn() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    // window.alert("로그인이 필요한 서비스입니다.");
    return false;
  }
  return true;
}

// 소셜 로그인 시작
export const socialLogin = (provider) => {
  let url;
  switch (provider) {
    case "kakao":
      url = KAKAO_AUTH_URL;
      break;
    case "naver":
      url = NAVER_AUTH_URL;
      break;
    case "google":
      url = GOOGLE_AUTH_URL;
      break;
    default:
      throw new Error("Unknown provider");
  }
  window.location.href = url;
};

// OAuth2 첫 가입 핸들러
export const completeOAuth2Signup = async (additionalInfo) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/oauth2/additional-info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: additionalInfo.token,
          gender: additionalInfo.gender,
          birthDate: additionalInfo.birthDate,
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      localStorage.removeItem(ACCESS_TOKEN);
      return data.data;
    }
    throw new Error(data.message || "소셜 로그인 추가 정보 입력 실패");
  } catch (error) {
    console.error("OAuth2 signup completion error: ", error);
    throw error;
  }
};

// OAuth2 로그인 핸들러
export const handleOAuth2Login = async (token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/oauth2/login?token=${token}`
    );
    const data = await response.json();
    if (data.success) {
      if (data.data.isNewUser) {
        return { isNewUser: true, userId: data.data.userId };
      } else {
        return {
          isNewUser: false,
          loginData: {
            userId: data.data.userId,
            nickname: data.data.nickname,
            role: data.data.role,
            accessToken: data.data.accessToken,
          },
        };
      }
    }
    throw new Error(data.message || "소셜 로그인 실패");
  } catch (error) {
    console.error("OAuth2 login error: ", error);
    throw error;
  }
};

// 로그아웃
export function logout() {
  return request({
    url: API_BASE_URL + "/api/auth/logout",
    method: "POST",
    credentials: "include", // 쿠키를 포함하기 위해 추가
  }).then(() => {
    // 로컬 스토리지에서 ACCESS_TOKEN 제거
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem("nickname");
    localStorage.removeItem("role");
  });
}

class AuthService {}
export default new AuthService();
