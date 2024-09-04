import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./UsernameResult.module.css";

const UsernameResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType, name, username, email, createdDate, socialType } =
    location.state || {};

  const handleLogin = () => {
    navigate("/login");
  };

  const handleFindPassword = () => {
    navigate("/find-account", { state: { activeTab: "password" } });
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title} onClick={handleTitleClick}>
        To Do Travel
      </h1>
      <p className={styles.description}>
        {name}님의 계정 정보가 검색되었습니다.
      </p>
      <div className={styles.resultTable}>
        {userType === "regular" ? (
          <>
            <div className={styles.row}>
              <div className={styles.label}>아이디</div>
              <div className={styles.value}>{username}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.label}>가입일</div>
              <div className={styles.value}>
                {new Date(createdDate).toLocaleDateString()}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.row}>
              <div className={styles.label}>이메일</div>
              <div className={styles.value}>{email}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.label}>소셜 계정</div>
              <div className={styles.value}>{socialType}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.label}>가입일</div>
              <div className={styles.value}>
                {new Date(createdDate).toLocaleDateString()}
              </div>
            </div>
          </>
        )}
      </div>
      {userType === "regular" ? (
        <div className={styles.buttonGroup}>
          <button onClick={handleLogin} className={styles.loginButton}>
            로그인
          </button>
          <button
            onClick={handleFindPassword}
            className={styles.findPasswordButton}
          >
            비밀번호 찾기
          </button>
        </div>
      ) : (
        <div className={styles.buttonGroupSocial}>
          <button onClick={handleLogin} className={styles.loginButtonSocial}>
            로그인
          </button>
        </div>
      )}
    </div>
  );
};

export default UsernameResult;
