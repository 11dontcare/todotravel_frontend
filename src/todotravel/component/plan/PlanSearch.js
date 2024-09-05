import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { searchPlan } from "../../service/PlanService";

import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

import styles from "./PlanSearch.module.css";
import gridStyles from "./TripGrid.module.css";

import defaultThumbnail from "../../../image/thumbnail.png";

const PlanSearch = () => {
  const navigate = useNavigate();

  const { keyword } = useParams();

  const [planList, setplanList] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, [keyword]);

  const fetchPlans = () => {
    searchPlan(keyword)
      .then((response) => {
        setplanList(response.data);
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
      <div className={styles.text}>" {keyword} " 검색 결과</div>
      <div className={gridStyles.tripGrid}>
        {planList.length > 0 ? (
          planList.map((plan) => (
            <div
              key={plan.planId}
              className={gridStyles.tripCard}
              onClick={() => handlePlanClick(plan.planId)}
            >
              <img
                src={plan.planThumbnailUrl || defaultThumbnail}
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
      </div>
    </div>
  );
};

export default PlanSearch;
