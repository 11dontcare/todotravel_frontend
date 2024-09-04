import React, { useState, useEffect } from "react";
import moment from "moment";
import styles from "./Schedule.module.css";
import ScheduleItem from "./ScheduleItem";

const ScheduleList = ({ scheduleList }) => {
  const [schedules, setSchedules] = useState(scheduleList);

  useEffect(() => {
    setSchedules(scheduleList);
  }, [scheduleList]);

  const handleEdit = (updatedItem) => {
    setSchedules((prevSchedules) =>
      prevSchedules.map((item) =>
        item.scheduleId === updatedItem.scheduleId
          ? { ...item, ...updatedItem }
          : item
      )
    );
  };

  const handleDelete = (deletedScheduleId) => {
    setSchedules((prevSchedules) =>
      prevSchedules.filter(
        (schedule) => schedule.scheduleId !== deletedScheduleId
      )
    );
  };

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
    <div className={styles.scheduleList}>
      {Object.keys(groupedScheduleList).map((day) => (
        <div key={day} className={styles.scheduleGroup}>
          <h2>{day}일차</h2>
          <div className={styles.scheduleItem}>
            {groupedScheduleList[day].map((item) => (
              <ScheduleItem
                key={item.scheduleId}
                scheduleId={item.scheduleId}
                locationId={item.locationId}
                travelDayCount={item.travelDayCount}
                description={item.description}
                status={item.status}
                travelTime={item.travelTime}
                vehicle={item.vehicle}
                price={item.price}
                onEdit={(updatedData) =>
                  handleEdit({ scheduleId: item.scheduleId, ...updatedData })
                }
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
