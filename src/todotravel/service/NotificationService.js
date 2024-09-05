import { API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function showAllAlarams(userId) {
  return request({
    url: API_BASE_URL + "/api/notification/" + userId,
    method: "GET",
  });
} //사용자에 대한 모든 알림 가져오기

export function deleteAlarams(userId) {
  return request({
    url: API_BASE_URL + "/api/notification/delete/" + userId,
    method: "DELETE",
  });
} //사용자에 대한 알림 삭제하기

export function deleteAllAlarams(userId) {
  return request({
    url: API_BASE_URL + "/api/notification/deleteAll/" + userId,
    method: "DELETE",
  });
} //사용자에 대한 모든 알림 삭제하기

class NotificationService {}
export default new NotificationService();
