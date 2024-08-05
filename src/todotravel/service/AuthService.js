import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
} //로그인 요청

export function signUp(signUpRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/signup",
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
} //회원가입 요청

export function checkIfLoggedIn() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    window.alert("로그인이 필요한 서비스입니다.");
    return false;
  }
  return true;
} //로그인 여부 확인 - 토큰

class AuthService {}
export default new AuthService();
