import React, { useEffect, useState } from "react";
import { getChatRooms } from "../../service/ChatService";
import ChatRoomList from "./ChatRoomList";
import ChatRoomDetail from "./ChatRoomDetail";
import styles from "./Chat.module.css";  // CSS 모듈을 import

const ChatContainer = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const fetchChatRooms = async () => {
    try {
      const response = await getChatRooms();
      console.log("채팅방 응답:", response);
      if (response && response.data && Array.isArray(response.data)) {
        setChatRooms(response.data);
      } else {
        setChatRooms([]);
      }
    } catch (error) {
      console.error("방을 찾을 수 없습니다.", error);
      setChatRooms([]);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
      <div className={styles.chatModal}>
        <div className={styles.chatContainer}>
          <ChatRoomDetail
              roomId={selectedRoomId}
              chatRooms={chatRooms}
              onSelectRoom={setSelectedRoomId}
          />
        </div>
      </div>
  );
};

export default ChatContainer;
