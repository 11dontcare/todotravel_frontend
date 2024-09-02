import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPlan } from "../../../service/PlanService";

import styles from "./Schedule.module.css";

import ScheduleItem from "./ScheduleItem";

const ScheduleList = ({ scheduleList }) => {
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    console.log(scheduleList);
  }, [scheduleList]);

  const handleEdit = (id) => {
    setEditMode(id); // 수정 모드로 전환
  };

  if (!scheduleList || scheduleList.length === 0) {
    return <div>일정이 없습니다.</div>;
  }

  const groupedScheduleList = scheduleList.reduce((acc, curr) => {
    const { travelDayCount } = curr;
    if (!acc[travelDayCount]) acc[travelDayCount] = [];
    acc[travelDayCount].push(curr);
    return acc;
  }, {});

  return (
    <div className={styles.scheduleList}>
      {Object.keys(groupedScheduleList).map((day) => (
        <div key={day} className={styles.scheduleGroup}>
          <h2>{day}일차</h2>
          <div className={styles.scheduleItem}>
            {groupedScheduleList[day].map((item) => (
              <ScheduleItem
                key={item.scheduleId} // 유니크한 키 추가
                scheduleId={item.scheduleId}
                locationId={item.locationId}
                travelDayCount={item.travelDayCount}
                description={item.description}
                status={item.status}
                travelTime={item.travelTime}
                vehicle={item.vehicle}
                price={item.price}
                onEdit={() => handleEdit(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
