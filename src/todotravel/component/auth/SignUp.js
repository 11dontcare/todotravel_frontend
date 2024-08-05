import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUpForm, setSignUpForm] = useState({
    username: "",
    password: "",
    nickname: "",
    name: "",
    gender: "",
    email: "",
    birthDate: "",
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onPasswordConfirmChange = (e) => {
    const passwordConfirmInput = e.target.value;
    setPasswordConfirm(passwordConfirmInput);
    if (signUpForm.password === passwordConfirmInput) {
      setPasswordConfirmMessage("");
      setIsPasswordConfirm(true);
    } else {
      setPasswordConfirmMessage("비밀번호와 일치하지 않습니다.");
      setIsPasswordConfirm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.signup(signUpForm);
      if (response.success) {
        alert("회원가입이 완료되었습니다. 환영합니다!");
        navigate("/login");
      } else {
        alert(`회원가입에 실패하였습니다. ${response.message}`);
      }
    } catch (error) {
      console.error("회원가입 오류: ", error);
      alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>회원가입</h1>
      <input
        type="text"
        name="username"
        placeholder="username 입력"
        value={signUpForm.username}
        onChange={handleInputChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="email 입력"
        value={signUpForm.email}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="name"
        placeholder="이름을 입력하세요."
        value={signUpForm.name}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="nickname"
        placeholder="닉네임을 입력하세요."
        value={signUpForm.nickname}
        onChange={handleInputChange}
        required
      />
      <div>
        <label>성별</label>
        <div>
          <input
            type="radio"
            id="gender_male"
            name="gender"
            value="MAN"
            checked={signUpForm.gender === "MAN"}
            onChange={handleInputChange}
          />
          <label htmlFor="gender_male">남성</label>
        </div>
        <div>
          <input
            type="radio"
            id="gender_female"
            name="gender"
            value="WOMAN"
            checked={signUpForm.gender === "WOMAN"}
            onChange={handleInputChange}
          />
          <label htmlFor="gender_female">여성</label>
        </div>
      </div>
      <input
        type="date"
        name="birthDate"
        placeholder="생일을 입력하세요."
        value={signUpForm.birthDate}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="비밀번호를 입력하세요."
        value={signUpForm.password}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password_confirm"
        placeholder="비밀번호를 다시 입력하세요."
        value={passwordConfirm}
        onChange={onPasswordConfirmChange}
        required
      />
      <div>{passwordConfirmMessage}</div>

      <button type="submit" disabled={!isPasswordConfirm}>
        가입하기
      </button>
    </form>
  );
};

export default SignUp;
