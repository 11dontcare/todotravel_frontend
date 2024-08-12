import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './UsernameResult.module.css';

const UsernameResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, username, createdDate } = location.state || {};

  const handleLogin = () => {
    navigate('/login');
  };

  const handleFindPassword = () => {
    navigate('/profile-search', { state: { activeTab: 'password' } });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>To Do Travel</h1>
        <p className={styles.description}>{name}님의 아이디가 검색되었습니다.</p>
        <div className={styles.resultTable}>
          <div className={styles.row}>
            <div className={styles.label}>아이디</div>
            <div className={styles.value}>{username}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>가입일</div>
            <div className={styles.value}>{new Date(createdDate).toLocaleDateString()}</div>
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleLogin} className={styles.loginButton}>로그인</button>
          <button onClick={handleFindPassword} className={styles.findPasswordButton}>비밀번호 찾기</button>
        </div>
      </div>
    </div>
  );
};

export default UsernameResult;