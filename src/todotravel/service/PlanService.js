import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function createPlan(planRequest) {
  return request({
    url: API_BASE_URL + "/api/plan",
    method: "POST",
    body: JSON.stringify(planRequest),
  });
} //여행 플랜 생성 요청

export function modifyPlan(planRequest, planId){
  return request({
    url: API_BASE_URL + "/api/plan/" + planId,
    method: "PUT",
    body: JSON.stringify(planRequest),
  });
}//여행 플랜 수정 요청

export function deletePlan(planId){
  return request({
    url: API_BASE_URL + "/api/plan/" + planId,
    method: "DELETE",
  });
}//여행 플랜 삭제 요청

export function viewPlanList(){
  return request({
    url: API_BASE_URL + "/api/plan/get",
    method: "GET",
  });
}//플랜 목록 요청

export function viewPlanDetails(planId){
  return request({
    url: API_BASE_URL + "/api/plan/specific/" + planId,
    method: "GET",
  });
}//플랜 상세 요청

export function searchPlan(keyword){
  return request({
    url: API_BASE_URL + "/api/plan/search/" + keyword,
    method: "GET",
  });
}//플랜 검색 요청

export function method(planId){
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/load",
    method: "POST"
  });
}//플랜 불러오기 요청

class PlanService {}
export default new PlanService();
