import React from "react";
import styles from "./Modal.module.css"; // CSS 모듈 가져오기

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null; // show가 false일 때 모달을 렌더링하지 않음
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {React.cloneElement(children, { onClose })}
      </div>
    </div>
  );
};

export default Modal;
