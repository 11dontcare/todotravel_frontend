import React from "react";
import ChatList from "./ChatList";
import Chatting from "./Chatting";
import styles from "./Chat.module.css";  // CSS 모듈을 import

const ChatRoomDetail = ({ roomId }) => {
    return (
        <div>
            <div className={styles.chatHeader}>Chat Room Detail</div>
            {/* 헤더 스타일 적용 */}
            <ChatList roomId={roomId}/>
            <Chatting roomId={roomId}/>
        </div>
    );
};

export default ChatRoomDetail;
