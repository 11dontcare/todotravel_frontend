import React, { useState } from 'react';
import styles from './RecruitModal.module.css';

const RecruitModal = ({ isOpen, onClose, onRecruit }) => {
  const [participantsCount, setParticipantsCount] = useState(1);

  const handleIncrement = () => {
    setParticipantsCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    setParticipantsCount(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    onRecruit(participantsCount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h3>모집할 인원수를 입력해주세요</h3>
        <div className={styles.counterContainer}>
          <button className={styles.counterButton} onClick={handleDecrement}>-</button>
          <span className={styles.numberDisplay}>{participantsCount}</span>
          <button className={styles.counterButton} onClick={handleIncrement}>+</button>
        </div>
        <button onClick={handleSubmit} className={styles.submitButton}>확인</button>
      </div>
    </div>
  );
};

export default RecruitModal;