import { API_BASE_URL } from "../constant/backendAPI";
import { request, formRequest } from "./APIService";

export function createPlan(formData) {
  return formRequest({
    url: API_BASE_URL + "/api/plan",
    method: "POST",
    body: formData,
  });
} //여행 플랜 생성 요청

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

export function getPopularPlans(page) {
  return request({
    url: `${API_BASE_URL}/api/plan/popular?page=${page}`,
    method: "GET",
  });
} // 플랜 기본 인기순으로 가져오기 (Public, No Recruitment)

export function getPopularPlansByFrontLocation(page, frontLocation) {
  return request({
    url: `${API_BASE_URL}/api/plan/popular/frontLocation?page=${page}&frontLocation=${frontLocation}`,
    method: "GET",
  });
} // 행정구역별 인기순 플랜 가져오기

export function getPopularPlansByLocation(page, frontLocation, location) {
  return request({
    url: `${API_BASE_URL}/api/plan/popular/location?page=${page}&frontLocation=${frontLocation}&location=${location}`,
    method: "GET",
  });
} // 행정구역+도시별 인기순 플랜 가져오기

export function getRecentPlans(page) {
  return request({
    url: `${API_BASE_URL}/api/plan/recent?page=${page}`,
    method: "GET",
  });
} // 플랜 기본 최신순으로 가져오기 (Public, No Recruitment)

export function getRecentPlansByFrontLocation(page, frontLocation) {
  return request({
    url: `${API_BASE_URL}/api/plan/recent/frontLocation?page=${page}&frontLocation=${frontLocation}`,
    method: "GET",
  });
} // 행정구역별 최신순 플랜 가져오기

export function getRecentPlansByLocation(page, frontLocation, location) {
  return request({
    url: `${API_BASE_URL}/api/plan/recent/location?page=${page}&frontLocation=${frontLocation}&location=${location}`,
    method: "GET",
  });
} // 행정구역+도시별 최신순 플랜 가져오기

export function modifyPlan(formData, planId) {
  return formRequest({
    url: API_BASE_URL + "/api/plan/" + planId,
    method: "PUT",
    body: formData,
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

export function isUserInPlanAccepted(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/exist/" + userId + "/accepted",
    method: "GET",
  });
} //여행 플랜에 사용자가 참여중(accepted 상태)인지 여부 요청

export function isUserInPlan(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/exist/" + userId,
    method: "GET",
  });
} //여행 플랜에 사용자가 참여중(모든(accepted,pending,rejected) 상태)인지 여부 요청

export function isInvitablePlanByUser(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/plan/" + planId + "/invitable/" + userId,
    method: "GET",
  });
}//플랜이 초대 가능한 상태인지 여부 요청

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

//플랜 모집

export function recruitmentPlan(planId, participantsCount) {
  return request({
    url: API_BASE_URL + "/api/recruitment/" + planId,
    method: "PUT",
    body: JSON.stringify(participantsCount),
  });
} //여행 플랜 모집중으로 변경 요청

export function cancelRecruitment(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/recruitment/cancel/" + planId,
    method: "PUT",
  });
} //여행 플랜 모집 취소 요청

export function viewRecruitments() {
  return request({
    url: API_BASE_URL + "/api/plan/recruitment",
    method: "GET",
  });
} //모집중인 플랜 목록 요청

export function getRecentRecruitPlans(page) {
  return request({
    url: `${API_BASE_URL}/api/recruitment/recent?page=${page}`,
    method: "GET",
  });
} // 모집 플랜 최신순으로 가져오기

export function getRecentRecruitPlansByFrontLocation(page, frontLocation) {
  return request({
    url: `${API_BASE_URL}/api/recruitment/recent/frontLocation?page=${page}&frontLocation=${frontLocation}`,
    method: "GET",
  });
} // 행정구역별 최신순 모집 플랜 가져오기

export function getRecentRecruitPlansByLocation(page, frontLocation, location) {
  return request({
    url: `${API_BASE_URL}/api/recruitment/recent/location?page=${page}&frontLocation=${frontLocation}&location=${location}`,
    method: "GET",
  });
} // 행정구역+도시별 최신순 모집 플랜 가져오기

export function getRecentRecruitPlansByStartDate(page, startDate) {
  return request({
    url: `${API_BASE_URL}/api/recruitment/recent/startDate?page=${page}&startDate=${startDate}`,
    method: "GET",
  });
} // 모집 플랜 날짜, 최신순으로 가져오기

export function getRecentRecruitPlansByFrontLocationAndStartDate(
  page,
  frontLocation,
  startDate
) {
  return request({
    url: `${API_BASE_URL}/api/recruitment/recent/frontLocation/startDate?page=${page}&frontLocation=${frontLocation}&startDate=${startDate}`,
    method: "GET",
  });
} // 날짜, 행정구역별 최신순 모집 플랜 가져오기

export function getRecentRecruitPlansByLocationAndStartDate(
  page,
  frontLocation,
  location,
  startDate
) {
  return request({
    url: `${API_BASE_URL}/api/recruitment/recent/location/startDate?page=${page}&frontLocation=${frontLocation}&location=${location}&startDate=${startDate}`,
    method: "GET",
  });
} // 날짜, 행정구역+도시별 최신순 모집 플랜 가져오기

export function requestRecruit(planId, userId) {
  return request({
    url: API_BASE_URL + "/api/recruitment/" + planId + "/request/" + userId,
    method: "POST",
  });
} //모집중인 플랜 참가 요청

export function acceptRecruit(planParticipantId) {
  return request({
    url: API_BASE_URL + "/api/recruitment/" + planParticipantId + "/accept",
    method: "PUT",
  });
} //모집중인 플랜 참가 승인 요청

export function rejectRecruit(planParticipantId) {
  return request({
    url: API_BASE_URL + "/api/recruitment/" + planParticipantId + "/reject",
    method: "PUT",
  });
} //모집중인 플랜 참가 거절 요청

//플랜 참가, 초대 리스트

export function showParticipantsByUser(userId) {
  return request({
    url: API_BASE_URL + "/api/participant/pending/" + userId,
    method: "GET",
  });
} //수락,거절할 플랜 참가,초대 목록 요청

class PlanService {}
export default new PlanService();
