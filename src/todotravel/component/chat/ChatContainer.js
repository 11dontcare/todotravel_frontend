import React, { useEffect, useState } from "react";
import { getChatRooms } from "../../service/ChatService";
import ChatRoomDetail from "./ChatRoomDetail";
import ChatList from "./ChatList";
import Chatting from "./Chatting";
import styles from "./Chat.module.css";

const ChatContainer = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const fetchChatRooms = async () => {
    try {
      const response = await getChatRooms();
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
          {selectedRoomId && (
              <>
                <ChatList roomId={selectedRoomId} newMessage={newMessage} />
                <Chatting roomId={selectedRoomId} onNewMessage={setNewMessage} />
              </>
          )}
        </div>
      </div>
  );
};

export default ChatContainer;
