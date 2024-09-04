import { API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function createLocation(locationRequest) {
  return request({
    url: API_BASE_URL + "/api/location",
    method: "POST",
    body: JSON.stringify(locationRequest),
  });
} //위치 저장하기

export function showLocation(locationId) {
  return request({
    url: API_BASE_URL + "/api/location/" + locationId,
    method: "GET",
  });
} //위치 검색하기

export function createSchedule(planId, scheduleRequest) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/course",
    method: "POST",
    body: JSON.stringify(scheduleRequest),
  });
} //여행 플랜 -> 일정 생성

export function deleteSchedule(planId, scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/course/" + scheduleId,
    method: "DELETE",
  });
} //여행 플랜 -> 일정 삭제

export function getSchedule(planId, scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/course" + scheduleId,
    method: "GET",
  });
} //여행 플랜 -> 일정 가져오기

export function updateDescription(descriptionRequest, scheduleId) {
  return request({
    url: `${API_BASE_URL}/api/plan/${scheduleId}/description`,
    method: "PUT",
    body: descriptionRequest,
    headers: {
      "Content-Type": "text/plain",
    },
  });
} //여행 플랜 -> 일정 메모 등록

export function updateStatus(scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + scheduleId + "/status",
    method: "PUT",
  });
} //여행 플랜 -> 일정 완료 여부 체크

export function updateVehicle(vehicleRequest, scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + scheduleId + "/vehicle",
    method: "PUT",
    body: JSON.stringify(vehicleRequest),
  });
} //여행 플랜 -> 일정 이동수단 등록

export function updatePrice(priceRequest, scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + scheduleId + "/price",
    method: "PUT",
    body: JSON.stringify(priceRequest),
  });
} //여행 플랜 -> 일정 예산 등록

class ScheduleService {}
export default new ScheduleService();
