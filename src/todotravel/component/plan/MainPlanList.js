import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { viewPlanList } from "../../service/PlanService";

import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

import styles from "./MainPlanList.module.css";
import gridStyles from "./TripGrid.module.css";
import ScrollContainer from "react-indiana-drag-scroll";

import defaultThumbnail from "../../../image/thumbnail.png";

const MainPlanList = () => {
  const navigate = useNavigate();
  const [planList, setplanList] = useState([]);
  // const planListRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  // const [startX, setStartX] = useState(0);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    viewPlanList()
      .then((response) => {
        setplanList(response.data);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("목록을 불러올 수 없습니다.");
      });
  };

  const handlePlanClick = (planId) => {
    if (!isDragging) {
      navigate(`/plan/${planId}/details`);
    }
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <div className={styles.text}>일정 공유해요</div>
      <ScrollContainer
        className={styles.planListContainer}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
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
      </ScrollContainer>
    </div>
  );
};

export default MainPlanList;
