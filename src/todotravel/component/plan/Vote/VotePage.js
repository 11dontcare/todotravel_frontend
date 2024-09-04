import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showAllVote } from "../../../service/VoteService";

import styles from "./Vote.module.css";
import { IoArrowBack } from "react-icons/io5";

import VoteCreate from "./VoteCreate.js";
import VoteList from "./VoteList.js";

const VotePage = ({ onClose }) => {
  const { planId } = useParams();
  const [isAddingVote, setIsAddingVote] = useState(false);
  const [voteList, setVoteList] = useState([]);

  useEffect(() => {
    if (planId) {
      fetchVoteList();
    }
  }, [planId]);

  const fetchVoteList = () => {
    if (!planId) return;
    showAllVote(planId)
      .then((response) => {
        setVoteList(response.data.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주세요.");
        setVoteList([]);
      });
  };

  const handleAddVote = () => {
    setIsAddingVote(true);
  };

  const handleVoteAdded = (status) => {
    if (status) {
      fetchVoteList();
      setIsAddingVote(false);
    }
  };

  return (
    <div className={styles.container}>
      <IoArrowBack onClick={onClose} className={styles.back} />
      {isAddingVote ? (
        <VoteCreate onVoteAdded={handleVoteAdded} />
      ) : (
        <>
          <button onClick={handleAddVote} className={styles.voteCreateBtn}>
            투표 추가하기
          </button>
          <h2>함께 논의하기</h2>
          <VoteList voteList={voteList} />
        </>
      )}
    </div>
  );
};

export default VotePage;
