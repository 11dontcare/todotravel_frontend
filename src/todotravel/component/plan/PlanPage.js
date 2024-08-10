import React, { useState, useEffect } from "react";
import ScheduleCreate from "./ScheduleCreate";

const PlanPage = () => {
  const [isShared, setIsShared] = useState(false); // 상태를 추가하여 스위치의 상태를 관리합니다.

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div>
        <p>여행 제목</p>
        <p>여행 시작 일자</p>
        <p>여행 종료 일자</p>
        <p>행정 구역</p>
        <p>지역 선택</p>
        <p>총 예산안</p>
        <p>여행 일정 공유</p>
      </div>
      <div>
        <button>투표 리스트</button>
        <button>친구 목록</button>
      </div>
      <ScheduleCreate />
    </div>
  );
};

export default PlanPage;
