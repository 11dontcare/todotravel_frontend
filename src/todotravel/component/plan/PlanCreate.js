import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPlan } from "../../service/PlanService";
import { Provinces, Citys } from "./PlanData";
import DescriptionInput from "./DescriptionInput.js";

import styles from "./Form.module.css";

const PlanCreate = () => {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false); // 상태를 추가하여 스위치의 상태를 관리합니다.
  const [thumbnail, setThumbnail] = useState(null);
  const [availableCitys, setAvailableCitys] = useState([]);
  const [thumbnailName, setThumbnailName] = useState("");

  const [planForm, setPlanForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    frontLocation: "",
    location: "",
    description: "",
    totalBudget: "",
    isPublic: false,
    status: false,
  });

  useEffect(() => {
    if (planForm.frontLocation) {
      const selectedProvince = Citys.find(
        (item) => item.province === planForm.frontLocation
      );
      setAvailableCitys(selectedProvince ? selectedProvince.citys : []);
      setPlanForm((prev) => ({ ...prev, location: "" }));
    }
  }, [planForm.frontLocation]);

  useEffect(() => {
    // 시작 일자가 변경될 때 종료 일자 조정
    if (
      planForm.startDate &&
      planForm.endDate &&
      planForm.startDate > planForm.endDate
    ) {
      setPlanForm((prev) => ({ ...prev, endDate: planForm.startDate }));
    }
  }, [planForm.startDate, planForm.endDate]);

  const handleSwitchChange = () => {
    setIsPublic(!isPublic); // 스위치 상태를 반전시킵니다.
    setPlanForm({
      ...planForm,
      isPublic: !isPublic,
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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailName(file.name);
    } else {
      setThumbnail(null);
      setThumbnailName("");
    }
  };

  const planCreateSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "planRequestDto",
      new Blob([JSON.stringify(planForm)], { type: "application/json" })
    );

    if (thumbnail) {
      formData.append("planThumbnail", thumbnail);
    } else {
      formData.append("planThumbnail", new Blob([]), "");
    }

    createPlan(formData)
      .then((response) => {
        alert("플랜이 생성되었습니다.");
        navigate("/plan/" + response.data);
      })
      .catch((e) => {
        console.error("Plan creation failed:", e);
        alert("플랜 생성에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={planCreateSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <div className={styles.row}>
            <input
              type='text'
              id='title'
              name='title'
              placeholder='제목을 입력해주세요'
              required
              value={planForm.title}
              onChange={handlePlanFormChange}
              className={styles.inputTitle}
            />
            <div className={styles.dateInputWrapper}>
              <input
                type='date'
                id='startDate'
                name='startDate'
                required
                value={planForm.startDate}
                onChange={handlePlanFormChange}
                className={styles.inputDate}
              />
              <label htmlFor='startDate' className={styles.dateLabel}>
                여행 시작 일자
              </label>
            </div>
            <div className={styles.dateInputWrapper}>
              <input
                type='date'
                id='endDate'
                name='endDate'
                required
                value={planForm.endDate}
                onChange={handlePlanFormChange}
                className={styles.inputDate}
                min={planForm.startDate} // 시작 일자 이후로만 선택 가능
              />
              <label htmlFor='endDate' className={styles.dateLabel}>
                여행 종료 일자
              </label>
            </div>
          </div>
          <div className={styles.row}>
            <select
              id='frontLocation'
              name='frontLocation'
              required
              value={planForm.frontLocation}
              onChange={handlePlanFormChange}
              className={styles.inputSelect}
            >
              <option value=''>행정 구역 선택</option>
              {Provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            <select
              id='location'
              name='location'
              required
              value={planForm.location}
              onChange={handlePlanFormChange}
              className={styles.inputSelect}
              disabled={!planForm.frontLocation}
            >
              <option value=''>지역 선택</option>
              {availableCitys.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <input
              type='number'
              id='totalBudget'
              name='totalBudget'
              placeholder='총 예산안 입력'
              required
              value={planForm.totalBudget}
              onChange={handlePlanFormChange}
              className={styles.inputBudget}
            />
          </div>
          <div className={styles.row}>
            <DescriptionInput
              value={planForm.description}
              onChange={handlePlanFormChange}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.inputPublish}>
              <label htmlFor='isPublic'>여행 일정 공유하기</label>
              <input
                type='checkbox'
                id='isPublic'
                name='isPublic'
                checked={isPublic}
                onChange={handleSwitchChange}
              />
            </div>
            <div className={styles.divider}></div>
            <div className={styles.inputThumbnail}>
              <label htmlFor='thumbnail'>썸네일 이미지 업로드</label>
              <input
                type='file'
                id='thumbnail'
                accept='image/*'
                onChange={handleThumbnailChange}
                className={styles.fileInput}
              />
              <label htmlFor='thumbnail' className={styles.fileInputLabel}>
                파일 선택
              </label>
              {thumbnailName && (
                <span className={styles.fileName}>{thumbnailName}</span>
              )}
            </div>
          </div>
        </div>
        <button type='submit' className={styles.submitButton}>
          계획 시작하기
        </button>
      </form>
    </div>
  );
};

export default PlanCreate;
