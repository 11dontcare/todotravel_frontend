import React, { useState } from "react";
import styles from "./Schedule.module.css"; // 스타일링을 위한 CSS 파일을 임포트합니다.

const ScheduleItem = ({
  travelCount,
  locationName,
  address,
  time,
  transportation,
  budget,
  memo,
  onEdit,
}) => {
  return (
    <div className='schedule-item'>
      <div className='schedule-header'>
        <h4>{locationName}</h4>
        <span>{time}</span>
      </div>
      <p>{address}</p>
      <p>이동수단: {transportation}</p>
      <p>예산: {budget}원</p>
      <p>메모: {memo}</p>
      <button onClick={onEdit}>수정</button>
    </div>
  );
};

export default ScheduleItem;
