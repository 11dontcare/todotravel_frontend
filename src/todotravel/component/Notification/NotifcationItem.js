import React from "react";
import moment from "moment";
import "moment/locale/ko";
import { deleteAlarams } from "../../service/NotificationService";

import styles from "./Notification.module.css";

const NotificationItem = ({
  alarmId,
  alarmContent,
  createdDate,
  status,
  userId,
  onDelete,
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // X 버튼 클릭 시 아이템 클릭 이벤트 방지
    deleteAlarams(userId)
      .then(() => {
        onDelete(alarmId);
      })
      .catch((error) => {
        console.error("알림 삭제에 실패했습니다.", error);
      });
  };

  return (
    <div className={styles.alarmItem}>
      <div className={styles.alarmContent}>
        <p className={styles.alarmText}>{alarmContent}</p>
        <span className={styles.alarmDate}>
          {moment(createdDate).fromNow()} {/* '5분 전' 같은 형식으로 표시 */}
        </span>
      </div>
      <button className={styles.deleteButton} onClick={handleDeleteClick}>
        x
      </button>
    </div>
  );
};

export default NotificationItem;
