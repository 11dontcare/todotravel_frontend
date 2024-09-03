import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateVote, deleteVote, castVote } from "../../../service/VoteService";
import styles from "./Vote.module.css";

const VoteList = ({ voteList }) => {
  const { planId } = useParams();
  const [locationId, setLocationId] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [selectedVoteId, setSelectedVoteId] = useState(null);
  const [voteDetails, setVoteDetails] = useState(null);

  const handleUpdateVote = async () => {
    const voteRequest = {
      locationId: parseInt(locationId),
      endDate: new Date(endDate).toISOString(),
      category: category,
    };

    if (!selectedVoteId) return;

    try {
      await updateVote(voteRequest, planId, selectedVoteId);
      // fetchVoteList();
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const handleDeleteVote = (voteId) => {
    if (!planId) return;
    deleteVote(planId, voteId)
      .then((response) => {
        window.alert(response.message);
        // fetchVoteList();
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const handleCastVote = async (voteId) => {
    try {
      await castVote(voteId);
      // fetchVoteList();
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  return (
    <div className={styles.container}>
      {voteList.length > 0 ? (
        <ul>
          {voteList.map((vote) => (
            <li key={vote.voteId} id={vote.voteId}>
              {vote.voteId}
              <button onClick={() => setSelectedVoteId(vote.voteId)}>
                선택
              </button>
              <button onClick={() => handleDeleteVote(vote.voteId)}>
                삭제
              </button>
              <button onClick={() => handleCastVote(vote.voteId)}>
                투표하기
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>투표가 없습니다.</p>
      )}
      {voteDetails && (
        <div>
          <h3>투표 상세보기</h3>
          <p>ID: {voteDetails.id}</p>
          <p>제목: {voteDetails.title}</p>
          {/* 필요한 경우 추가 정보를 표시 */}
        </div>
      )}
    </div>
  );
};

export default VoteList;
