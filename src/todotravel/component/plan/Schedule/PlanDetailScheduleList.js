import React, { useState, useEffect } from "react";
import moment from "moment";
import styles from "./Schedule.module.css";
import PlanDetailScheduleItem from "./PlanDetailScheduleItem";

const PlanDetailScheduleList = ({ scheduleList }) => {
  const [schedules, setSchedules] = useState(scheduleList);

  useEffect(() => {
    setSchedules(scheduleList);
  }, [scheduleList]);

  if (!schedules || schedules.length === 0) {
    return <div>일정이 없습니다.</div>;
  }

  // 일정 정렬
  const groupedScheduleList = schedules.reduce((acc, curr) => {
    const { travelDayCount, travelTime } = curr;
    if (!acc[travelDayCount]) acc[travelDayCount] = [];
    acc[travelDayCount].push(curr);

    // 각 일차별로 정렬하기
    acc[travelDayCount].sort((a, b) =>
      moment(a.travelTime, "HH:mm:ss").diff(moment(b.travelTime, "HH:mm:ss"))
    );

    return acc;
  }, {});

  return (
    <div className={styles.planScheduleList}>
      {Object.keys(groupedScheduleList).map((day) => (
        <div key={day} className={styles.scheduleGroup}>
          <h2>{day}일차</h2>
          <div className={styles.planScheduleItem}>
            {groupedScheduleList[day].map((item) => (
              <PlanDetailScheduleItem
                key={item.scheduleId}
                scheduleId={item.scheduleId}
                locationId={item.locationId}
                travelDayCount={item.travelDayCount}
                description={item.description}
                status={item.status}
                travelTime={item.travelTime}
                vehicle={item.vehicle}
                price={item.price}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanDetailScheduleList;
