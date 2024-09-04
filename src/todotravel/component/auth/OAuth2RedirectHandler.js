import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleOAuth2Login } from "../../service/AuthService";
import { ACCESS_TOKEN } from "../../constant/backendAPI";
import { useAuth } from "../../context/AuthContext";

function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role");
    const error = params.get("error");

    if (error) {
      console.error("OAuth2 로그인 에러: ", decodeURIComponent(error));
      alert(decodeURIComponent(error));
      navigate("/login");
      return;
    }

    if (token && role) {
      if (role === "ROLE_GUEST") {
        navigate("/additional-info", { state: { token: token } });
      } else {
        handleOAuth2Login(token)
          .then((data) => {
            // 기존 사용자의 경우 로그인 처리
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("nickname", data.nickname);
            localStorage.setItem("role", data.role);
            localStorage.setItem(ACCESS_TOKEN, data.accessToken);
            setIsLoggedIn(true);
            navigate("/");
          })
          .catch((error) => {
            console.error("OAuth2 로그인 에러: ", error);
            alert(error.message);
            navigate("/login");
          });
      }
    } else {
      console.error("토큰 또는 역할 정보가 없습니다.");
      alert("로그인 정보가 올바르지 않습니다. 다시 시도해 주세요.");
      navigate("/login");
    }
  }, [location, navigate, setIsLoggedIn]);

  return <div>OAuth2 로그인 처리 중...</div>;
}

export default OAuth2RedirectHandler;
