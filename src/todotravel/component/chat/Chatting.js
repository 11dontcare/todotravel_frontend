import React, { useEffect, useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import styles from "./Chat.module.css"; //CSS import

const Chatting = ({ roomId }) => {
  const stompClient = useRef(null);
  // 채팅 내용들을 저장할 변수
  const [messages, setMessages] = useState([]);
  // 사용자 입력을 저장할 변수
  const [inputValue, setInputValue] = useState("");

  // 입력 필드에 변화가 있을 때마다 inputValue를 업데이트
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // 웹소켓 연결 설정
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

  // 웹소켓 연결 해제
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  useEffect(() => {
    if (roomId) {
      // roomId가 존재할 때만 연결
      connect();
      console.log(roomId);
      return () => disconnect();
    }
  }, [roomId]); // roomId가 변경될 때마다 useEffect 실행

  //메세지 전송
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
      <div className={styles.chattingContainer}> {/* 스타일 적용 */}
        <div className={styles.messages}>
          {messages.map((msg, index) => (
              <div
                  key={index}
                  className={`${styles.message} ${msg.nickname === localStorage.getItem("nickname") ? styles.sent : styles.received}`}
              >
                <strong>{msg.nickname}: </strong> {msg.content}
              </div>
          ))}
        </div>
        <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
        />
        <button onClick={sendMessage}></button> {/* Send 텍스트 제거 */}
      </div>
  );
};

export default Chatting;
