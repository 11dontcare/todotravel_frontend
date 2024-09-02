/*global kakao*/
import React, { useEffect, useState } from "react";
import { showLocation } from "../../../service/ScheduleService";

import styles from "./Schedule.module.css";
import ItemMapInfo from "./ItemMapInfo";

const ScheduleItem = ({
  scheduleId,
  locationId,
  travelDayCount,
  description,
  status,
  travelTime,
  vehicle,
  price,
  onEdit,
}) => {
  const [place, setPlace] = useState({
    longitude: "",
    latitude: "",
    name: "",
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    showLocation(locationId)
      .then((response) => {
        setPlace(response.data);
        console.log(response);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className={styles.item}>
      <div className='schedule-header'>
        <ItemMapInfo
          latitude={place.latitude}
          longitude={place.longitude}
          mapId={scheduleId}
        />
        <h4>{place.name}</h4>
        <span>{travelTime}</span>
      </div>
      <p>{locationId}</p>
      <p>이동수단: {vehicle}</p>
      <p>예산: {price}원</p>
      <p>메모: {description}</p>
      <button onClick={onEdit}>수정</button>
    </div>
  );
};

export default ScheduleItem;
