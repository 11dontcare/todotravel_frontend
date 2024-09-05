import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRecentPlans,
  getPopularPlans,
  getRecentRecruitPlans,
} from "../../service/PlanService";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { MdOutlineReadMore } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import styles from "./MainPlanList.module.css";
import gridStyles from "./TripGrid.module.css";
import ScrollContainer from "react-indiana-drag-scroll";
import defaultThumbnail from "../../../image/thumbnail.png";

const MainPlanList = () => {
  const navigate = useNavigate();
  const [planList, setPlanList] = useState([]); // 플랜 리스트를 저장
  const [recruitPlanList, setRecruitPlanList] = useState([]); // 모집중인 플랜 리스트를 저장
  const [sortBy, setSortBy] = useState("newest"); // 정렬 기준을 관리: "newest" 또는 "popular"
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchRecruitPlans();
  }, [sortBy]);

  const fetchPlans = () => {
    const fetchFunction =
      sortBy === "newest" ? getRecentPlans : getPopularPlans;

    fetchFunction(0, 12)
      .then((response) => {
        setPlanList(response.data.content || []);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchRecruitPlans = () => {
    getRecentRecruitPlans(0)
      .then((response) => {
        setRecruitPlanList(response.data.content || []);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handlePlanClick = (planId) => {
    if (!isDragging) {
      navigate(`/plan/${planId}/details`);
    }
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const handleReadMoreClick = () => {
    navigate("/plan-list");
  };

  const handleReadRecruitMoreClick = () => {
    navigate("/plan/recruitment");
  };

  return (
    <div>
      <div className={styles.text}>
        <span>일정 공유해요</span>
        <div className={styles.sortButtons}>
          <button
            className={sortBy === "newest" ? styles.active : ""}
            onClick={() => setSortBy("newest")}
          >
            최신순
          </button>
          <button
            className={sortBy === "popular" ? styles.active : ""}
            onClick={() => setSortBy("popular")}
          >
            인기순
          </button>
        </div>
      </div>

      {/* 공유된 플랜 리스트 */}
      <ScrollContainer
        className={styles.planListContainer}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        {planList.length > 0 ? (
          <>
            {planList.map((plan, index) => (
              <div
                key={plan.planId}
                className={`${gridStyles.tripCard} ${styles.fadeIn}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  width: "220px",
                  height: "400px",
                }}
                onClick={() => handlePlanClick(plan.planId)}
              >
                <img
                  src={
                    plan.planThumbnailUrl
                      ? plan.planThumbnailUrl
                      : defaultThumbnail
                  }
                  alt='travel'
                  className={gridStyles.tripImage}
                />
                <p className={gridStyles.location}>{plan.location}</p>
                <h2 className={gridStyles.planTitle}>{plan.title}</h2>
                <p className={gridStyles.description}>{plan.description}</p>
                <p className={gridStyles.dates}>
                  {plan.startDate} ~ {plan.endDate}
                </p>
                <div className={gridStyles.tripFooter}>
                  <div className={gridStyles.tripStats}>
                    <span className={gridStyles.bookmarks}>
                      <FaRegBookmark /> {plan.bookmarkNumber}
                    </span>
                    <span className={gridStyles.likes}>
                      <FaRegHeart /> {plan.likeNumber}
                    </span>
                  </div>
                  <span className={gridStyles.planUserNickname}>
                    {plan.planUserNickname}님의 여행 일정
                  </span>
                </div>
              </div>
            ))}
            <div className={styles.readMoreCard} onClick={handleReadMoreClick}>
              <MdOutlineReadMore size={48} />
            </div>
          </>
        ) : (
          <p className={gridStyles.emptyMessage}>플랜이 없습니다.</p>
        )}
      </ScrollContainer>

      {/* 모집중인 플랜 리스트 */}
      <div className={styles.text}>
        <span>모집중인 플랜</span>
      </div>
      <ScrollContainer
        className={styles.planListContainer}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        {recruitPlanList.length > 0 ? (
          <>
            {recruitPlanList.map((plan, index) => (
              <div
                key={plan.planId}
                className={`${gridStyles.tripCard} ${styles.fadeIn}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  width: "270px",
                  height: "400px",
                }}
                onClick={() => handlePlanClick(plan.planId)}
              >
                <img
                  src={
                    plan.planThumbnailUrl
                      ? plan.planThumbnailUrl
                      : defaultThumbnail
                  }
                  alt='travel'
                  className={gridStyles.tripImage}
                />
                <p className={gridStyles.location}>{plan.location}</p>
                <h2 className={gridStyles.planTitle}>{plan.title}</h2>
                <p className={gridStyles.description}>{plan.description}</p>
                <p className={gridStyles.dates}>
                  {plan.startDate} ~ {plan.endDate}
                </p>
                <div className={gridStyles.tripFooter}>
                  <div className={gridStyles.tripStats}>
                    <span className={gridStyles.bookmarks}>
                      <FaRegBookmark /> {plan.bookmarkNumber}
                    </span>
                    <span className={gridStyles.likes}>
                      <FaRegHeart /> {plan.likeNumber}
                    </span>
                    <span className={gridStyles.participants}>
                      <GoPerson className={gridStyles.participant} />{" "}
                      {plan.planUserCount}/{plan.participantsCount}
                    </span>
                  </div>
                  <span className={gridStyles.planUserNickname}>
                    {plan.planUserNickname}님의 여행 일정
                  </span>
                </div>
              </div>
            ))}
            <div
              className={styles.readMoreCard}
              onClick={handleReadRecruitMoreClick}
            >
              <MdOutlineReadMore size={48} />
            </div>
          </>
        ) : (
          <p className={gridStyles.emptyMessage}>모집중인 플랜이 없습니다.</p>
        )}
      </ScrollContainer>
    </div>
  );
};

export default MainPlanList;
