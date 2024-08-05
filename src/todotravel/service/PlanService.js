import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function createPlan(planRequest) {
  return request({
    url: API_BASE_URL + "/api/plan",
    method: "POST",
    body: JSON.stringify(planRequest),
  });
} //여행 플랜 생성 요청

class PlanService {}
export default new PlanService();
