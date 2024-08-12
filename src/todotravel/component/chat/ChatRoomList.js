import React from 'react';

const ChatRoomList = ({ chatRooms, onSelectRoom }) => {
    return (
        <div className="chat-room-list">
            <h2>Chat Rooms</h2>
            <ul>
                {chatRooms.map((room) => (
                    <li key={room.roomId} onClick={() => onSelectRoom(room.roomId)}>
                        {room.roomName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoomList;
