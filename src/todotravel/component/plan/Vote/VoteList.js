import React, { useState, useEffect } from "react";
import styles from "./Vote.module.css";
import VoteItem from "./VoteItem";

const VoteList = ({ voteList }) => {
  const [votes, setVotes] = useState(voteList);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    setVotes(voteList);
  }, [voteList]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleEdit = (updatedItem) => {
    setVotes((prevVotes) =>
      prevVotes.map((item) =>
        item.voteId === updatedItem.voteId ? { ...item, ...updatedItem } : item
      )
    );
  };

  const handleDelete = (deletedVoteId) => {
    setVotes((prevVotes) =>
      prevVotes.filter((vote) => vote.voteId !== deletedVoteId)
    );
  };

  const filteredVotes =
    selectedCategory === "ALL"
      ? votes
      : votes.filter((vote) => vote.category === selectedCategory);

  return (
    <div className={styles.voteList}>
      <div className={styles.listHeader}>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={styles.categorySelect}
        >
          <option value='ALL'>전체</option>
          <option value='BREAKFAST'>아침 식사</option>
          <option value='LUNCH'>점심 식사</option>
          <option value='DINNER'>저녁 식사</option>
          <option value='ACTIVITY'>주요 활동</option>
          <option value='TRANSPORTATION'>이동 수단</option>
          <option value='ACCOMMODATION'>숙소</option>
          <option value='BREAK'>휴식</option>
        </select>
      </div>
      <div className={styles.voteListContent}>
        <div className={styles.voteItem}>
          {filteredVotes.length > 0 ? (
            filteredVotes.map((item) => (
              <VoteItem
                key={item.scheduleId}
                voteId={item.voteId}
                locationId={item.locationId}
                category={item.category}
                startDate={item.startDate}
                endDate={item.endDate}
                voteCount={item.voteCount}
                vehicle={item.vehicle}
                onEdit={(updatedData) =>
                  handleEdit({ voteId: item.voteId, ...updatedData })
                }
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div>해당 카테고리에 투표가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoteList;
