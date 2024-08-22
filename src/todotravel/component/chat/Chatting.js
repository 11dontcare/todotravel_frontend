import React, { useEffect, useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import styles from "./Chat.module.css";  // CSS 모듈을 import

const Chatting = ({ roomId }) => {
  const stompClient = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const connect = () => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
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
      console.log(roomId);
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
      <div>
        <input type="text" value={inputValue} onChange={handleInputChange}/>
        <button className={styles.sendButton} onClick={sendMessage}>Send</button>
        {/* 수정된 스타일 클래스 적용 */}
      </div>
  );
};

export default Chatting;