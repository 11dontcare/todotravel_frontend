import React from 'react';
import ChatRoomList from './ChatRoomList'; // 경로 수정
import ChatRoom from './ChatRoom'; // 경로 수정
import './Chat.module.css'; // 스타일을 가져옵니다.

const ChatPage = ({ chatRooms, selectedRoom, onSelectRoom }) => {
    return (
        <div className="chat-container">
            <ChatRoomList chatRooms={chatRooms} onSelectRoom={onSelectRoom} />
            {selectedRoom ? (
                <ChatRoom room={selectedRoom} />
            ) : (
                <div>채팅방을 선택해주세요</div>
            )}
        </div>
    );
};

export default ChatPage;
