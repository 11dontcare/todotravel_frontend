import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getPlan, modifyPlan } from "../../service/PlanService";
import { Provinces, Citys } from "./PlanData";

import styles from "./Form.module.css";
import DescriptionInput from "./DescriptionInput";

const PlanModify = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailName, setThumbnailName] = useState("");
  const [currentThumbnailName, setCurrentThumbnailName] = useState("");
  const [availableCitys, setAvailableCitys] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

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
    fetchPlan();
  }, []);

  useEffect(() => {
    if (planForm.frontLocation) {
      const selectedProvince = Citys.find(
        (item) => item.province === planForm.frontLocation
      );
      setAvailableCitys(selectedProvince ? selectedProvince.citys : []);
    }
  }, [planForm.frontLocation]);

  useEffect(() => {
    if (
      planForm.startDate &&
      planForm.endDate &&
      planForm.startDate > planForm.endDate
    ) {
      setPlanForm((prev) => ({ ...prev, endDate: planForm.startDate }));
    }
  }, [planForm.startDate, planForm.endDate]);

  const fetchPlan = () => {
    getPlan(planId)
      .then((response) => {
        const {
          title,
          startDate,
          endDate,
          frontLocation,
          location,
          description,
          totalBudget,
          isPublic,
          status,
          planThumbnailUrl,
        } = response.data;
        setPlanForm({
          title,
          startDate,
          endDate,
          frontLocation,
          location,
          description,
          totalBudget,
          isPublic,
          status,
        });
        setIsPublic(isPublic);
        if (planThumbnailUrl) {
          const FIXED_URL_LENGTH = 88;
          const thumbnailName = planThumbnailUrl.substring(FIXED_URL_LENGTH);
          setCurrentThumbnailName(thumbnailName);
        }
      })
      .catch((e) => {
        console.log(e);
        alert("플랜을 불러올 수 없습니다. 다시 시도해주세요.");
      });
  };

  const handleSwitchChange = () => {
    setIsPublic(!isPublic);
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

  const toggleEditMode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditable(!isEditable);
  };

  const planModifySubmit = (e) => {
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

    modifyPlan(formData, planId)
      .then(() => {
        alert("플랜이 수정되었습니다.");
        setIsEditable(false);
        navigate("/plan/" + planId);
      })
      .catch((e) => {
        console.log(e);
        alert("플랜 수정에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div className={styles.container}>
      <div>
        <form onSubmit={planModifySubmit} className={styles.form}>
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
                disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  min={planForm.startDate}
                  disabled={!isEditable}
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
                disabled={!isEditable}
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
                disabled={!isEditable || !planForm.frontLocation}
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
                disabled={!isEditable}
              />
            </div>
            <div className={styles.row}>
              <DescriptionInput
                value={planForm.description}
                onChange={handlePlanFormChange}
                isEditable={isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
                />
                <label htmlFor='thumbnail' className={styles.fileInputLabel}>
                  파일 선택
                </label>
                {(thumbnailName || currentThumbnailName) && (
                  <span className={styles.fileName}>
                    {thumbnailName || currentThumbnailName}
                  </span>
                )}
              </div>
            </div>
          </div>
          {isEditable ? (
            <button type='submit' className={styles.submitButton}>
              수정 완료
            </button>
          ) : (
            <button
              type='button'
              onClick={toggleEditMode}
              className={styles.submitButton}
            >
              수정 시작
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PlanModify;
