import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showLocation } from "../../../service/ScheduleService";
import moment from "moment";
import "moment/locale/ko";
import styles from "./Schedule.module.css";
import ItemMapInfo from "./ItemMapInfo";

const vehicleOptions = [
  { value: "CAR", label: "자동차" },
  { value: "AIRPLANE", label: "비행기" },
  { value: "TRAIN", label: "기차" },
  { value: "BUS", label: "버스" },
  { value: "BIKE", label: "자전거" },
  { value: "WALK", label: "도보" },
  { value: "TAXI", label: "택시" },
];

const PlanDetailScheduleItem = ({
  scheduleId,
  locationId,
  description,
  status,
  travelTime,
  vehicle,
  price,
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
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const formattedTravelTime = travelTime
    ? moment(travelTime, "HH:mm:ss").format("A h시 mm분")
    : "정보 없음";

  const vehicleLabel =
    vehicleOptions.find((v) => v.value === vehicle)?.label || "선택 없음";

  return (
    <div className={styles.item}>
      <ItemMapInfo
        latitude={place.latitude}
        longitude={place.longitude}
        mapId={scheduleId}
      />
      <div className={styles.itemHeader}>
        <h3>{place.name}</h3>
        <span>{formattedTravelTime}</span>
      </div>
      <div className={styles.itemOption}>
        <p>이동수단 : {vehicleLabel}</p>
      </div>
      <div className={styles.itemOption}>
        <p>예산 : {price ? price : 0}원</p>
      </div>
      <p className={styles.itemDescription}>메모 : {description}</p>
    </div>
  );
};

export default PlanDetailScheduleItem;
