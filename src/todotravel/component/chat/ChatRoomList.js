import React from "react";
import styles from "./Chat.module.css";

const ChatRoomList = ({ chatRooms, onSelectRoom }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className={styles.chatRoomList}>
      <h2>채팅방 목록</h2>
      <ul>
        {chatRooms.length > 0 ? (
          chatRooms.map((room) => (
            <li key={room.roomId} onClick={() => onSelectRoom(room.roomId)}>
              <div className={styles.roomName}>{room.roomName}</div>
              <div className={styles.roomDate}>{formatDate(room.roomDate)}</div>
              <div className={styles.userCount}>참여자 {room.userCount}명</div>
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
