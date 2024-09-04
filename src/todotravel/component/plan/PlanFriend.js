import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  exitPlan,
  isInvitablePlanByUser,
  showPlanUsers,
} from "../../service/PlanService";

import styles from "./PlanFriend.module.css";

import profileImage from "../../../image/user_profile_icon.png";

import { GoPerson } from "react-icons/go";
import { GoPersonAdd } from "react-icons/go";
import { RxExit } from "react-icons/rx";
import { IoArrowBack } from "react-icons/io5";

const PlanFriend = ({ onInviteClick, onClose }) => {
  const navigate = useNavigate();

  const [planUsers, setplanUsers] = useState([]);
  const [invitable, setInvitable] = useState(false);

  const { planId } = useParams();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPlanUsers();
  }, []);

  const fetchPlanUsers = () => {
    showPlanUsers(planId)
      .then((response) => {
        setplanUsers(response.data);
        planUsers.sort((a, b) => a.userId - b.userId);

        return isInvitablePlanByUser(planId, userId);
      })
      .then((invitableResponse) => {
        if (invitableResponse) {
          setInvitable(invitableResponse.data);
        }
      })
      .catch((e) => {
        console.log(e);
        alert("목록을 불러올 수 없습니다. 다시 시도해주세요.");
      });
  };

  const handleExitPlan = () => {
    exitPlan(planId, userId)
      .then((response) => {
        alert("플랜에서 나갔습니다.");
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
        alert("플랜 나가기에 실패했습니다. 다시 시도해주세요.");
      });
  };

  // 사용자들을 status에 따라 분류
  const acceptUsers = planUsers.filter((user) => user.status === "ACCEPTED");
  const rejectUsers = planUsers.filter((user) => user.status === "REJECTED");
  const pendingUsers = planUsers.filter((user) => user.status === "PENDING");

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <button onClick={onClose} className={styles.backButton}>
          <IoArrowBack />
        </button>
        <span>플랜 참여자 목록</span>
        <span className={styles.people}>
          <GoPerson />
          <span>{acceptUsers.length}</span>
        </span>
      </div>
      <div className={styles.scrollContainer}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>참여 중</h3>
          <ul className={styles.userList}>
            {acceptUsers.map((user) => (
              <li key={user.userId} className={styles.userItem}>
                <span className={styles.userInfo}>
                  {/* <img src={profileImage} alt="Profile" className={styles.profileImage} /> */}
                  <img
                    src={acceptUsers.profileImageUrl || profileImage}
                    alt='Profile'
                    className={styles.profileImage}
                  />
                  <span className={styles.userNickname}>{user.nickname}</span>
                </span>
                {/* {user.nickname === nickname && (
              <button className={styles.exitButton} onClick={() => handleExitPlan(user)}>나가기</button>
            )} */}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>요청됨</h3>
          <ul className={styles.userList}>
            {pendingUsers.map((user) => (
              <li key={user.userId} className={styles.userItem}>
                <span className={styles.userInfo}>
                  {/* <img src={profileImage} alt="Profile" className={styles.profileImage} /> */}
                  <img
                    src={acceptUsers.profileImageUrl || profileImage}
                    alt='Profile'
                    className={styles.profileImage}
                  />
                  <span className={styles.userNickname}>{user.nickname}</span>
                </span>
                {/* {user === planUsers[0] && (<button onClick={() => handleCancelInvite(user)}>초대 취소</button>)} */}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>거절됨</h3>
          <ul className={styles.userList}>
            {rejectUsers.map((user) => (
              <li key={user.userId} className={styles.userItem}>
                <span className={styles.userInfo}>
                  <img
                    src={profileImage}
                    alt='Profile'
                    className={styles.profileImage}
                  />
                  <span className={styles.userNickname}>{user.nickname}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.buttonSection}>
        {invitable && (
          <button className={styles.inviteButton} onClick={onInviteClick}>
            <GoPersonAdd />
          </button>
        )}
        <button className={styles.exitButton} onClick={handleExitPlan}>
          <RxExit />
        </button>
      </div>
    </div>
  );
};

export default PlanFriend;
