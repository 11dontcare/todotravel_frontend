import React, { useState } from "react";
import ChatContainer from "./ChatContainer";
import styles from "./FloatingButton.module.css";
import { useAuth } from "../../context/AuthContext";

function FloatingButton() {
  // 채팅 모달이 열려 있는지 여부를 관리하는 상태
  const [isChatOpen, setChatOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  // 채팅 모달을 열고 닫는 함수
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  if (!isLoggedIn) {
    return null; // 로그인하지 않은 경우 플로팅 버튼 렌더링 X
  }

  return (
    <>
      <button
        className={`${styles.floatingButton} ${
          isChatOpen ? styles.active : ""
        }`}
        onClick={toggleChat}
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        {isChatOpen ? (
          <span className={styles.closeIcon}></span>
        ) : (
          <span className={styles.chatIcon}>
            <span className={styles.chatBubble}></span>
            <span className={styles.chatDot}></span>
          </span>
        )}
      </button>
      {isChatOpen && <ChatContainer />}
    </>
  );
}

export default FloatingButton;
