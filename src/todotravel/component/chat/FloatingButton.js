import React, { useState } from 'react';
import ChatContainer from './ChatContainer';
import styles from './FloatingButton.module.css';
import { useAuth } from '../../context/AuthContext';

function FloatingButton() {
    const [isChatOpen, setChatOpen] = useState(false);
    const { isLoggedIn } = useAuth();

    const toggleChat = () => {
        setChatOpen(!isChatOpen);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setChatOpen(false);
        }
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
                <div className={styles.chatOverlay} onClick={handleOverlayClick}>
                    {isLoggedIn ? (
                        <ChatContainer />
                    ) : (
                        <div className={styles.chatModal}>
                            <p className={styles.loginPrompt}>로그인 후 사용해주세요</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default FloatingButton;
