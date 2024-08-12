import React from 'react';

const ChatRoom = ({ room }) => {
    return (
        <div className="chat-room">
            <h2>{room.roomName}</h2>
            <div className="chat-messages">
                {/*메세지 목록 표시*/}
            </div>
            <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
