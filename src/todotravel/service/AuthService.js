import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

// 회원가입 요청
export function signUp(signUpRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/signup",
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
}

export function checkUsername(username) {
  return request({
    url:
      API_BASE_URL +
      "/api/auth/check-username?username=" +
      encodeURIComponent(username),
    method: "POST",
  });
}

export function checkEmail(email) {
  return request({
    url:
      API_BASE_URL + "/api/auth/check-email?email=" + encodeURIComponent(email),
    method: "POST",
  });
}

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
