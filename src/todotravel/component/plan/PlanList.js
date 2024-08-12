import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { viewPlanList } from "../../service/PlanService";

import main from "../../../image/main.png";

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
      <img src={main} alt='홈화면' />
      <div>일정 공유하기</div>
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
      <div>
        {planList.length > 0 ? (
          planList.map((plan) => (
            <div key={plan.planId}>
            {/* style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }} */}
              <p>{plan.location}</p>
              <h2 id={plan.planId} onClick={handlePlanClick}>{plan.title}</h2>
              <p>{plan.description}</p>
              <p>
                {plan.startDate} ~ {plan.endDate}
              </p>
              <p>Bookmarks: {plan.bookmarkNumber}</p>
              <p>Likes: {plan.likeNumber}</p>
              <p>{plan.planUserNickname}</p>
            </div>
          ))
        ) : (
          <p>No plans available.</p>
        )}
      </div>
    </div>
  );
};

export default PlanList;
