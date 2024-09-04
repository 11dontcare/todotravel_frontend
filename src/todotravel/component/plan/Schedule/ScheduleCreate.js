import React, { useState } from "react";
import { createSchedule } from "../../../service/ScheduleService";

import styles from "./Schedule.module.css";
import { useParams } from "react-router-dom";
import MapInfo from "./MapInfo";
import MapSearch from "./MapSearch";

const ScheduleCreate = ({ onScheduleAdded }) => {
  const { planId } = useParams();
  const [location, setLocation] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    locationId: null,
    travelDayCount: "",
    description: "",
    travelTime: "",
  });
  const [selectPlace, setSelectPlace] = useState(null);

  const handleLocationSelect = (locationId, place, locationForm) => {
    setLocation(place);
    setSelectPlace(locationForm);
    setScheduleForm({
      ...scheduleForm,
      locationId: locationId,
    });
  };

  const handleScheduleFormChange = (e) => {
    const changedField = e.target.name;
    const newValue = e.target.value;

    setScheduleForm({
      ...scheduleForm,
      [changedField]: newValue,
    });
  };

  const onClickScheduleSubmit = (e) => {
    e.preventDefault();
    createSchedule(planId, scheduleForm)
      .then((response) => {
        alert("일정이 생성되었습니다.");
        onScheduleAdded(true);
      })
      .catch((e) => {
        console.error(e);
        alert("일정 생성에 실패했습니다. 다시 시도해주세요.");
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
            <div className={styles.createHeader}>
              <div className={styles.createAddress}>
                <h3>{location.name}</h3>
                <p>{location.address}</p>
              </div>
              <input
                className={styles.dayInput}
                id='travelDayCount'
                name='travelDayCount'
                type='number'
                value={scheduleForm.travelDayCount}
                onChange={handleScheduleFormChange}
                required
                placeholder='day 입력'
              />
            </div>
            <div className={styles.createTime}>
              <label htmlFor='travelTime'>도착 예정 시간 : </label>
              <input
                className={styles.timeInput}
                id='travelTime'
                name='travelTime'
                type='time'
                value={scheduleForm.travelTime}
                onChange={handleScheduleFormChange}
                required
                placeholder='시간 입력'
              />
            </div>
            <div className={styles.createDescription}>
              <label htmlFor='description'>메모(선택) : </label>
              <textarea
                className={styles.descriptionInput}
                id='description'
                name='description'
                type='text'
                value={scheduleForm.description}
                onChange={handleScheduleFormChange}
                placeholder='메모를 입력해주세요.'
              />
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

export default ScheduleCreate;
