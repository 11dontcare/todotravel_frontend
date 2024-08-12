import React, { useEffect, useState } from 'react';
import ChatPage from '../pages/ChatPage';
import { getChatRooms } from '../../service/ChatService'; // 함수 임포트

const ChatContainer = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    const fetchChatRooms = async () => {
        try {
            const response = await getChatRooms(); // 채팅방 목록을 가져옴
            setChatRooms(response);
        } catch (error) {
            console.error('Failed to fetch chat rooms', error);
        }
    };

    useEffect(() => {
        fetchChatRooms(); // 컴포넌트 마운트 시 채팅방 목록을 가져옴
    }, []);

    const handleSelectRoom = (roomId) => {
        setSelectedRoomId(roomId);
    };

    const selectedRoom = chatRooms.find((room) => room.roomId === selectedRoomId);

    return (
        <ChatPage
            chatRooms={chatRooms}
            selectedRoom={selectedRoom}
            onSelectRoom={handleSelectRoom}
        />
    );
};

export default ChatContainer;
