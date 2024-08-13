import React, { useEffect, useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import { useParams } from "react-router-dom";

const Chatting = () => {
  const { roomId } = useParams();

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
      stompClient.current.subscribe(`/sub/chatroom/` + roomId, (message) => {
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
    connect();
    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => disconnect();
  }, [roomId]);

  //메세지 전송
  const sendMessage = () => {
    if (stompClient.current && inputValue) {
      const body = {
        roomId: roomId,
        content: inputValue,
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
      setInputValue("");
    }
  };

  return (
    <div className="chatting-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
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
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatting;
