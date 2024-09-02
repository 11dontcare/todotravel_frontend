import React, { useState, useEffect } from "react";
import { getChatRooms } from "../../service/ChatService";
import ChatRoomList from "./ChatRoomList";
import ChatRoomDetail from "./ChatRoomDetail";
import styles from "./Chat.module.css";

const ChatContainer = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomList, setShowRoomList] = useState(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getChatRooms(userId);
        if (response && response.data && Array.isArray(response.data)) {
          setChatRooms(response.data);
        }
      } catch (error) {
        console.error("채팅방을 불러오는데 실패했습니다.", error);
      }
    };

    fetchChatRooms();
  }, []);

  const handleRoomSelect = (roomId) => {
    const room = chatRooms.find(room => room.roomId === roomId);
    setSelectedRoom(room);
    setShowRoomList(false);
  };

  return (
    <div className={styles.chatModal}>
      {showRoomList ? (
        <ChatRoomList chatRooms={chatRooms} onSelectRoom={handleRoomSelect} />
      ) : (
        <ChatRoomDetail
          roomId={selectedRoom.roomId}
          roomName={selectedRoom.roomName}
          onBackClick={() => setShowRoomList(true)}
        />
      )}
    </div>
  );
};

export default ChatContainer;