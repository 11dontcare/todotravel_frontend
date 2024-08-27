import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { viewPlanList } from "../../service/PlanService";

import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

import styles from "./PlanList.module.css";
import gridStyles from "./TripGrid.module.css";

import travel from "../../../image/travel.png";

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

  const handlePlanClick = (planId) => {
    navigate(`/plan/${planId}/details`);
  };

  return (
    <div>
      <div className={styles.text}>일정 공유해요</div>
      <div className={gridStyles.tripGrid}>
        {planList.length > 0 ? (
          planList.map((plan) => (
            <div
              key={plan.planId}
              className={gridStyles.tripCard}
              onClick={() => handlePlanClick(plan.planId)}
            >
              <img src={travel} alt="travel" className={gridStyles.tripImage} />
              <p className={gridStyles.location}>{plan.location}</p>
              <h2 className={gridStyles.planTitle}>{plan.title}</h2>
              <p className={gridStyles.description}>{plan.description}</p>
              <p className={gridStyles.dates}>
                {plan.startDate} ~ {plan.endDate}
              </p>
              <div className={gridStyles.tripFooter}>
                <div className={gridStyles.tripStats}>
                  <span className={gridStyles.bookmarks}>
                    <FaRegBookmark /> {plan.bookmarkNumber}
                  </span>
                  <span className={gridStyles.likes}>
                    <FaRegHeart /> {plan.likeNumber}
                  </span>
                </div>
                <span className={gridStyles.planUserNickname}>
                  {plan.planUserNickname}님의 여행 일정
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className={gridStyles.emptyMessage}>No plans available.</p>
        )}
      </div>
    </div>
  );
};

export default PlanList;
