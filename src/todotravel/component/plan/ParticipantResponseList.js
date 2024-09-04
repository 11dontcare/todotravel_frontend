import React, { useEffect, useState } from "react";
import {
  acceptInvite,
  acceptRecruit,
  rejectInvite,
  rejectRecruit,
  showParticipantsByUser,
} from "../../service/PlanService";

import styles from "./ParticipantResponseList.module.css";

import { IoArrowBack } from "react-icons/io5";

const ParticipantResponseList = ({ onClose }) => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const userId = localStorage.getItem("userId");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    showParticipantsByUser(userId)
      .then((response) => {
        setPendingUsers(response.data);
      })
      .catch((e) => {
        console.log(e);
        alert("목록을 불러올 수 없습니다. 다시 시도해주세요.");
      });
  }, [reload]);

  const recruit = pendingUsers.filter((plan) => plan.recruitment);
  const invite = pendingUsers.filter((plan) => !plan.recruitment);

  const handleAcceptRecruitClick = (planUser) => {
    acceptRecruit(planUser.planParticipantId)
      .then(() => {
        alert(`${planUser.pendingUserNickname}님의 참가를 수락했습니다.`);
        setReload(!reload);
      })
      .catch((e) => {
        console.log(e);
        alert("수락에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const handleRejectRecruitClick = (planUser) => {
    rejectRecruit(planUser.planParticipantId)
      .then(() => {
        alert(`${planUser.pendingUserNickname}님의 참가를 거절했습니다.`);
        setReload(!reload);
      })
      .catch((e) => {
        console.log(e);
        alert("거절에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const handleAcceptInviteClick = (planUser) => {
    acceptInvite(planUser.planParticipantId)
      .then(() => {
        alert(`${planUser.pendingUserNickname}님의 초대를 수락했습니다.`);
        setReload(!reload);
      })
      .catch((e) => {
        console.log(e);
        alert("수락에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const handleRejectInviteClick = (planUser) => {
    rejectInvite(planUser.planParticipantId)
      .then(() => {
        alert(`${planUser.pendingUserNickname}님의 초대를 거절했습니다.`);
        setReload(!reload);
      })
      .catch((e) => {
        console.log(e);
        alert("거절에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div>
      <div className={styles.scrollContainer}>
        <button onClick={onClose} className={styles.backButton}>
          <IoArrowBack />
        </button>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>참가 요청</h2>
          <ul className={styles.pendingUserList}>
            {recruit.map((planUser) => (
              <li
                key={planUser.planParticipantId}
                className={styles.pendingUserItem}
              >
                <div className={styles.content}>
                  <span>[{planUser.planTitle}]</span> 플랜에
                  <br />
                  <span>{planUser.pendingUserNickname}</span>님이 참가 요청을
                  보냈습니다.
                </div>
                <div className={styles.buttonSection}>
                  <button
                    onClick={() => handleAcceptRecruitClick(planUser)}
                    className={styles.acceptButton}
                  >
                    수락
                  </button>
                  <button
                    onClick={() => handleRejectRecruitClick(planUser)}
                    className={styles.rejectButton}
                  >
                    거절
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>초대 요청</h2>
          <ul className={styles.pendingUserList}>
            {invite.map((planUser) => (
              <li
                key={planUser.planParticipantId}
                className={styles.pendingUserItem}
              >
                <div className={styles.content}>
                  <span>[{planUser.planTitle}]</span> 플랜에
                  <br />
                  <span>{planUser.planUserNickname}</span>님이 초대를
                  보냈습니다.
                </div>
                <div className={styles.buttonSection}>
                  <button
                    onClick={() => handleAcceptInviteClick(planUser)}
                    className={styles.acceptButton}
                  >
                    수락
                  </button>
                  <button
                    onClick={() => handleRejectInviteClick(planUser)}
                    className={styles.rejectButton}
                  >
                    거절
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParticipantResponseList;
