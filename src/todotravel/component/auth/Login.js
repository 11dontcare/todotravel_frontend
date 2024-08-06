import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../service/AuthService";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constant/backendAPI";

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
        localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);
        localStorage.setItem(REFRESH_TOKEN, response.data.refreshToken);
        localStorage.setItem("nickname", response.data.nickname);
        localStorage.setItem("role", response.data.role);

        window.alert("로그인 되었습니다.");
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
        window.alert("로그인에 실패하였습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  return (
    <div>
      <form onSubmit={handleLoginFormSubmit}>
        <h1>LOGIN</h1>
        <label htmlFor="username">
          ID
        </label>
        <input
          type="username"
          id="username"
          name="username"
          placeholder="아이디를 입력하세요."
          required
          value={loginForm.username}
          onChange={handleLoginFormChange}
        />
        <label htmlFor="password">
          PW
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력하세요."
          required
          value={loginForm.password}
          onChange={handleLoginFormChange}
        />
        <button type="submit">
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;
