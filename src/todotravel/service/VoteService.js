import { API_BASE_URL } from "../constant/backendAPI";
import { request } from "./APIService";

export function createVote(voteRequest, planId) {
  return request({
    url: API_BASE_URL + "/api/vote/" + planId,
    method: "POST",
    body: JSON.stringify(voteRequest),
  });
} //투표 생성하기

export function updateVote(voteRequest, planId, voteId) {
  return request({
    url: API_BASE_URL + "/api/vote/" + planId + "/" + voteId,
    method: "PUT",
    body: JSON.stringify(voteRequest),
  });
} //투표 수정하기

export function deleteVote(planId, voteId) {
  return request({
    url: API_BASE_URL + "/api/vote/" + planId + "/" + voteId,
    method: "DELETE",
  });
} //투표 삭제하기

export function showAllVote(planId) {
  return request({
    url: API_BASE_URL + "/api/vote/" + planId + "/list",
    method: "GET",
  });
} //투표 전체보기

export function showVote(voteId) {
  return request({
    url: API_BASE_URL + "/api/vote/" + voteId,
    method: "GET",
  });
} //투표 단일보기

export function castVote(voteId) {
  return request({
    url: API_BASE_URL + "/api/vote/" + voteId + "/vote",
    method: "POST",
  });
} //투표 생성하기

class VoteService {}
export default new VoteService();
