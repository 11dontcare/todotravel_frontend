import React, { useState, useEffect } from "react";
import {
  showAllAlarams,
  deleteAllAlarams,
} from "../../service/NotificationService";
import styles from "./Notification.module.css";
import NotificationItem from "./NotifcationItem";

const NotificationList = () => {
  const userId = localStorage.getItem("userId");
  const [alarmList, setAlarmList] = useState([]);

  useEffect(() => {
    fetchAlaramList();
  }, []);

  const fetchAlaramList = () => {
    showAllAlarams(userId)
      .then((response) => {
        setAlarmList(response.data);
      })
      .catch((error) => {
        console.error("알림을 불러오는데 실패했습니다.", error);
      });
  };

  const onClickDelete = () => {
    deleteAllAlarams(userId)
      .then((response) => {
        alert(response.message);
        fetchAlaramList();
      })
      .catch((error) => {
        console.error("알림을 삭제하는데 실패했습니다.", error);
      });
  };

  const handleDelete = (deletedAlarmId) => {
    setAlarmList((prevAlarms) =>
      prevAlarms.filter((alarm) => alarm.alarmId !== deletedAlarmId)
    );
  };

  if (!alarmList || alarmList.length === 0) {
    return <div className={styles.noAlarm}>알림이 없습니다.</div>;
  }

  return (
    <div className={styles.alarmList}>
      {alarmList.map((item) => (
        <NotificationItem
          key={item.alarmId}
          alarmId={item.alarmId}
          alarmContent={item.alarmContent}
          createdDate={item.createdDate}
          status={item.status}
          userId={userId}
          onDelete={handleDelete}
        />
      ))}
      <div className={styles.buttonContainer} onClick={onClickDelete}>
        <button>전체 삭제</button>
      </div>
    </div>
  );
};

export default NotificationList;
