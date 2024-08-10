import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signUp,
  checkUsername,
  checkEmail,
  checkNickname,
} from "../../service/AuthService";

// import styles from "./Auth.module.css";
import styles from "./SignUp.module.css";

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

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

  // 폼 유효성 검사 - 모든 필드가 채워져 있고 에러가 없는지 확인
  useEffect(() => {
    const isValid =
      Object.values(errors).every((x) => x === "") &&
      Object.values(signUpForm).every((x) => x !== "") &&
      isPasswordConfirm;
    setIsFormValid(isValid);
  }, [signUpForm, errors, isPasswordConfirm]);

  // 필드 유효성 검사 - 각 필드의 유효성 검사 및 중복 체크를 실시간으로 수행
  const validateField = async (name, value) => {
    let error = "";
    if (value.trim() === "") {
      error = "필수 항목 입니다.";
    } else {
      switch (name) {
        case "username":
          try {
            await checkUsername(value);
          } catch (e) {
            error = "이미 존재하는 아이디 입니다.";
          }
          break;
        case "email":
          if (!/\S+@\S+\.\S+/.test(value)) {
            error = "유효하지 않은 이메일 형식입니다.";
          } else {
            try {
              await checkEmail(value);
            } catch (e) {
              error = "이미 존재하는 이메일입니다.";
            }
          }
          break;
        case "nickname":
          try {
            await checkNickname(value);
          } catch (e) {
            error = "이미 존재하는 닉네임입니다.";
          }
          break;
        default:
          break;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // 비밀번호 확인 입력 핸들러
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

  // 폼 입력 변경 핸들러
  const handleLoginFormChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  // 회원가입 폼 제출 핸들러
  const onSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지 (페이지 새로 고침 방지)

    try {
      const response = await signUp(signUpForm);
      if (response.success) {
        window.alert(response.message);
        navigate("/login");
      } else {
        window.alert(response.message);
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      window.alert(error.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.title}>To Do Travel</h1>
      <p className={styles.subtitle}>회원가입에 대한 내용을 입력해주세요</p>
      <p className={styles.subtitle_description}>(모든 항목은 필수 입력 항목입니다.)</p>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.inputField}>
          <label className={styles.label} htmlFor="username">
            아이디
          </label>
          <input
            className={styles.input}
            type="text"
            name="username"
            placeholder="아이디를 입력하세요."
            value={signUpForm.username}
            onChange={handleLoginFormChange}
            required
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>
        <div className={styles.inputField}>
          <label className={styles.label} htmlFor="email">
            이메일 인증
          </label>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="이메일을 입력하세요."
            value={signUpForm.email}
            onChange={handleLoginFormChange}
            required
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.inputField}>
          <label className={styles.label} htmlFor="name">
            이름
          </label>
          <input
            className={styles.input}
            type="text"
            id="name"
            name="name"
            placeholder="이름을 입력하세요."
            value={signUpForm.name}
            onChange={handleLoginFormChange}
            required
          />
        </div>
        <div className={styles.inputField}>
          <label className={styles.label} htmlFor="nickname">
            닉네임
          </label>
          <input
            className={styles.input}
            type="text"
            id="nickname"
            name="nickname"
            placeholder="닉네임을 입력하세요."
            value={signUpForm.nickname}
            onChange={handleLoginFormChange}
            required
          />
          {errors.nickname && <p className={styles.error}>{errors.nickname}</p>}
        </div>
        <div className={styles.genderContainer}>
          <label className={styles.label}>성별</label>
          <div className={styles.genderOptions}>
            <div className={styles.genderOption}>
              <input
                type="radio"
                id="gender_male"
                name="gender"
                value="MAN"
                checked={signUpForm.gender === "MAN"}
                onChange={handleLoginFormChange}
              />
              <label htmlFor="gender_male" className={styles.genderLabel}>
                남성
              </label>
            </div>
            <div className={styles.genderOption}>
              <input
                type="radio"
                id="gender_female"
                name="gender"
                value="WOMAN"
                checked={signUpForm.gender === "WOMAN"}
                onChange={handleLoginFormChange}
              />
              <label htmlFor="gender_female" className={styles.genderLabel}>
                여성
              </label>
            </div>
          </div>
        </div>
        <div className={styles.inputField}>
          <label className={styles.label} htmlFor="birthdate">
            생일
          </label>
          <input
            className={styles.input}
            type="date"
            id="birthdate"
            name="birthDate"
            value={signUpForm.birthDate}
            onChange={handleLoginFormChange}
            required
          />
        </div>
        <div className={styles.inputField}>
          <label className={styles.label} htmlFor="password">
            비밀번호
          </label>
          <input
            className={styles.input}
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요."
            value={signUpForm.password}
            onChange={handleLoginFormChange}
            required
          />
        </div>
        <div className={styles.inputField}>
          <label className={styles.label} htmlFor="password_confirm">
            비밀번호 확인
          </label>
          <input
            className={styles.input}
            type="password"
            id="password_confirm"
            name="password_confirm"
            placeholder="비밀번호를 다시 입력하세요."
            value={passwordConfirm}
            onChange={onPasswordConfirmChange}
            required
          />
          {passwordConfirmMessage && (
            <p className={styles.error}>{passwordConfirmMessage}</p>
          )}
        </div>
        <button
          className={styles.submitButton}
          type="submit"
          disabled={!isFormValid}
        >
          가입하기
        </button>
      </form>
    </div>
  );
};

export default SignUp;
