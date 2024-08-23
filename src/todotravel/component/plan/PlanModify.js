import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getPlan, modifyPlan } from "../../service/PlanService";

import styles from './Form.module.css';

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

  const [isEditable, setIsEditable] = useState(false); // 수정 가능 여부 상태

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
        alert("플랜을 불러올 수 없습니다. 다시 시도해주세요.");
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

  const toggleEditMode = (e) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 차단
    setIsEditable(!isEditable); // 수정 가능/불가능 상태 전환
  };


  const planModifySubmit = (e) => {
    e.preventDefault();
    console.log("planModifySubmit");
    console.log(planForm);
    console.log(localStorage.getItem("nickname"));

    modifyPlan(planForm, planId)
      .then((response) => {
        alert("플랜이 수정되었습니다.");
        // navigate("/plan/" + planId);
        console.log(response);
        console.log(planForm);
        toggleEditMode(e); // 수정 완료 후 수정 불가능 상태로 전환
      })
      .catch((e) => {
        console.log(e);
        alert("플랜 수정에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div className={styles.container}>
      <div>
        {/* 플랜 수정 */}
        <form onSubmit={planModifySubmit} className={styles.form}>
          <div className={styles.inputContainer}>
            <div className={styles.inputGroup}>
              <div className={styles.inputFirstLine}>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={planForm.title}
                  onChange={handlePlanFormChange}
                  className={styles.inputTitle}
                  disabled={!isEditable} // 수정 가능 상태에 따라 비활성화
                />
              </div>
              <div className={styles.inputSecondLine}>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={planForm.startDate}
                  onChange={handlePlanFormChange}
                  className={styles.inputDate}
                  disabled={!isEditable} // 수정 가능 상태에 따라 비활성화
                />
                ~
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  required
                  value={planForm.endDate}
                  onChange={handlePlanFormChange}
                  className={styles.inputDate}
                  disabled={!isEditable} // 수정 가능 상태에 따라 비활성화
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
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={planForm.location}
                  onChange={handlePlanFormChange}
                  className={styles.inputLocation}
                  disabled={!isEditable} // 수정 가능 상태에 따라 비활성화
                />
              </div>
              <div className={styles.inputThirdLine}>
                <input
                  type="text"
                  id="totalBudget"
                  name="totalBudget"
                  required
                  value={planForm.totalBudget}
                  onChange={handlePlanFormChange}
                  className={styles.inputBudget}
                  disabled={!isEditable} // 수정 가능 상태에 따라 비활성화
                />
                <span className={styles.inputPublish}>
                  <label>여행 일정 공유</label>
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={planForm.isPublic}
                    onChange={handleSwitchChange}
                    disabled={!isEditable} // 수정 가능 상태에 따라 비활성화
                  />
                </span><span style={{paddingLeft: "470px",}}>
                {isEditable ? (
                  <button type="submit" className={styles.submitModify}>
                    수정 완료
                  </button>
                ) : (
                  <button type="button" onClick={toggleEditMode} className={styles.submitModify}>
                    수정 시작
                  </button>
                )}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModify;
