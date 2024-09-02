import React, { useEffect, useState } from "react";
import {
  showLocation,
  updateVehicle,
  deleteVehicle,
  updatePrice,
  deletePrice,
  updateStatus,
  deleteSchedule,
} from "../../../service/ScheduleService";
import moment from "moment";
import "moment/locale/ko";
import styles from "./Schedule.module.css";
import { FiEdit } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
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

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editVehicle, setEditVehicle] = useState(vehicle);
  const [editPrice, setEditPrice] = useState(price);
  const [editDescription, setEditDescription] = useState(description);

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

  const handleSave = () => {
    // Save the edited values
    onEdit({
      vehicle: editVehicle,
      price: editPrice,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    onEdit({ vehicle: editVehicle });
    updateVehicle(editVehicle, scheduleId)
      .then((response) => {
        console.log(response);
        setIsEditingVehicle(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSavePrice = (e) => {
    e.preventDefault();
    onEdit({ price: editPrice });
    updatePrice(editVehicle, scheduleId)
      .then((response) => {
        console.log(response);
        setIsEditingPrice(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSaveDescription = (e) => {
    // Save the edited description value
    onEdit({ description: editDescription });
    setIsEditingDescription(false);
  };

  const formattedTravelTime = travelTime
    ? moment(travelTime, "HH:mm:ss").format("A h시 mm분")
    : "정보 없음";

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
        {isEditingVehicle ? (
          <div className={styles.editContainer}>
            <p>이동수단 :</p>
            <select
              value={editVehicle}
              onChange={(e) => setEditVehicle(e.target.value)}
            >
              {vehicleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleSaveVehicle}
              className={styles.editSubmitButton}
            >
              <IoMdCheckmark className={styles.check} />
            </button>
          </div>
        ) : (
          <div className={styles.itemOption}>
            <p>
              이동수단 :{" "}
              {vehicleOptions.find((v) => v.value === vehicle)?.label}
              <span
                onClick={() => setIsEditingVehicle(true)}
                className={styles.edit}
              >
                <FiEdit />
              </span>
            </p>
          </div>
        )}
        {isEditingPrice ? (
          <div className={styles.editContainer}>
            <p>예산 : </p>
            <input
              type='number'
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              min='0'
              className={styles.itemPriceInput}
            />
            <span> 원</span>
            <button
              onClick={handleSavePrice}
              className={styles.editSubmitButton}
            >
              <IoMdCheckmark className={styles.check} />
            </button>
          </div>
        ) : (
          <div className={styles.itemOption}>
            <p>
              예산 : {price ? price : 0}원
              <span
                onClick={() => setIsEditingPrice(true)}
                className={styles.edit}
              >
                <FiEdit />
              </span>
            </p>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className={styles.itemEditContainer}>
          <p>메모 : </p>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <div className={styles.itemBtn}>
            <button
              onClick={handleSaveDescription}
              className={styles.submitButton}
            >
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className={styles.itemDescription}>
            메모 : {description}
            <span
              onClick={() => setIsEditingDescription(true)}
              className={styles.edit}
            ></span>
          </p>
          <div className={styles.itemBtn}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.submitButton}
            >
              수정
            </button>

            <button className={styles.cancelButton}>삭제</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleItem;
