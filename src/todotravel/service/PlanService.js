import { ACCESS_TOKEN, API_BASE_URL } from "../constant/backendAPI";
import { request, formRequest } from "./APIService";

export function createPlan(formData) {
  return formRequest({
    url: API_BASE_URL + "/api/plan",
    method: "POST",
    body: formData,
  });
}//여행 플랜 생성 요청

export function uploadThumbnail(formData, planId) {
  return request({
    url: API_BASE_URL + "/api/plan/thumbnail" + planId,
    method: "POST",
    body: formData,
  });
} //여행 썸네일

export function getPlan(planId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId,
    method: "GET",
  });
} //여행 플랜 조회 요청(모든 정보)

export function modifyPlan(planRequest, planId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId,
    method: "PUT",
    body: JSON.stringify(planRequest),
  });
} //여행 플랜 수정 요청

export function deletePlan(planId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId,
    method: "DELETE",
  });
} //여행 플랜 삭제 요청

export function viewPlanList() {
  return request({
    url: API_BASE_URL + "/api/plan/public",
    method: "GET",
  });
} //플랜 목록 요청

// export function viewPlanDetails(planId){
//   return request({
//     url: API_BASE_URL + "/api/plan/public/" + planId,
//     method: "GET",
//   });
// }//플랜 생성 정보, 북마크, 좋아요 조회 요청(getPlan을 사용해야 전체 정보를 받아올 수 있습니다.)

export function searchPlan(keyword) {
  return request({
    url: API_BASE_URL + "/api/plan/search/" + keyword,
    method: "GET",
  });
} //플랜 검색 요청

export function loadPlan(planId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/load",
    method: "POST",
  });
} //플랜 불러오기 요청

//플랜 참여자 관리

export function showUsers(planId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/invite",
    method: "GET",
  });
} //여행 플랜 초대 목록 요청

export function inviteUser(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/invite/" + userId,
    method: "POST",
  });
} //여행 플랜 초대 요청

export function acceptInvite(planParticipantId) {
  return request({
    url: API_BASE_URL + "/api/invite/" + planParticipantId + "/accept",
    method: "PUT",
  });
} //여행 플랜 초대 수락 요청

export function rejectInvite(planParticipantId) {
  return request({
    url: API_BASE_URL + "/api/invite/" + planParticipantId + "/reject",
    method: "PUT",
  });
} //여행 플랜 초대 거절 요청

export function showPlanUsers(planId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/participant",
    method: "GET",
  });
} //여행 플랜 참여자 목록 요청

export function exitPlan(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/participant/" + userId,
    method: "DELETE",
  });
} //여행 플랜 나가기 요청

export function isUserInPlan(planId, userId){
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/exist/" + userId,
    method: "GET",
  });
}//여행 플랜에 사용자가 참여중인지 여부 요청

//북마크, 좋아요

export function checkIsBookmarked(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/isBookmarked/" + userId,
    method: "GET",
  });
} //플랜 북마크 여부 조회 요청

export function bookmarkPlan(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/bookmark/" + userId,
    method: "POST",
  });
} //플랜 북마크 요청

export function cancelBookmark(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/bookmark/" + userId,
    method: "DELETE",
  });
} //플랜 북마크 취소 요청

export function checkIsLiked(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/isLiked/" + userId,
    method: "GET",
  });
} //플랜 좋아요 여부 조회 요청

export function likePlan(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/like/" + userId,
    method: "POST",
  });
} //플랜 좋아요 요청

export function cancelLike(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/like/" + userId,
    method: "DELETE",
  });
} //플랜 좋아요 취소 요청

//댓글

export function createComment(planId, userId, commentRequest) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/comment/" + userId,
    method: "POST",
    body: JSON.stringify(commentRequest),
  });
} //댓글 생성 요청

export function updateComment(commentId, commentRequest) {
  return request({
    url: API_BASE_URL + "/api/plan/comment/" + commentId,
    method: "PUT",
    body: JSON.stringify(commentRequest),
  });
} //댓글 수정 요청

export function deleteComment(commentId) {
  return request({
    url: API_BASE_URL + "/api/plan/comment/" + commentId,
    method: "DELETE",
  });
} //댓글 삭제 요청

class PlanService {}
export default new PlanService();
