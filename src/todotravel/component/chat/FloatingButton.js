import React, { useState } from 'react';
import ChatContainer from './ChatContainer';
import './FloatingButton.module.css';

function FloatingButton() {
    // 채팅 모달이 열려 있는지 여부를 관리하는 상태
    const [isChatOpen, setChatOpen] = useState(false);

    // 채팅 모달을 열고 닫는 함수
    const toggleChat = () => {
        setChatOpen(!isChatOpen);
    };

    return (
        <>
            <div className={`floatingButton ${isChatOpen ? 'active' : ''}`} onClick={toggleChat}>
                {/* 채팅창이 열려있지 않을 때 표시될 아이콘 */}
                {!isChatOpen && (
                    <div className="chatIcon">
                        <div className="dot dot1"></div>
                        <div className="dot dot2"></div>
                        <div className="dot dot3"></div>
                    </div>
                )}
                {/* 채팅창이 열려있을 때 표시될 X 아이콘 */}
                {isChatOpen && (
                    <div className="closeIcon"></div>
                )}
            </div>
            {isChatOpen && <ChatContainer />}
        </>
    );
}

export default FloatingButton;
