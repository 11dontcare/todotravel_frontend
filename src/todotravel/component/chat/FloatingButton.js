import React, { useState } from 'react';
import ChatContainer from './ChatContainer';
import styles from './FloatingButton.module.css';

function FloatingButton() {
    // 채팅 모달이 열려 있는지 여부를 관리하는 상태
    const [isChatOpen, setChatOpen] = useState(false);

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
            {isChatOpen && <ChatContainer />}
        </>
    );
}

export default FloatingButton;
