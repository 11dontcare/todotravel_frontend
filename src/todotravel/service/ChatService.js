import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function createChatRoom(chatRoomRequest) {
  return request({
    url: API_BASE_URL + "/api/chat/create",
    method: "POST",
    body: JSON.stringify(chatRoomRequest),
  });
} //채팅방 생성 요청

export function getChatRooms() {
  return request({
    url: API_BASE_URL + "/api/chat/rooms", // 백엔드에서 채팅방 목록을 가져오는 엔드포인트
    method: "GET",
  });
} //채팅방 목록 가져오기

class ChatService {}
export default new ChatService();
