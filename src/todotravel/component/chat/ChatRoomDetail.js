import React from "react";
import ChatList from "./ChatList";
import Chatting from "./Chatting";
import ChatRoomList from "./ChatRoomList";  // 추가
import styles from "./Chat.module.css";  // CSS 모듈을 import

const ChatRoomDetail = ({ roomId, chatRooms, onSelectRoom }) => {
    return (
        <div className={styles.splitContainer}>
            <div className={styles.leftPanel}>
                <ChatRoomList chatRooms={chatRooms} onSelectRoom={onSelectRoom} />
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.chatHeader}>Chat Room Detail</div>
                <ChatList roomId={roomId} />
                <Chatting roomId={roomId} />
            </div>
        </div>
    );
};

export default ChatRoomDetail;
