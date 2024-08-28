import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, socialLogin } from "../../service/AuthService";
import { ACCESS_TOKEN } from "../../constant/backendAPI";
import { useAuth } from "../../context/AuthContext";

import styles from "./Login.module.css";

import kakaoLogo from "../../../image/kakao.png";
import naverLogo from "../../../image/naver.png";
import googleLogo from "../../../image/google.png";

function Login() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const { setIsLoggedIn } = useAuth();

  const handleLoginFormChange = (e) => {
    const changedField = e.target.name;
    setLoginForm({
      ...loginForm,
      [changedField]: e.target.value,
    });
  };

  const handleLoginFormSubmit = (e) => {
    e.preventDefault();
    login(loginForm)
      .then((response) => {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("nickname", response.data.nickname);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);

        window.alert(response.message);
        setIsLoggedIn(true);
        navigate("/");
      })
      .catch((error) => {
        console.log("Login error: ", error);
        window.alert("아이디 혹은 비밀번호가 일치하지 않습니다.");
      });
  };

  const handleGoProfileSearch = () => {
    navigate("/find-account");
  };

  const handleGoSignUp = () => {
    navigate("/signup");
  };

  // const handleClose = () => {
  //   window.history.back();
  // }

  const handleSocialLogin = (provider) => {
    socialLogin(provider);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.titleWrap}>
          <h1>만나서 반가워요!</h1>
          <h3>서비스 이용을 위해 로그인이 필요해요.</h3>
        </div>

        <p className={styles.snsLogin}>SNS 로그인</p>
        <div className={styles.socialButtons}>
          <img
            src={naverLogo}
            alt="naver"
            onClick={() => handleSocialLogin("naver")}
            className={styles.socialButton}
          />
          <img
            src={kakaoLogo}
            alt="kakao"
            onClick={() => handleSocialLogin("kakao")}
            className={styles.socialButton}
          />
          <img
            src={googleLogo}
            alt="google"
            onClick={() => handleSocialLogin("google")}
            className={styles.socialButton}
          />
        </div>

        <hr />

        <form className={styles.form} onSubmit={handleLoginFormSubmit}>
          <input
            placeholder="아이디"
            type="text"
            name="username"
            required
            value={loginForm.username}
            onChange={handleLoginFormChange}
          />
          <input
            placeholder="비밀번호"
            type="password"
            name="password"
            required
            value={loginForm.password}
            onChange={handleLoginFormChange}
          />
          <button className={styles.loginButton}>로그인</button>
        </form>

        <div className={styles.bottomLinks}>
          <span onClick={handleGoProfileSearch}>아이디/비밀번호 찾기</span>
          <span>|</span>
          <span onClick={handleGoSignUp}>회원가입</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
