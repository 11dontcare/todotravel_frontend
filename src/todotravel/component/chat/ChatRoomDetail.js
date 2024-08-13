import React from "react";
import ChatList from "./ChatList";
import Chatting from "./Chatting";
import styles from "./Chat.module.css"; //CSS import

const ChatRoomDetail = ({ roomId }) => {
  return (
      <div className={styles.chatRoomDetail}> {/* 스타일 적용 */}
          <ChatList roomId={roomId}/>
          <Chatting roomId={roomId}/>
      </div>
  );
};

export default ChatRoomDetail;
