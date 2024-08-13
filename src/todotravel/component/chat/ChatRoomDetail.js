import React from "react";
import ChatList from "./ChatList";
import Chatting from "./Chatting";

const ChatRoomDetail = ({ roomId }) => {
  return (
    <div className="chat-room-detail">
      <ChatList roomId={roomId} />
      <Chatting roomId={roomId} />
    </div>
  );
};

export default ChatRoomDetail;
