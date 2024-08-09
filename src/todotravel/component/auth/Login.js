import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../service/AuthService";
<<<<<<< HEAD
import { ACCESS_TOKEN } from "../../constant/backendAPI";
=======
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constant/backendAPI";
>>>>>>> f31a73d (Feat: 충돌 전 수정)

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
<<<<<<< HEAD
=======
        localStorage.setItem(REFRESH_TOKEN, response.data.refreshToken);
>>>>>>> f31a73d (Feat: 충돌 전 수정)
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
<<<<<<< HEAD
        <label htmlFor="username">ID</label>
        <input
          type="username"
          id="username"
          name="username"
          placeholder="아이디를 입력하세요."
=======
        <label htmlFor='username'>ID</label>
        <input
          type='username'
          id='username'
          name='username'
          placeholder='아이디를 입력하세요.'
>>>>>>> f31a73d (Feat: 충돌 전 수정)
          required
          value={loginForm.username}
          onChange={handleLoginFormChange}
        />
<<<<<<< HEAD
        <label htmlFor="password">PW</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력하세요."
=======
        <label htmlFor='password'>PW</label>
        <input
          type='password'
          id='password'
          name='password'
          placeholder='비밀번호를 입력하세요.'
>>>>>>> f31a73d (Feat: 충돌 전 수정)
          required
          value={loginForm.password}
          onChange={handleLoginFormChange}
        />
<<<<<<< HEAD
        <button type="submit">로그인</button>
=======
        <button type='submit'>로그인</button>
>>>>>>> f31a73d (Feat: 충돌 전 수정)
      </form>
    </div>
  );
}

export default Login;
