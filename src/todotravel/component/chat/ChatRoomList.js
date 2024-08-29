import React from "react";
import styles from "./Chat.module.css";

const ChatRoomList = ({ chatRooms, onSelectRoom }) => {
    console.log("ChatRoomList rendered with rooms:", chatRooms);

    return (
        <div className={styles.chatRoomList}>
            <ul>
                {chatRooms.length > 0 ? (
                    chatRooms.map((room) => (
                        <li key={room.roomId} onClick={() => onSelectRoom(room.roomId)}>
                            {room.roomName}
                        </li>
                    ))
                ) : (
                    <li className={styles.noChatRooms}>참여 중인 채팅방이 없습니다</li>
                )}
            </ul>
        </div>
    );
};

export default ChatRoomList;
