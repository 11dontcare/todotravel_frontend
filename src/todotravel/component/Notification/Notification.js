import React from "react";
import ParticipantResponseList from "../plan/ParticipantResponseList";
import NotificationList from "./NotificationList";

import styles from "./Notification.module.css";
import { IoArrowBack } from "react-icons/io5";

const Notification = ({ onClose }) => {
  return (
    <div className={styles.container}>
      <IoArrowBack className={styles.backButton} onClick={onClose} />
      <h3 className={styles.title}>알림</h3>
      <ParticipantResponseList />
      <hr className={styles.hr} />
      <NotificationList />
    </div>
  );
};

export default Notification;
