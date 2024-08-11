import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPlan } from "../../service/PlanService";

const PlanCreate = () => {
  // const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false); // 상태를 추가하여 스위치의 상태를 관리합니다.

  const handleSwitchChange = () => {
    setIsPublic(!isPublic); // 스위치 상태를 반전시킵니다.
    setPlanForm({
      ...planForm,
      isPublic: !isPublic,
    });
  };

  const [planForm, setPlanForm] = useState({
    title: "",
    startDate: "2021-11-08T11:44:30",
    endDate: "2021-11-08T11:44:30",
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
    // console.log(localStorage.getItem("userId"));
    createPlan(planForm)
      .then((response) => {
        alert("플랜 생성 완료");
        // const planId = response.planId
        // navigate("/plan/1");
        console.log(response);
        console.log(planForm);
      })
      .catch((e) => {
        console.log(e);
        alert("플랜 생성 실패");
      });
  };

  return (
    <div>
      <div>
        하이하이
        <form onSubmit={planCreateSubmit}>
          <div>
            <input
              type='text'
              id='title'
              name='title'
              placeholder='제목을 입력해주세요.'
              required
              value={planForm.title}
              onChange={handlePlanFormChange}
            />
            {/* <input
            type='date'
            id='startDate'
            name='startDate'
            placeholder='여행 시작 일자'
            required
            value={planForm.startDate}
            onChange={handlePlanFormChange}
          />
          <input
            type='date'
            id='endDate'
            name='endDate'
            placeholder='여행 종료 일자'
            required
            value={planForm.endDate}
            onChange={handlePlanFormChange}/> */}
            <input
              type='text'
              id='front_location'
              name='front_location'
              placeholder='행정 구역'
              required
              // value={planForm.front_location}
              // onChange={handlePlanFormChange}
            />
            <input
              type='text'
              id='location'
              name='location'
              placeholder='지역 선택'
              required
              value={planForm.location}
              onChange={handlePlanFormChange}
            />
            <input
              type='text'
              id='totalBudget'
              name='totalBudget'
              placeholder='총 예산안 입력'
              required
              value={planForm.totalBudget}
              onChange={handlePlanFormChange}
            />
          </div>
          <div>
            <label>여행 일정 공유</label>
            <input
              type='checkbox'
              id='isPublic'
              name='isPublic'
              checked={isPublic}
              onChange={handleSwitchChange}
            />
          </div>
          <button type='submit'>계획 시작하기</button>
        </form>
      </div>
    </div>
  );
};

export default PlanCreate;
