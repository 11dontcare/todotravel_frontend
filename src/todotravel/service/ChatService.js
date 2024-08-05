import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function createChatRoom(chatRoomRequest) {
  return request({
    url: API_BASE_URL + "/api/chat/create",
    method: "POST",
    body: JSON.stringify(chatRoomRequest),
  });
} //채팅방 생성 요청

class ChatService {}
export default new ChatService();
