import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentPlans, getPopularPlans } from "../../service/PlanService";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { MdOutlineReadMore } from "react-icons/md";
import styles from "./MainPlanList.module.css";
import gridStyles from "./TripGrid.module.css";
import ScrollContainer from "react-indiana-drag-scroll";
import defaultThumbnail from "../../../image/thumbnail.png";

const MainPlanList = () => {
  const navigate = useNavigate();
  const [planList, setPlanList] = useState([]); // 플랜 리스트를 저장
  const [sortBy, setSortBy] = useState("newest"); // 정렬 기준을 관리: "newest" 또는 "popular"
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [sortBy]);

  const fetchPlans = () => {
    setIsLoading(true);
    const fetchFunction =
      sortBy === "newest" ? getRecentPlans : getPopularPlans;

    fetchFunction(0, 12)
      .then((response) => {
        setPlanList(response.data.content || []);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        alert("플랜 목록을 불러올 수 없습니다.");
        setIsLoading(false);
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
    // 전체 플랜 목록 페이지로 이동하거나 더 많은 플랜을 로드
    navigate("/plans");
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
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handlePlanClick(plan.planId)}
              >
                <img
                  src={
                    plan.planThumbnailUrl
                      ? plan.planThumbnailUrl
                      : defaultThumbnail
                  }
                  alt="travel"
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
    </div>
  );
};

export default MainPlanList;
