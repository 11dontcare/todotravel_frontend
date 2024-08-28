import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { completeOAuth2Signup } from "../../service/AuthService";
import { ACCESS_TOKEN } from "../../constant/backendAPI";
import { useAuth } from "../../context/AuthContext";

import styles from "./AdditionalInfo.module.css";

function AdditionalInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn } = useAuth();
  const [additionalInfo, setAdditionalInfo] = useState({
    token: location.state?.token, // token을 state에서 가져옴
    nickname: "",
    gender: "",
    birthDate: "",
  });

  const handleChange = (e) => {
    setAdditionalInfo({
      ...additionalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await completeOAuth2Signup(additionalInfo);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("nickname", response.nickname);
      localStorage.setItem("role", response.role);
      localStorage.setItem(ACCESS_TOKEN, response.accessToken);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("추가 정보 입력 실패:", error);
      alert("추가 정보 입력에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>추가 정보 입력</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={additionalInfo.nickname}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              name="gender"
              value={additionalInfo.gender}
              onChange={handleChange}
              required
            >
              <option value="">선택하세요</option>
              <option value="MAN">남성</option>
              <option value="WOMAN">여성</option>
            </select>
          </div>
          <div className={styles.inputField}>
            <label htmlFor="birthDate">생년월일</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={additionalInfo.birthDate}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            정보 제출
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdditionalInfo;
