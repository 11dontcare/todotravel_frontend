import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { renewPassword } from '../../service/AuthService';

import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (newPassword === confirmPassword && newPassword !== '') {
      setPasswordConfirmMessage('');
      setIsPasswordConfirm(true);
    } else if (confirmPassword !== '') {
      setPasswordConfirmMessage('비밀번호가 일치하지 않습니다.');
      setIsPasswordConfirm(false);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
        const response = await renewPassword({ userId, newPassword});
        if (response.success) {
            alert('비밀번호가 성공적으로 재설정되었습니다.');
            navigate('/login');
        } else {
            setError(response.message || '비밀번호 재설정에 실패했습니다');
        }
    } catch (error) {
        console.error('비밀번호 재설정 오류: ', error);
        setError('비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title} onClick={handleTitleClick}>To Do Travel</h1>
        <p className={styles.description}>회원님의 비밀번호를 재설정해주세요.</p>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputField}>
            <label className={styles.label}>새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
              placeholder="새 비밀번호를 입력하세요."
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.label}>새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              placeholder="새 비밀번호를 다시 입력하세요."
            />
            {passwordConfirmMessage && (
              <p className={styles.error}>{passwordConfirmMessage}</p>
            )}
          </div>
          <button type="submit" className={styles.submitButton} disabled={!isPasswordConfirm}>
            확인
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;