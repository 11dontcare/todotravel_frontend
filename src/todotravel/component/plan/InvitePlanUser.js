import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { inviteUser, showUsers } from "../../service/PlanService";

const InvitePlanUser = ({ onBackClick }) => {
    const { planId } = useParams();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
      },[]);

  const fetchUsers = () => {
    showUsers(planId)
      .then((response) => {
        setUsers(response.data);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("목록을 불러올 수 없습니다. 다시 시도해주세요.");
      });
  };

  const handleInviteClick = (user) => {
    // API 호출 등을 통해 사용자를 친구로 추가하는 로직 구현
    inviteUser(planId, user.userId)
        .then((response) => {
            console.log(response);
            alert(`${user.nickname}님을 초대했습니다.`);
        }).catch((e) => {
            console.log(e);
            alert("초대에 실패했습니다. 다시 시도해주세요.");
      });
    if (onBackClick) {
        onBackClick();
    }
  };
  return (
    <div>
      <h2>사용자 추가</h2>
      <ul>
        {users.map((user) => (
          <li key={user.userId}>
            {user.nickname}
            <button onClick={() => handleInviteClick(user)}>초대하기</button>
          </li>
        ))}
      </ul>
      <button onClick={onBackClick}>취소</button>
    </div>
  );
};

export default InvitePlanUser;