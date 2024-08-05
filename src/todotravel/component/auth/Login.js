import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService"; // 로그인 서비스

function Login() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(loginForm);
      if (response.success) {
        alert("로그인에 성공했습니다.");
        navigate("/");
      } else {
        alert(
          response.message ||
            "ID 혹은 비밀번호를 잘못 입력하셨거나 등록되지 않은 ID 입니다."
        );
      }
    } catch (error) {
      console.error("Login error", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">사용자명:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={loginForm.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginForm.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
