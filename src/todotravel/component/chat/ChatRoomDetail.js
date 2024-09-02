import React, { useState, useEffect, useRef, useCallback } from "react";
import { getChatList } from "../../service/ChatService";
import { Stomp } from "@stomp/stompjs";
import styles from "./Chat.module.css";

const ChatRoomDetail = ({ roomId, roomName, onBackClick }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const stompClient = useRef(null);
  const chatContainerRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchChatHistory();
    connectWebSocket();

    return () => disconnectWebSocket();
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await getChatList(roomId);
      setMessages(response);
    } catch (error) {
      console.error("채팅 기록을 찾을 수 없음", error);
    }
  };

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    });
  };

  const disconnectWebSocket = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const sendMessage = useCallback(() => {
    const userId = localStorage.getItem("userId");
    const nickname = localStorage.getItem("nickname");

    if (
      stompClient.current &&
      inputValue.trim() &&
      userId &&
      nickname &&
      !isSending
    ) {
      setIsSending(true);
      const body = {
        roomId: roomId,
        userId: userId,
        nickname: nickname,
        content: inputValue.trim(),
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
      setInputValue("");
      setTimeout(() => setIsSending(false), 100); // 100ms 후에 전송 가능 상태로 변경
    }
  }, [inputValue, isSending, roomId]);

  const handleKeyDown = useCallback(
    (event) => {
      if (
        (event.code === "Enter" || event.code === "NumpadEnter") &&
        !event.shiftKey
      ) {
        event.preventDefault(); // 폼 제출 방지
        sendMessage();
      }
    },
    [sendMessage]
  );

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("데이트 포맷이 잘못되었습니다.", error);
      return "잘못된 날짜";
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className={styles.chatRoomDetail}>
      <div className={styles.chatHeader}>
        <button onClick={onBackClick} className={styles.backButton}>
          ← 뒤로
        </button>
        <h2>{roomName}</h2>
      </div>
      <div className={styles.chatList} ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.chatBubble} ${
              msg.userId.toString() === currentUserId
                ? styles.sentMessage
                : styles.receivedMessage
            }`}
          >
            <strong>{msg.nickname}: </strong> {msg.content}
            <small>{formatDate(msg.createdAt)}</small>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>보내기</button>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
