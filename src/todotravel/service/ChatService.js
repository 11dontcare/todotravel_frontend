import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function createChatRoom(chatRoomRequest) {
  return request({
    url: API_BASE_URL + "/api/chat/create",
    method: "POST",
    body: JSON.stringify(chatRoomRequest),
  });
}

export function getChatRooms() {
  return request({
    url: `${API_BASE_URL}/api/chat/rooms/list/${localStorage.getItem(
      "userId"
    )}`,
    method: "GET",
  });
}

export function getChatList(roomId) {
  return request({
    url: API_BASE_URL + "/api/chat/rooms/find/comment-list/" + roomId,
    method: "GET",
  });
}

class ChatService {}
export default new ChatService();
