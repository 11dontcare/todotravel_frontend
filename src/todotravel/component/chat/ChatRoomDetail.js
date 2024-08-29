import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";  // 채팅 메시지 목록 컴포넌트
import Chatting from "./Chatting";  // 채팅 입력 컴포넌트
import ChatRoomList from "./ChatRoomList";  // 채팅방 목록 컴포넌트
import styles from "./Chat.module.css";  // CSS 모듈 import

const ChatRoomDetail = ({ roomId, chatRooms, onSelectRoom }) => {
    const [currentRoomName, setCurrentRoomName] = useState("채팅방 선택");

    useEffect(() => {
        const selectedRoom = chatRooms.find((room) => room.roomId === roomId);
        if (selectedRoom) {
            setCurrentRoomName(selectedRoom.roomName);
        } else {
            setCurrentRoomName("채팅방 선택");
        }
    }, [roomId, chatRooms]);

    const toggleChatRoomList = () => {
        const chatRoomList = document.querySelector(`.${styles.chatRoomList}`);
        if (chatRoomList.style.display === "none" || chatRoomList.style.display === "") {
            chatRoomList.style.display = "block";
        } else {
            chatRoomList.style.display = "none";
        }
    };

    return (
        <div className={styles.splitContainer}>
            <div className={styles.leftPanel}>
                <ChatRoomList chatRooms={chatRooms} onSelectRoom={onSelectRoom} />
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.chatHeaderContainer}>
                    <div className={styles.chatHeader}>{currentRoomName}</div>
                    <button className={styles.chatRoomListButton} onClick={toggleChatRoomList}>
                        채팅방 목록
                    </button>
                </div>
                <div className={styles.chatRoomList}>
                    <ChatRoomList chatRooms={chatRooms} onSelectRoom={onSelectRoom} />
                </div>
                <ChatList roomId={roomId} />
                <Chatting roomId={roomId} />
            </div>
        </div>
    );
};

export default ChatRoomDetail;
