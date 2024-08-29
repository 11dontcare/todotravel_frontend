import React, { useEffect, useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import styles from "./Chat.module.css";

const Chatting = ({ roomId, onNewMessage }) => {
  const stompClient = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const connect = () => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        onNewMessage(newMessage); // 새로운 메시지를 ChatList로 전달
      });
    });
  };

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  useEffect(() => {
    if (roomId) {
      connect();
      return () => disconnect();
    }
  }, [roomId]);

  const sendMessage = () => {
    const userId = localStorage.getItem("userId");
    const nickname = localStorage.getItem("nickname");

    if (stompClient.current && inputValue && userId && nickname) {
      const body = {
        roomId: roomId,
        userId: userId,
        nickname: nickname,
        content: inputValue,
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
      setInputValue("");
    }
  };

  return (
      <div className={styles.chatContainer}>
        <div className={styles.inputContainer}>
          <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // Enter 키를 감지하는 핸들러 추가
          />
          <button className={styles.sendButton} onClick={sendMessage}>보내기</button>
        </div>
      </div>
  );
};

export default Chatting;
