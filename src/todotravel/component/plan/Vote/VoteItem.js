import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  showLocation,
  updateDescription,
  updateVehicle,
  updatePrice,
  updateStatus,
  deleteSchedule,
} from "../../../service/ScheduleService";
import moment from "moment";
import "moment/locale/ko";
import styles from "./Schedule.module.css";
import { FiEdit } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { IoCheckbox, IoCheckboxOutline } from "react-icons/io5";
import ItemMapInfo from "./ItemMapInfo";

const categoryOptions = [
  { value: "BREAKFAST", label: "아침 식사" },
  { value: "LUNCH", label: "점심 식사" },
  { value: "DINNER", label: "저녁 식사" },
  { value: "ACTIVITY", label: "활동" },
  { value: "TRANSPORTATION", label: "이동 수단" },
  { value: "ACCOMMODATION", label: "숙소" },
  { value: "BREAK", label: "휴식" },
];

const VoteItem = ({
  scheduleId,
  locationId,
  description,
  status,
  travelTime,
  vehicle,
  price,
  onEdit,
  onDelete,
}) => {
  const { planId } = useParams();
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
    updatePrice(editPrice, scheduleId)
      .then((response) => {
        console.log(response);
        setIsEditingPrice(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSaveDescription = (e) => {
    e.preventDefault();
    onEdit({ description: editDescription });
    updateDescription(editDescription, scheduleId)
      .then((response) => {
        console.log(response);
        setIsEditingDescription(false);
        setIsEditing(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleToggleStatus = () => {
    onEdit({ status: !status });
    updateStatus(scheduleId)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      deleteSchedule(planId, scheduleId)
        .then((response) => {
          console.log(response);
          if (onDelete) onDelete(scheduleId);
        })
        .catch((e) => {
          console.error(e);
        });
    }
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
        <h3>
          <span onClick={handleToggleStatus} className={styles.checkBox}>
            {status ? <IoCheckbox /> : <IoCheckboxOutline />}
          </span>
          {place.name}
        </h3>
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
              {categoryOptions.map((option) => (
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
              {categoryOptions.find((v) => v.value === vehicle)?.label}
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
          <div className={styles.itemEditBox}>
            <p>메모 : </p>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
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

            <button onClick={handleDelete} className={styles.cancelButton}>
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VoteItem;
