import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getPlan, modifyPlan } from "../../service/PlanService";

const PlanModify = () => {
  const { planId } = useParams();
  console.log(planId);
  const navigate = useNavigate();
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
    startDate: "",
    endDate: "",
    // front_location: "",
    location: "",
    totalBudget: "",
    isPublic: false,
    status: false,
  });

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = () => {
    getPlan(planId)
      .then((response) => {
        const {title, startDate, endDate, location, totalBudget, isPublic, status} = response.data;
        setPlanForm({
          title,
          startDate,
          endDate,
          location,
          totalBudget,
          isPublic,
          status,
        });
        setIsPublic(isPublic);
        console.log(response);
        console.log(title);
      })
      .catch((e) => {
        console.log(e);
        alert("실패");
      });
  };

  const handlePlanFormChange = (e) => {
    const changedField = e.target.name;
    let newValue = e.target.value;

    setPlanForm({
      ...planForm,
      [changedField]: newValue,
    });
  };

  const planModifySubmit = (e) => {
    e.preventDefault();
    console.log("planModifySubmit");
    console.log(planForm);
    console.log(localStorage.getItem("nickname"));

    modifyPlan(planForm, planId)
      .then((response) => {
        alert("플랜 수정 완료");
        navigate("/plan/" + planId);
        console.log(response);
        console.log(planForm);
      })
      .catch((e) => {
        console.log(e);
        alert("플랜 수정 실패");
      });
  };

  return (
    <div>
      <div>
        플랜 수정
        <form onSubmit={planModifySubmit}>
          <div>
            <input
              type='text'
              id='title'
              name='title'
              required
              value={planForm.title}
              onChange={handlePlanFormChange}
            />
            <input
            type='date'
            id='startDate'
            name='startDate'
            required
            value={planForm.startDate}
            onChange={handlePlanFormChange}
          />
          <input
            type='date'
            id='endDate'
            name='endDate'
            required
            value={planForm.endDate}
            onChange={handlePlanFormChange}/>
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
              required
              value={planForm.location}
              onChange={handlePlanFormChange}
            />
            <input
              type='text'
              id='totalBudget'
              name='totalBudget'
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
          <button type='submit'>계획 수정하기</button>
        </form>
      </div>
    </div>
  );
};

export default PlanModify;
