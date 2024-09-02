import React, { useState, useEffect } from 'react';
import styles from './Form.module.css';

const DescriptionInput = ({ value, onChange, isEditable = true }) => {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleChange = (e) => {
    const input = e.target.value;
    if (input.length <= 250) {
      onChange(e);
      setCharCount(input.length);
    }
  };

  return (
    <div className={styles.descriptionWrapper}>
      <label htmlFor="description" className={styles.descriptionLabel}>
        계획에 대한 설명 (선택, {charCount}/250자)
      </label>
      <textarea
        id="description"
        name="description"
        placeholder="여행 계획에 대한 설명을 입력해주세요"
        value={value}
        onChange={handleChange}
        className={styles.inputDescription}
        rows={4}
        maxLength={250}
        disabled={!isEditable}
      />
    </div>
  );
};

export default DescriptionInput;