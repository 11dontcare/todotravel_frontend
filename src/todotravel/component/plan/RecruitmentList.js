import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRecentRecruitPlans,
  getRecentRecruitPlansByFrontLocation,
  getRecentRecruitPlansByFrontLocationAndStartDate,
  getRecentRecruitPlansByLocation,
  getRecentRecruitPlansByLocationAndStartDate,
  getRecentRecruitPlansByStartDate,
} from "../../service/PlanService";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { Provinces, Citys } from "./PlanData";
import styles from "./PlanList.module.css";
import gridStyles from "./TripGrid.module.css";
import defaultThumbnail from "../../../image/thumbnail.png";

const RecruitmentList = () => {
  const navigate = useNavigate();
  const [planList, setPlanList] = useState([]);
  const [frontLocation, setFrontLocation] = useState("");
  const [location, setLocation] = useState("");
  const [availableCitys, setAvailableCitys] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const planListRef = useRef(null);
  const observer = useRef(null);
  const isInitialLoad = useRef(true);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const loadPlans = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      if (!isInitialLoad.current) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      let response;
      if (!frontLocation) {
        response = await (startDate === null
          ? getRecentRecruitPlans(page)
          : getRecentRecruitPlansByStartDate(page, startDate));
      } else if (!location) {
        response = await (startDate === null
          ? getRecentRecruitPlansByFrontLocation(page, frontLocation)
          : getRecentRecruitPlansByFrontLocationAndStartDate(
              page,
              frontLocation,
              startDate
            ));
      } else {
        response = await (startDate === null
          ? getRecentRecruitPlansByLocation(page, frontLocation, location)
          : getRecentRecruitPlansByLocationAndStartDate(
              page,
              frontLocation,
              location,
              startDate
            ));
      }

      const responseData = response.data;
      const newPlans = responseData.content;

      setPlanList((prevPlans) =>
        page === 0 ? newPlans : [...prevPlans, ...newPlans]
      );
      setHasMore(newPlans.length === 12 && responseData.last);
      setPage((prevPage) => prevPage + 1);
      isInitialLoad.current = false;
    } catch (error) {
      console.error("Error fetching plans:", error);
      alert("플랜을 불러오는 데 실패했습니다.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [frontLocation, location, page, startDate, loading, hasMore]);

  const handleSearch = () => {
    setPlanList([]);
    setPage(0);
    setHasMore(true);
    setLoading(false);
    isInitialLoad.current = true;
    setSearchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    loadPlans();
  }, [searchTrigger]);

  useEffect(() => {
    if (frontLocation) {
      const selectedProvince = Citys.find(
        (item) => item.province === frontLocation
      );
      setAvailableCitys(selectedProvince ? selectedProvince.citys : []);
      setLocation("");
    }
  }, [frontLocation]);

  const lastPlanElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Loading more plans...");
          loadPlans();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadPlans]
  );

  const handlePlanClick = (planId) => {
    navigate(`/plan/${planId}/details`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterBox}>
        <div className={styles.filterContainer}>
          <div className={styles.filterItem}>
            <label htmlFor='frontLocation' className={styles.filterLabel}>
              행정 구역
            </label>
            <select
              id='frontLocation'
              value={frontLocation}
              onChange={(e) => setFrontLocation(e.target.value)}
              className={styles.select}
            >
              <option value=''>행정 구역 선택</option>
              {Provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterItem}>
            <label htmlFor='location' className={styles.filterLabel}>
              도시
            </label>
            <select
              id='location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.select}
              disabled={!frontLocation}
            >
              <option value=''>지역 선택</option>
              {availableCitys.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterItem}>
            <label htmlFor='startDate' className={styles.filterLabel}>
              여행 시작 날짜
            </label>
            <input
              id='startDate'
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.select}
            />
          </div>
          <button onClick={handleSearch} className={styles.searchButton}>
            검색
          </button>
        </div>
        <p className={styles.filterNote}>
          ※ 필터링된 플랜은 아래에서 볼 수 있습니다.
        </p>
      </div>
      <div className={gridStyles.tripGrid} ref={planListRef}>
        {planList.map((plan, index) => (
          <div
            key={`${plan.planId}-${index}`}
            className={gridStyles.tripCard}
            onClick={() => handlePlanClick(plan.planId)}
            ref={index === planList.length - 1 ? lastPlanElementRef : null}
          >
            <img
              src={plan.planThumbnailUrl || defaultThumbnail}
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
      </div>
      {loading && !isInitialLoad.current && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
          <p>Loading more plans...</p>
        </div>
      )}
      {!hasMore && planList.length > 0 && (
        <p className={styles.noMore}>더 이상 플랜이 없습니다.</p>
      )}
    </div>
  );
};

export default RecruitmentList;
