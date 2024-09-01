import React from "react";
import styles from "./Chat.module.css";

const ChatRoomList = ({ chatRooms, onSelectRoom }) => {
    return (
        <div>
            <ul className={styles.chatRoomList}>
                {chatRooms.length > 0 ? (
                    chatRooms.map((room) => (
                        <li key={room.roomId} onClick={() => onSelectRoom(room.roomId)}>
                            {room.roomName}
                        </li>
                    ))
                ) : (
                    <li className={styles.noChatRooms}>채팅방이 없습니다</li>
                )}
            </ul>
        </div>
    );
};

export default ChatRoomList;
