import React, { useState, useEffect, useRef, useCallback } from "react";
import { getChatList } from "../../service/ChatService";
import { Stomp } from "@stomp/stompjs";
import styles from "./Chat.module.css";
import { WS_BASE_URL } from "../../constant/backendAPI";

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
      const messages = response.data;
      setMessages(Array.isArray(messages) ? messages : []);
    } catch (error) {
      console.error("채팅 기록을 찾을 수 없음", error);
      setMessages([]);
    }
  };

  const connectWebSocket = () => {
    const socket = new WebSocket(
      `wss://${WS_BASE_URL}/ws` || "ws://localhost:8080/ws"
    );
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

  const sendMessage = useCallback(() => {
    const userId = localStorage.getItem("userId");
    const nickname = localStorage.getItem("nickname");
    const messageContent = inputValue.trim();

    if (
      stompClient.current &&
      messageContent &&
      userId &&
      nickname &&
      !isSending
    ) {
      setIsSending(true);
      setInputValue(""); // 입력값을 즉시 초기화

      const body = {
        roomId: roomId,
        userId: userId,
        nickname: nickname,
        content: messageContent,
      };

      // 메시지 전송을 비동기적으로 처리
      setTimeout(() => {
        stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
        setIsSending(false);
      }, 0);
    }
  }, [inputValue, isSending, roomId]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (
        (event.key === "Enter" || event.key === "NumpadEnter") &&
        !event.shiftKey
      ) {
        event.preventDefault();
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
