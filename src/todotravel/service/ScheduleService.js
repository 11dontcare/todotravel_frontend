import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function createSchedule(scheduleRequest, planId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/course",
    method: "POST",
    body: JSON.stringify(scheduleRequest),
  });
} //여행 플랜 -> 일정 생성

export function deleteSchedule(planId, scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/course" + scheduleId,
    method: "DELETE",
  });
} //여행 플랜 -> 일정 삭제

export function getSchedule(planId, scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/course" + scheduleId,
    method: "GET",
  });
} //여행 플랜 -> 일정 가져오기

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

export function deleteVehicle(scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + scheduleId + "/vehicle",
    method: "DELETE",
  });
} //여행 플랜 -> 일정 이동수단 삭제

export function updatePrice(priceRequest, scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + scheduleId + "/price",
    method: "PUT",
    body: JSON.stringify(priceRequest),
  });
} //여행 플랜 -> 일정 예산 등록

export function deletePrice(scheduleId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + scheduleId + "/price",
    method: "DELETE",
  });
} //여행 플랜 -> 일정 예산 삭제

class ScheduleService {}
export default new ScheduleService();
