import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleOAuth2Login } from "../../service/AuthService";
import { ACCESS_TOKEN } from "../../constant/backendAPI";

function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (token && role) {
      if (role === "ROLE_GUEST") {
        navigate("/additional-info", { state: { token: token } });
      } else {
        handleOAuth2Login(token)
          .then(data => {
            if (!data.isNewUser) {
              // 기존 사용자의 경우 로그인 처리
              localStorage.setItem("userId", data.loginData.userId);
              localStorage.setItem("nickname", data.loginData.nickname);
              localStorage.setItem("role", data.loginData.role);
              localStorage.setItem(ACCESS_TOKEN, data.loginData.accessToken);

              navigate("/");
            } else {
              throw new Error(data.message || "OAuth2 로그인 실패");
            }
          })
          .catch((error) => {
            console.error("OAuth2 로그인 에러: ", error);
            navigate("/login");
          });
      }
    } else {
      console.error("토큰 또는 역할 정보가 없습니다.");
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>OAuth2 로그인 처리 중...</div>;
}

export default OAuth2RedirectHandler;
