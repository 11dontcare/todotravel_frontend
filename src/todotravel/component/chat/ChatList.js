import React, { useEffect, useState } from "react";
import { getChatList } from "../../service/ChatService";
import styles from "./Chat.module.css";  // CSS 모듈을 import

const ChatList = ({ roomId }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const userId = localStorage.getItem("userId"); // 현재 로그인된 사용자의 ID를 로컬 스토리지에서 가져옴

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
        <div>
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
