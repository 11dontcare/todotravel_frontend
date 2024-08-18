import React from "react";
import styles from "./Chat.module.css";  // CSS 모듈을 import

const ChatRoomList = ({ chatRooms, onSelectRoom }) => {
    return (
        <div>
            <div className={styles.chatHeader}>Chat Rooms</div>
            {/* 헤더 스타일 적용 */}
            <ul>
                {chatRooms.map((room) => (
                    <li key={room.roomId} onClick={() => onSelectRoom(room.roomId)}>
                        {room.roomName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoomList;
