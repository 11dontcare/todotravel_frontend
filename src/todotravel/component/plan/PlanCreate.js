import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPlan } from "../../service/PlanService";

import styles from './Form.module.css';

const PlanCreate = () => {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false); // 상태를 추가하여 스위치의 상태를 관리합니다.
  let planId = null;

  const handleSwitchChange = () => {
    setIsPublic(!isPublic); // 스위치 상태를 반전시킵니다.
    setPlanForm({
      ...planForm,
      isPublic: !isPublic,
    });
  };

  const [planForm, setPlanForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    // front_location: "",
    location: "",
    totalBudget: "",
    isPublic: false,
    status: false,
  });

  const handlePlanFormChange = (e) => {
    const changedField = e.target.name;
    let newValue = e.target.value;

    setPlanForm({
      ...planForm,
      [changedField]: newValue,
    });
  };

  const planCreateSubmit = (e) => {
    e.preventDefault();
    console.log("planCreateSubmit");
    console.log(planForm);
    console.log(localStorage.getItem("nickname"));

    createPlan(planForm)
      .then((response) => {
        alert("플랜이 생성되었습니다.");
        planId = response.data;
        console.log(response);
        console.log(planForm);

        navigate("/plan/" + planId);
      })
      .catch((e) => {
        console.log(e);
        alert("플랜 생성에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div className={styles.container}>
      <div>
        {/* 플랜 생성 */}
        <form onSubmit={planCreateSubmit} className={styles.form}>
          <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <div className={styles.inputFirstLine}>
            <input
              type='text'
              id='title'
              name='title'
              placeholder='제목을 입력해주세요.'
              required
              value={planForm.title}
              onChange={handlePlanFormChange}
              className={styles.inputTitle}
            />
            </div>
            <div className={styles.inputSecondLine}>
            <input
            type='date'
            id='startDate'
            name='startDate'
            placeholder='여행 시작 일자'
            required
            value={planForm.startDate}
            onChange={handlePlanFormChange}
            className={styles.inputDate}
            />
            ~
            <input
            type='date'
            id='endDate'
            name='endDate'
            placeholder='여행 종료 일자'
            required
            value={planForm.endDate}
            onChange={handlePlanFormChange}
            className={styles.inputDate}
            />
            <span></span>
            <input
              type='text'
              id='front_location'
              name='front_location'
              placeholder='행정 구역'
              required
              // value={planForm.front_location}
              // onChange={handlePlanFormChange}
              className={styles.inputFLocation}
            />
            <input
              type='text'
              id='location'
              name='location'
              placeholder='지역 선택'
              required
              value={planForm.location}
              onChange={handlePlanFormChange}
              className={styles.inputLocation}
            />
            </div>
            <div className={styles.inputThirdLine}>
            <input
              type='text'
              id='totalBudget'
              name='totalBudget'
              placeholder='총 예산안 입력'
              required
              value={planForm.totalBudget}
              onChange={handlePlanFormChange}
              className={styles.inputBudget}
            />
            <span className={styles.inputPublish}>
            <label>여행 일정 공유</label>
            <input
              type='checkbox'
              id='isPublic'
              name='isPublic'
              checked={isPublic}
              onChange={handleSwitchChange}
            />
            </span>
            </div>
            </div>
          </div>
          <button type='submit' className={styles.submitButton}>계획 시작하기</button>
        </form>
      </div>
    </div>
  );
};

export default PlanCreate;
