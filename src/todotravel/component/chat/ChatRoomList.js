import React from "react";
import styles from "./Chat.module.css"; //CSS import

const ChatRoomList = ({ chatRooms, onSelectRoom }) => {
  return (
      <div className={styles.chatRoomList}> {/* 스타일 적용 */}
          <h2>Chat Rooms</h2>
          <ul>
              {chatRooms.map((room) => (
                  <li
                      key={room.roomId}
                      onClick={() => onSelectRoom(room.roomId)}
                  >
                      {room.roomName}
                  </li>
              ))}
          </ul>
      </div>
  );
};

export default ChatRoomList;
