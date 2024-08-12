import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exitPlan, showPlanUsers } from "../../service/PlanService";

const PlanFriend = ({onInviteClick}) => {
  const navigate = useNavigate();

  const [planUsers, setplanUsers] = useState([]);

  const { planId } = useParams();

  const nickname = localStorage.getItem("nickname");

  useEffect(() => {
    fetchPlanUsers();
  },[]);

  const fetchPlanUsers = () => {
    showPlanUsers(planId)
      .then((response) => {
        setplanUsers(response.data);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("실패");
      });
  };

  const handleExitPlan = (user) => {
    exitPlan(planId, user.userId)
      .then((response) => {
        console.log(response);
        alert("플랜에서 나갔습니다.");
        navigate("/");
      }).catch((e) => {
        console.log(e);
        alert("플랜 나가기 실패");
      });
  };

  // 사용자들을 status에 따라 분류
  const acceptUsers = planUsers.filter(user => user.status === "ACCEPTED");
  const rejectUsers = planUsers.filter(user => user.status === "REJECTED");
  const pendingUsers = planUsers.filter(user => user.status === "PENDING");

  return (
    <div>
      <div>플랜 참여자 목록</div>
      <h3>참여 중</h3>
      <ul>
        {acceptUsers.map((user) => (
          <li key={user.userId}>
            {user.nickname}
            {user.nickname === nickname && (
              <button onClick={handleExitPlan}>나가기</button>
            )}
          </li>
        ))}
      </ul>
      <h3>요청됨</h3>
      <ul>
        {pendingUsers.map((user) => (
          <li key={user.userId}>
            {user.nickname}
            {/* {user.nickname === nickname && (<button onClick={() => handleCancelInvite(user)}>초대 취소</button>)} */}
          </li>
        ))}
      </ul>
      <h3>거절됨</h3>
      <ul>
        {rejectUsers.map((user) => (
          <li key={user.userId}>
            {user.nickname}
          </li>
        ))}
      </ul>
      <button onClick={onInviteClick}>초대하기</button>
    </div>
  );
};

export default PlanFriend;
