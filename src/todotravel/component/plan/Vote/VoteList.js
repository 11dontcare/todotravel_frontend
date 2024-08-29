// VoteListModal.jsx
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { showAllVote } from "../../../service/VoteService";

const VoteListModal = ({ show, onClose }) => {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (show) {
      // 투표 리스트를 서버에서 가져옴
      showAllVote()
        .then((data) => {
          setVotes(data);
        })
        .catch((error) => {
          console.error("투표 리스트를 불러오는데 실패했습니다.", error);
        });
    }
  }, [show]);

  return (
    <Modal show={show} onClose={onClose}>
      <div>
        <h2>투표 리스트</h2>
        <ul>
          {votes.map((vote) => (
            <li key={vote.id}>{vote.title}</li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default VoteListModal;
