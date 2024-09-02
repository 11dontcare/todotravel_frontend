import React, { useState, useEffect } from "react";
import { getPlan } from "../../../service/PlanService";
import ScheduleItem from "./ScheduleItem";
import { useParams } from "react-router-dom";

const ScheduleList = () => {
  const [editMode, setEditMode] = useState(null);
  const { planId } = useParams();
  const [scheduleList, setScheduleList] = useState([]); // schedule

  useEffect(() => {
    // 투표 리스트를 서버에서 가져옴
    getPlan(planId)
      .then((response) => {
        setScheduleList(response.data.scheduleList);
        console.log(response.data.scheduleList);
      })
      .catch((error) => {
        console.error("일정을 불러오는데 실패했습니다.", error);
      });
  }, [planId]); // 'planId'만 의존성 배열에 추가

  const handleEdit = (id) => {
    setEditMode(id); // 수정 모드로 전환
  };

  if (!scheduleList || scheduleList.length === 0) {
    return <div>일정이 없습니다.</div>;
  }

  const groupedSchedules = scheduleList.reduce((acc, curr) => {
    const { travelCount } = curr;
    if (!acc[travelCount]) acc[travelCount] = [];
    acc[travelCount].push(curr);
    return acc;
  }, {});

  return (
    <div className='schedule-list'>
      {Object.keys(groupedSchedules).map((day) => (
        <div key={day} className='day-group'>
          <h3>{day}일차</h3>
          <div className='schedule-items'>
            {groupedSchedules[day].map((item) => (
              <ScheduleItem
                key={item.id}
                travelCount={item.travelCount}
                locationName={item.locationName}
                address={item.address}
                time={item.time}
                transportation={item.transportation}
                budget={item.budget}
                memo={item.memo}
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
