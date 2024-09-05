import React from "react";
import moment from "moment";
import "moment/locale/ko";
import { deleteAlarams } from "../../service/NotificationService";

import styles from "./Notification.module.css";

const NotificationItem = ({
  alarmId,
  alarmContent,
  createdDate,
  userId,
  onDelete,
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
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
          {moment(createdDate).fromNow()}
        </span>
      </div>
      <button className={styles.deleteButton} onClick={handleDeleteClick}>
        x
      </button>
    </div>
  );
};

export default NotificationItem;
