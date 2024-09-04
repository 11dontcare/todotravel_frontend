import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signUp,
  checkUsername,
  checkEmail,
  checkNickname,
  sendEmailVerification,
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

  // 이메일 인증 관련 상태 변수
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [verificationButtonText, setVerificationButtonText] =
    useState("인증 요청");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 폼 유효성 검사 - 모든 필드가 채워져 있고 에러가 없는지 확인
  useEffect(() => {
    const isValid =
      Object.values(errors).every((x) => x === "") &&
      Object.values(signUpForm).every((x) => x !== "") &&
      isPasswordConfirm &&
      isEmailVerified;
    setIsFormValid(isValid);
  }, [signUpForm, errors, isPasswordConfirm, isEmailVerified]);

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

  // 타이머 useEffect
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && emailVerificationCode) {
      setEmailVerificationCode("");
      setVerificationButtonText("인증 재요청");
      window.alert("인증 시간이 만료되었습니다. 다시 요청해주세요.");
    }
  }, [timeLeft, emailVerificationCode]);

  // 이메일 인증 코드 요청 함수
  const requestEmailVerification = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      const response = await sendEmailVerification(signUpForm.email);
      if (response.success) {
        setEmailVerificationCode(response.data.code);
        setVerificationButtonText("인증 재요청");
        setTimeLeft(600); // 10분 = 600초
        window.alert(response.message);
      } else {
        window.alert("이메일 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("이메일 인증 요청 에러: ", error);
      window.alert("이메일 인증 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 이메일 인증 코드 확인 함수
  const verifyEmailCode = () => {
    if (verificationCodeInput === emailVerificationCode) {
      setIsEmailVerified(true);
      window.alert("이메일이 성공적으로 인증되었습니다.");
    } else if (timeLeft === 0) {
      window.alert("인증 시간이 만료되었습니다. 다시 요청해주세요.");
    } else {
      window.alert("인증 코드가 일치하지 않습니다.");
    }
  };

  // 남은 시간 포맷팅 함수
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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
      <p className={styles.subtitle}>회원가입에 대한 내용을 입력해주세요</p>
      <p className={styles.subtitle_description}>
        (모든 부분은 필수 입력 항목입니다.)
      </p>
      <div className={styles.scrollContainer}>
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
            {errors.username && (
              <p className={styles.error}>{errors.username}</p>
            )}
          </div>
          <div className={styles.inputField}>
            <label className={styles.label} htmlFor="email">
              이메일 인증
            </label>
            <div className={styles.emailVerificationContainer}>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="이메일을 입력하세요."
                value={signUpForm.email}
                onChange={handleLoginFormChange}
                required
              />
              <button
                type="button"
                onClick={requestEmailVerification}
                disabled={
                  !signUpForm.email ||
                  errors.email ||
                  isEmailVerified ||
                  isLoading
                }
                className={`${styles.verificationButton} ${
                  isLoading ? styles.loading : ""
                }`}
              >
                {isLoading ? "요청 중..." : verificationButtonText}
              </button>
            </div>
            {errors.email && <p className={styles.error}>{errors.email}</p>}
            {emailVerificationCode && !isEmailVerified && (
              <div className={styles.emailVerificationContainer}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="인증 코드를 입력하세요."
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={verifyEmailCode}
                  className={styles.verificationButton}
                  disabled={isEmailVerified || timeLeft === 0}
                >
                  인증 확인
                </button>
                {timeLeft > 0 && (
                  <span className={styles.timer}>{formatTime(timeLeft)}</span>
                )}
              </div>
            )}
            {isEmailVerified && (
              <p className={styles.success}>이메일이 인증되었습니다.</p>
            )}
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
            {errors.nickname && (
              <p className={styles.error}>{errors.nickname}</p>
            )}
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
    </div>
  );
};

export default SignUp;
