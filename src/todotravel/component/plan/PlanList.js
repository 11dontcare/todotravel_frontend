import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { viewPlanList } from "../../service/PlanService";

import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

import styles from "./PlanList.module.css";

import main from "../../../image/main.png";
import defaultThumbnail from "../../../image/thumbnail.png";

const PlanList = () => {
  const navigate = useNavigate();

  const [planList, setplanList] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    viewPlanList()
      .then((response) => {
        setplanList(response.data);
        console.log(response);
        console.log(planList);
      })
      .catch((e) => {
        console.log(e);
        alert("목록을 불러올 수 없습니다.");
      });
  };

  const handlePlanClick = (e) => {
    navigate("/plan/" + e.target.id + "/details");
  };

  return (
    <div>
      <img src={main} alt="홈화면" className={styles.homeImg} />
      <div className={styles.text}>일정 공유해요</div>
      <div className={styles.planListContainer}>
        {planList.length > 0 ? (
          planList.map((plan) => (
            <div key={plan.planId} className={styles.planItem}>
              <img
                src={plan.planThumbnailUrl || defaultThumbnail}
                alt="thumbnail"
                className={styles.travelImg}
              />
              <p className={styles.location}>{plan.location}</p>
              <h2
                id={plan.planId}
                onClick={handlePlanClick}
                className={styles.planTitle}
              >
                {plan.title}
              </h2>
              <p className={styles.description}>{plan.description}</p>
              <p className={styles.dates}>
                {plan.startDate} ~ {plan.endDate}
              </p>
              <div>
                <span>
                  <FaRegBookmark className={styles.bookmarks} />{" "}
                  {plan.bookmarkNumber} <FaRegHeart className={styles.likes} />{" "}
                  {plan.likeNumber}
                </span>
                <p className={styles.planUserNickname}>
                  {plan.planUserNickname}님의 여행 일정
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noPlans}>No plans available.</p>
        )}
      </div>
    </div>
  );
};

export default PlanList;
