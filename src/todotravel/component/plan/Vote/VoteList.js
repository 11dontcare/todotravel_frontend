import React, { useEffect, useState } from "react";
import {
  createVote,
  updateVote,
  deleteVote,
  showAllVote,
  showVote,
  castVote,
} from "../../../service/VoteService";
import { useParams } from "react-router-dom";

import styles from "./Vote.module.css";
import { IoArrowBack } from "react-icons/io5";

import VoteCreate from "./VoteCreate.js";

const VoteList = ({ onClose }) => {
  const [voteList, setVoteList] = useState([]);
  const [locationId, setLocationId] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [selectedVoteId, setSelectedVoteId] = useState(null);
  const [voteDetails, setVoteDetails] = useState(null);
  const { planId } = useParams();

  // 디버깅을 위해 planId를 로그에 출력
  useEffect(() => {
    console.log("planId:", planId);
    if (planId) {
      fetchVoteList();
    }
  }, [planId]);

  const handleCreateVote = async () => {
    const voteRequest = {
      locationId: parseInt(locationId),
      endDate: new Date(endDate).toISOString(),
      category: category,
    };

    try {
      await createVote(voteRequest, planId);
      fetchVoteList();
    } catch (error) {
      console.error("Error creating vote:", error);
    }
  };

  const handleUpdateVote = async () => {
    const voteRequest = {
      locationId: parseInt(locationId),
      endDate: new Date(endDate).toISOString(),
      category: category,
    };

    if (!selectedVoteId) return;

    try {
      await updateVote(voteRequest, planId, selectedVoteId);
      fetchVoteList();
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const handleDeleteVote = (voteId) => {
    if (!planId) return;
    deleteVote(planId, voteId)
      .then((response) => {
        window.alert(response.message);
        fetchVoteList();
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주세요.");
        setVoteList([]);
      });
  };

  const handleShowVote = (voteId) => {
    showVote(voteId)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주세요.");
        setVoteList([]);
      });
  };

  const fetchVoteList = () => {
    if (!planId) return;
    showAllVote(planId)
      .then((response) => {
        setVoteList(response.data.content);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주세요.");
        setVoteList([]);
      });
  };

  const handleCastVote = async (voteId) => {
    try {
      await castVote(voteId);
      fetchVoteList();
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  return (
    <div>
      <button onClick={onClose} className={styles.backButton}>
        <IoArrowBack />
      </button>
      <h2>투표 리스트</h2>
      <VoteCreate />
      <input
        type='text'
        placeholder='위치 ID'
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
      />
      <input
        type='datetime-local'
        placeholder='마감 날짜'
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <input
        type='text'
        placeholder='카테고리'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={handleCreateVote}>투표 생성</button>
      <button onClick={handleUpdateVote} disabled={!selectedVoteId}>
        투표 수정
      </button>
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
              <button onClick={() => handleShowVote(vote.voteId)}>보기</button>
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
