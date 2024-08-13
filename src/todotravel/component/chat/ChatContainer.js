import React, { useEffect, useState } from "react";
import { getChatRooms } from "../../service/ChatService"; // 채팅방 리스트
import ChatRoomList from "./ChatRoomList"; // 채팅방 리스트
import ChatRoomDetail from "./ChatRoomDetail"; // 채팅방 상세
import styles from "./Chat.module.css"; //CSS import

const ChatContainer = () => {
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const [selectedRoomId, setSelectedRoomId] = useState(null); // RoomId 배열

  const fetchChatRooms = async () => {
    // 채팅방 리스트를 가져옴
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
      <div className={styles.chatContainer}> {/* 스타일 적용 */}
        <ChatRoomList chatRooms={chatRooms} onSelectRoom={setSelectedRoomId}/>
        {selectedRoomId && (
            <ChatRoomDetail key={selectedRoomId} roomId={selectedRoomId}/>
        )}
      </div>
  );
};

export default ChatContainer;
