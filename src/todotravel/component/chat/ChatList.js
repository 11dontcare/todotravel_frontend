import React, { useEffect, useState, useRef } from "react";
import { getChatList } from "../../service/ChatService";
import styles from "./Chat.module.css";

const ChatList = ({ roomId, newMessage }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const userId = localStorage.getItem("userId");
    const chatListRef = useRef(null);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await getChatList(roomId);
                setChatHistory(response);
            } catch (error) {
                console.error("채팅 기록을 찾을 수 없음", error);
            }
        };

        if (roomId) {
            fetchChatHistory();
        }
    }, [roomId]);

    useEffect(() => {
        if (chatListRef.current) {
            chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
    }, [chatHistory]);


    const formatDate = (dateString) => {
        try {
            const [datePart, timePart] = dateString.split("T");
            const [hours, minutes] = timePart.split(":");

            const date = new Date(`${datePart}T${hours}:${minutes}:00Z`);

            return date.toLocaleString("en-GB", {
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

    return (
        <div ref={chatListRef} className={styles.chatContainer}>
            <ul>
                {chatHistory.map((chat, index) => (
                    <li
                        key={index}
                        className={`${styles.chatBubble} ${chat.userId === Number(userId) ? styles.sentMessage : styles.receivedMessage}`}
                    >
                        <strong>{chat.nickname}:</strong> {chat.content} <br/>
                        <small>{formatDate(chat.chat_date)}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
