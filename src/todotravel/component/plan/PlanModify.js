import React, { useState, useEffect } from "react";

const PlanModify = () => {
  const [isShared, setIsShared] = useState(false); // 상태를 추가하여 스위치의 상태를 관리합니다.

  const handleSwitchChange = () => {
    setIsShared(!isShared); // 스위치 상태를 반전시킵니다.
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div>
        <form onSubmit={onSubmit}>
          <input placeholder='제목을 입력해주세요.' />
          <input placeholder='여행 시작 일자' />
          <input placeholder='여행 종료 일자' />
          <input placeholder='행정 구역' />
          <input placeholder='지역 선택' />
          <input placeholder='총 예산안 입력' />

          <div>
            <label>여행 일정 공유</label>
            <input
              type='checkbox'
              checked={isShared}
              onChange={handleSwitchChange}
            />
          </div>
          <button type='submit'>계획 시작하기</button>
        </form>
      </div>
    </div>
  );
};

export default PlanModify;
