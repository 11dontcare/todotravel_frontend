import React, { useState } from 'react';
import ChatContainer from './ChatContainer';
import styles from './FloatingButton.module.css';
import { useAuth } from '../../context/AuthContext';

function FloatingButton() {
    // 채팅 모달이 열려 있는지 여부를 관리하는 상태
    const [isChatOpen, setChatOpen] = useState(false);
    const { isLoggedIn } = useAuth();

    // 채팅 모달을 열고 닫는 함수
    const toggleChat = () => {
        setChatOpen(!isChatOpen);
    };

    return (
        <>
            <div className={`${styles.floatingButton} ${isChatOpen ? styles.active : ''}`} onClick={toggleChat}>
                {!isChatOpen && (
                    <div className={styles.chatIcon}>
                        <div className={`${styles.dot} ${styles.dot1}`}></div>
                        <div className={`${styles.dot} ${styles.dot2}`}></div>
                        <div className={`${styles.dot} ${styles.dot3}`}></div>
                    </div>
                )}
                {isChatOpen && <div className={styles.closeIcon}></div>}
            </div>
            {isChatOpen && (
                isLoggedIn ? (
                    <ChatContainer />  // 로그인된 경우 채팅 모달 표시
                ) : (
                    <div className={styles.chatModal}>
                        <p className={styles.loginPrompt}>로그인 후 사용해주세요</p>
                    </div>
                )
            )}
        </>
    );
}

export default FloatingButton;
