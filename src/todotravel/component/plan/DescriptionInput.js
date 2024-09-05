import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";

const DescriptionInput = ({ value, onChange, isEditable = true }) => {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (value) {
      setCharCount(value.length);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= 250) {
      onChange(e);
      setCharCount(newValue.length);
    }
  };

  return (
    <div className={styles.descriptionWrapper}>
      <label className={styles.descriptionLabel} htmlFor='description'>
        설명:
      </label>
      <textarea
        id='description'
        name='description'
        className={styles.inputDescription}
        value={value || ""}
        onChange={handleChange}
        disabled={!isEditable}
        placeholder='250자 이하로 입력해 주세요.'
      />
      <span className={styles.charCount}>{charCount}/250</span>
    </div>
  );
};

export default DescriptionInput;
