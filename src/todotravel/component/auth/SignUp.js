import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

import { signUp } from "../../service/AuthService";

const SignUp = () => {
  //   const navigate = useNavigate();
  const [signUpForm, setSignUpForm] = useState({
    username: "",
    password: "",
    nickname: "",
    name: "",
    gender: "",
    email: "",
    birthDate: "",
  });

  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 오류 & 확인 메세지
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");

  // 유효성 검사
  const [isCorrectEmail, setIsCorrectEmail] = useState("");
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

  //   //이메일 입력시 이메일 유효 확인
  //   const onEmailChange = (e) => {
  //     const emailRegex =
  //       /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  //     const emailInput = e.target.value;
  //     setEmail(e.target.value);
  //     if (!emailRegex.test(emailInput)) {
  //       setEmailMessage("유효하지 않은 이메일 형식입니다.");
  //       setIsCorrectEmail(false);
  //     } else {
  //       setIsCorrectEmail(true);
  //       setSignUpForm({
  //         ...signUpForm,
  //         email: e.target.value,
  //       });
  //     }
  //   };

  //비밀번호 재 입력시 일치 확인
  const onPasswordConfirmChange = (e) => {
    const passwordConfirmInput = e.target.value;
    setPasswordConfirm(e.target.value);
    if (signUpForm.password === passwordConfirmInput) {
      setPasswordConfirmMessage("");
      setIsPasswordConfirm(true);
    } else {
      setPasswordConfirmMessage("비밀번호와 일치하지 않습니다.");
      setIsPasswordConfirm(false);
    }
  };

  //정보 입력
  const handleLoginFormChange = (e) => {
    const changedField = e.target.name; // 입력 필드의 name 속성 (예: 'email', 'password')
    setSignUpForm({
      ...signUpForm,
      [changedField]: e.target.value, // 입력 필드의 값을 업데이트
    });
  };

  //회원가입 요청하기
  const onSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지 (페이지 새로 고침 방지)
    console.log(signUpForm);

    signUp(signUpForm)
      .then((response) => {
        if (!response.success) {
          console.log(e);
          window.alert(`회원가입에 실패하였습니다. ${response.message}`);
        } else {
          console.log(response);
          window.alert("회원가입이 완료되었습니다. 환영합니다!");
          //   navigate(-1);
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
        // window.location.reload();
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>회원가입</h1>
      <input
        type='text'
        name='username'
        placeholder='username 입력'
        value={signUpForm.username}
        onChange={handleLoginFormChange}
        required
      />
      <input
        type='email'
        name='email'
        placeholder='email 입력'
        value={signUpForm.email}
        onChange={handleLoginFormChange}
        required
      />
      <input
        type='text'
        id='name'
        name='name'
        placeholder='이름을 입력하세요.'
        value={signUpForm.name}
        onChange={handleLoginFormChange}
        required
      />
      <input
        type='text'
        id='nickname'
        name='nickname'
        placeholder='닉네임을 입력하세요.'
        value={signUpForm.nickname}
        onChange={handleLoginFormChange}
        required
      />
      <div>
        <label>성별</label>
        <div>
          <input
            type='radio'
            id='gender_male'
            name='gender'
            value='MAN'
            checked={signUpForm.gender === "MAN"}
            onChange={handleLoginFormChange}
          />
          <label htmlFor='gender_male'>남성</label>
        </div>
        <div>
          <input
            type='radio'
            id='gender_female'
            name='gender'
            value='WOMAN'
            checked={signUpForm.gender === "WOMAN"}
            onChange={handleLoginFormChange}
          />
          <label htmlFor='gender_female'>여성</label>
        </div>
      </div>
      <input
        type='date'
        id='birthdate'
        name='birthDate'
        placeholder='생일을 입력하세요.'
        value={signUpForm.birthDate}
        onChange={handleLoginFormChange}
        required
      />
      <input
        type='password'
        id='password'
        name='password'
        placeholder='비밀번호를 입력하세요.'
        value={signUpForm.password}
        onChange={handleLoginFormChange}
        required
      />
      <input
        type='password'
        id='password_confirm'
        name='password_confirm'
        placeholder='비밀번호를 다시 입력하세요.'
        value={passwordConfirm}
        onChange={onPasswordConfirmChange}
        required
      />
      <div>{passwordConfirmMessage}</div>

      <button type='submit' disabled={!isPasswordConfirm}>
        가입하기
      </button>
    </form>
  );
};

export default SignUp;
