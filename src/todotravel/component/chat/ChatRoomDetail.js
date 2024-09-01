import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import Chatting from "./Chatting";
import ChatRoomList from "./ChatRoomList";
import styles from "./Chat.module.css";

const ChatRoomDetail = ({ roomId, chatRooms, onSelectRoom }) => {
    const [currentRoomName, setCurrentRoomName] = useState("채팅방 선택");
    const [showChatRoomList, setShowChatRoomList] = useState(false);

    useEffect(() => {
        const selectedRoom = chatRooms.find((room) => room.roomId === roomId);
        if (selectedRoom) {
            setCurrentRoomName(selectedRoom.roomName);
        } else {
            setCurrentRoomName("채팅방 선택");
        }
    }, [roomId, chatRooms]);

    const toggleChatRoomList = () => {
        setShowChatRoomList(prevState => !prevState);
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeaderContainer}>
                <div className={styles.chatHeader}>{currentRoomName}</div>
                <button className={styles.chatRoomListButton} onClick={toggleChatRoomList}>
                    채팅방 목록
                </button>
            </div>
            {showChatRoomList && (
                <div className={`${styles.chatRoomList} ${styles.show}`}>
                    <ChatRoomList chatRooms={chatRooms} onSelectRoom={onSelectRoom} />
                </div>
            )}
            <ChatList roomId={roomId} />
            <Chatting roomId={roomId} />
        </div>
    );
};

export default ChatRoomDetail;
