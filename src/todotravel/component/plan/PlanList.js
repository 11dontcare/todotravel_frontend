import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { viewPlanList } from "../../service/PlanService";

import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

import styles from './PlanList.module.css';

import main from "../../../image/main.png";
import travel from "../../../image/travel.png";

const PlanList = () => {
  const navigate = useNavigate();

  const [planList, setplanList] = useState([]);

  useEffect(() => {
    fetchPlans();
  },[]);

  const fetchPlans = () => {
    viewPlanList()
      .then((response) => {
        setplanList(response.data);
        console.log(response);
        console.log(planList);
      })
      .catch((e) => {
        console.log(e);
        alert("실패");
      });
  };

  const handlePlanClick = (e) => {
    navigate("/plan/" + e.target.id + "/details");
  }

  return (
    <div>
      <img src={main} alt='홈화면' className={styles.homeImg}/>
      <div className={styles.text}>일정 공유해요</div>
      {/* <table>
        <thead>
          <tr>
            <th>title</th>
            <th>location</th>
            <th>description</th>
            <th>bookmarkNumber</th>
            <th>likeNumber</th>
          </tr>
        </thead>
        <tbody>
          {planList.map((plan) => (
            <tr key={plan.planId} id={plan.planId}>
              <td id={plan.planId}>{plan.location}</td>
              <td id={plan.planId}>{plan.title}</td>
              <td id={plan.planId}>{plan.description}</td>
              <td id={plan.planId}>{plan.bookmarkNumber}</td>
              <td id={plan.planId}>{plan.likeNuber}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <div className={styles.planListContainer}>
        {planList.length > 0 ? (
          planList.map((plan) => (
            <div key={plan.planId} className={styles.planItem}>
              <img src={travel} alt='travel' className={styles.travelImg}/>
              <p className={styles.location}>{plan.location}</p>
              <h2 id={plan.planId} onClick={handlePlanClick} className={styles.planTitle}>{plan.title}</h2>
              <p className={styles.description}>{plan.description}</p>
              <p className={styles.dates}>
                {plan.startDate} ~ {plan.endDate}
              </p>
              <div>
                <FaRegBookmark className={styles.bookmarks} /> {plan.bookmarkNumber} <FaRegHeart className={styles.likes} /> {plan.likeNumber}
              <p className={styles.planUserNickname}>{plan.planUserNickname}님의 여행 일정</p>
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
