import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, socialLogin } from "../../service/AuthService";
import { ACCESS_TOKEN } from "../../constant/backendAPI";

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
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
        window.alert(e.message);
      });
  };

  const handleGoSignUp = () => {
    navigate("/signup");
  };

  const handleClose = () => {
    window.history.back();
  }

  const handleSocialLogin = (provider) => {
    socialLogin(provider);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.closeButton} onClick={handleClose}>X</button>
        <h1>To Do Travel</h1>
        <h2>로그인</h2>
        <form className={styles.form} onSubmit={handleLoginFormSubmit}>
          <input
            placeholder='아이디'
            type='text'
            name='username'
            required
            value={loginForm.username}
            onChange={handleLoginFormChange}
          ></input>
          <input
            placeholder='비밀번호'
            type='password'
            name='password'
            required
            value={loginForm.password}
            onChange={handleLoginFormChange}
          ></input>
          <button className={styles.button}>로그인</button>
        </form>
        <p className={styles.forgetAuth}>아이디/비밀번호 찾기</p>
        <hr></hr>
        <div className={styles.social}>
          <img src={kakaoLogo} alt='kakao' onClick={() => handleSocialLogin('kakao')}></img>
          <img src={naverLogo} alt='naver' onClick={() => handleSocialLogin('naver')}></img>
          <img src={googleLogo} alt='google' onClick={() => handleSocialLogin('google')}></img>
        </div>
        <p className={styles.goSignUp}>
          계정이 없으신가요? <strong onClick={handleGoSignUp}>회원가입</strong>
        </p>
      </div>
    </div>
  );
}

export default Login;
