import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createVote } from "../../../service/VoteService.js";
import styles from "./Vote.module.css";
import MapInfo from "../Schedule/MapInfo.js";
import MapSearch from "../Schedule/MapSearch.js";

const categoryOptions = [
  { value: "BREAKFAST", label: "아침 식사" },
  { value: "LUNCH", label: "점심 식사" },
  { value: "DINNER", label: "저녁 식사" },
  { value: "ACTIVITY", label: "활동" },
  { value: "TRANSPORTATION", label: "이동 수단" },
  { value: "ACCOMMODATION", label: "숙소" },
  { value: "BREAK", label: "휴식" },
];

const VoteCreate = ({ onVoteAdded }) => {
  const { planId } = useParams();
  const [location, setLocation] = useState(null);
  const [voteForm, setVoteForm] = useState({
    locationId: null,
    endDate: "",
    category: "",
  });
  const [selectPlace, setSelectPlace] = useState(null);

  const handleLocationSelect = (locationId, place, locationForm) => {
    setLocation(place);
    setSelectPlace(locationForm);
    setVoteForm((prevForm) => ({
      ...prevForm,
      locationId: locationId,
    }));
  };

  const handleVoteFormChange = (e) => {
    const { name, value } = e.target;
    setVoteForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const onClickScheduleSubmit = (e) => {
    e.preventDefault();
    const currentVoteForm = {
      ...voteForm,
      category: voteForm.category,
    };
    createVote(currentVoteForm, planId)
      .then(() => {
        alert("투표가 생성되었습니다.");
        onVoteAdded(true);
      })
      .catch((e) => {
        console.error(e);
        alert("일정 생성에 실패했습니다. 다시 시도해주세요.");
        console.log(currentVoteForm);
      });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setLocation(null);
  };

  return (
    <>
      {!location ? (
        <div className={styles.mapContainer}>
          <MapSearch onLocationSelect={handleLocationSelect} />
        </div>
      ) : (
        <div className={styles.createContainer}>
          <div className={styles.map}>
            <MapInfo location={selectPlace} />
          </div>

          <form className={styles.createBox} onSubmit={onClickScheduleSubmit}>
            <div className={styles.createAddress}>
              <h3>{location.name}</h3>
              <p>{location.address}</p>
            </div>
            <div className={styles.createTime}>
              <label htmlFor='endDate'>투표 마감 시간 : </label>
              <input
                className={styles.timeInput}
                id='endDate'
                name='endDate'
                type='datetime-local'
                value={voteForm.endDate}
                onChange={handleVoteFormChange}
                required
                placeholder='시간 입력'
                min={getCurrentDateTime()}
              />
            </div>
            <div className={styles.createDescription}>
              <label htmlFor='category'>카테고리 : </label>
              <select
                name='category'
                value={voteForm.category}
                onChange={handleVoteFormChange}
              >
                <option value=''>카테고리 선택</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.createButton}>
              <button className={styles.submitButton} type='submit'>
                등록
              </button>
              <button
                className={styles.cancelButton}
                type='button'
                onClick={handleCancel}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default VoteCreate;
