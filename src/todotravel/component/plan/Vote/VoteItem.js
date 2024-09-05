import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateVote, deleteVote, castVote } from "../../../service/VoteService";
import { showLocation } from "../../../service/ScheduleService";
import moment from "moment";
import "moment/locale/ko";
import styles from "./Vote.module.css";
import ItemMapInfo from "../Schedule/ItemMapInfo";

const categoryOptions = [
  { value: "BREAKFAST", label: "아침 식사" },
  { value: "LUNCH", label: "점심 식사" },
  { value: "DINNER", label: "저녁 식사" },
  { value: "ACTIVITY", label: "활동" },
  { value: "TRANSPORTATION", label: "이동 수단" },
  { value: "ACCOMMODATION", label: "숙소" },
  { value: "BREAK", label: "휴식" },
];

const VoteItem = ({
  voteId,
  locationId,
  category,
  startDate,
  endDate,
  voteCount,
  onEdit,
  onDelete,
}) => {
  const { planId } = useParams();
  const [place, setPlace] = useState({
    longitude: "",
    latitude: "",
    name: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editVoteForm, setEditVoteForm] = useState({
    category: category || "",
    endDate: endDate || "",
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    showLocation(locationId)
      .then((response) => {
        setPlace(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedVoteForm = {
      category: editVoteForm.category || category,
      endDate: editVoteForm.endDate || endDate,
    };

    updateVote(updatedVoteForm, planId, voteId)
      .then(() => {
        setIsEditing(false);
        onEdit(updatedVoteForm);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      deleteVote(planId, voteId)
        .then(() => {
          if (onDelete) onDelete(voteId);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const handleVote = () => {
    castVote(voteId)
      .then(() => {
        alert("투표가 완료되었습니다.");
      })
      .catch((e) => {
        console.error(e);
        alert("투표에 실패했습니다. 다시 시도해 주세요.");
      });
  };

  const handleEditClick = () => {
    setEditVoteForm({
      category: category,
      endDate: moment(endDate).format("YYYY-MM-DDTHH:mm"),
    });
    setIsEditing(true);
  };

  const categoryLabel =
    categoryOptions.find((option) => option.value === category)?.label ||
    category;

  return (
    <div className={styles.item}>
      <ItemMapInfo
        latitude={place.latitude}
        longitude={place.longitude}
        mapId={voteId}
      />

      {isEditing ? (
        <div className={styles.itemEditContainer}>
          <div className={styles.itemEditBox}>
            <select
              name='category'
              value={editVoteForm.category}
              className={styles.itemCategory}
              onChange={(e) =>
                setEditVoteForm({ ...editVoteForm, category: e.target.value })
              }
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <p className={styles.itemVoteTime}>투표 마감 : </p>
            <input
              type='datetime-local'
              name='endDate'
              value={editVoteForm.endDate}
              onChange={(e) =>
                setEditVoteForm({ ...editVoteForm, endDate: e.target.value })
              }
              min={getCurrentDateTime()}
            />
          </div>
          <div className={styles.itemBtn}>
            <button onClick={handleSave} className={styles.submitButton}>
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className={styles.itemCategory}>{categoryLabel}</p>
          <p className={styles.itemVoteTime}>
            투표 마감 : <span>{moment(endDate).format("MM/DD A HH:mm")}</span>
          </p>
          <p className={styles.itemVoteTime}>
            투표수 : <span>{voteCount}</span>
          </p>
          <div className={styles.itemBtn}>
            <button onClick={handleEditClick} className={styles.submitButton}>
              수정
            </button>
            <button onClick={handleVote} className={styles.submitButton}>
              투표하기
            </button>
            <button onClick={handleDelete} className={styles.cancelButton}>
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VoteItem;
