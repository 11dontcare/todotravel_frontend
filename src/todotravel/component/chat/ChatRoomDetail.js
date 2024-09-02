import React, { useEffect, useState, useRef } from "react";
import ChatList from "./ChatList";
import Chatting from "./Chatting";
import ChatRoomList from "./ChatRoomList";
import styles from "./Chat.module.css";

const ChatRoomDetail = ({ roomId, chatRooms, onSelectRoom }) => {
    const [currentRoomName, setCurrentRoomName] = useState("채팅방 선택");
    const [showChatRoomList, setShowChatRoomList] = useState(false);
    const chatRoomListRef = useRef(null);
    const toggleButtonRef = useRef(null);

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

    const handleClickOutside = (event) => {
        if (
            chatRoomListRef.current &&
            !chatRoomListRef.current.contains(event.target) &&
            toggleButtonRef.current &&
            !toggleButtonRef.current.contains(event.target)
        ) {
            setShowChatRoomList(false);
        }
    };

    useEffect(() => {
        if (showChatRoomList) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showChatRoomList]);

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeaderContainer}>
                <div className={styles.chatHeader}>{currentRoomName}</div>
                <button
                    ref={toggleButtonRef}
                    className={styles.chatRoomListButton}
                    onClick={toggleChatRoomList}
                >
                    채팅방 목록
                </button>
            </div>
            {showChatRoomList && (
                <div ref={chatRoomListRef} className={`${styles.chatRoomList} ${styles.show}`}>
                    <ChatRoomList chatRooms={chatRooms} onSelectRoom={onSelectRoom} />
                </div>
            )}
            <ChatList roomId={roomId} />
            <Chatting roomId={roomId} />
        </div>
    );
};

export default ChatRoomDetail;
