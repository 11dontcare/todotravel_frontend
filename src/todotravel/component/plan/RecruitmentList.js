import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { viewRecruitments } from "../../service/PlanService";

import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { GoPerson } from "react-icons/go";

import styles from "./PlanList.module.css";
import gridStyles from "./TripGrid.module.css";

import defaultThumbnail from "../../../image/thumbnail.png";

const RecruitmentList = () => {
  const navigate = useNavigate();

  const [planList, setplanList] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    viewRecruitments()
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
      <div className={styles.text}>같이 여행해요</div>
      <div className={gridStyles.tripGrid}>
        {planList.length > 0 ? (
          planList.map((plan) => (
            <div
              key={plan.planId}
              className={gridStyles.tripCard}
              onClick={() => handlePlanClick(plan.planId)}
            >
              <img
                src={
                  plan.planThumbnailUrl
                    ? plan.planThumbnailUrl
                    : defaultThumbnail
                }
                alt="travel"
                className={gridStyles.tripImage}
              />
              <p className={gridStyles.location}>{plan.location}</p>
              <h2 className={gridStyles.planTitle}>
                {plan.title}
                {/* <span className={`${styles.planStatus} ${(plan.participantsCount !== plan.planUserCount) ? styles.activeStatus : styles.inactiveStatus}`}>
                    {(plan.participantsCount !== plan.planUserCount) ? "모집중" : "모집마감"}
                </span> */}
            </h2>
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
                  <span className={gridStyles.participants}>
                    <GoPerson className={gridStyles.participant} /> {plan.planUserCount}/{plan.participantsCount}
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

export default RecruitmentList;