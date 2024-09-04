import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { inviteUser, showUsers } from "../../service/PlanService";

import styles from "./InvitePlanUser.module.css";

import profileImage from "../../../image/user_profile_icon.png";

import { IoArrowBack } from "react-icons/io5";

const InvitePlanUser = ({ onBackClick }) => {
  const [load, setLoad] = useState(false);
  const { planId } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [load]);

  const fetchUsers = () => {
    showUsers(planId)
      .then((response) => {
        setUsers(response.data);
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
        alert(`${user.nickname}님을 초대했습니다.`);
        setLoad(!load);
      })
      .catch((e) => {
        console.log(e);
        alert("초대에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div>
      <div className={styles.title}>
        <button onClick={onBackClick} className={styles.backButton}>
          <IoArrowBack />
        </button>
        <span style={{ marginLeft: "90px" }}>팔로워 목록</span>
      </div>
      <div className={styles.listContainer}>
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.userId} className={styles.userItem}>
              <span className={styles.userInfo}>
                {/* <img src={profileImage} alt="Profile" className={styles.profileImage} /> */}
                <img
                  src={user.profileImageUrl || profileImage}
                  alt='Profile'
                  className={styles.profileImage}
                />
                <span className={styles.userNickname}>{user.nickname}</span>
              </span>
              <button
                onClick={() => handleInviteClick(user)}
                className={styles.inviteButton}
              >
                초대하기
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvitePlanUser;
