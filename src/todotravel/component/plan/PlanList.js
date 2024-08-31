import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRecentPlans,
  getPopularPlans,
  getRecentPlansByFrontLocation,
  getPopularPlansByFrontLocation,
  getRecentPlansByLocation,
  getPopularPlansByLocation,
} from "../../service/PlanService";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { Provinces, Citys } from "./PlanData";
import styles from "./PlanList.module.css";
import gridStyles from "./TripGrid.module.css";
import defaultThumbnail from "../../../image/thumbnail.png";

const PlanList = () => {
  const navigate = useNavigate();
  const [planList, setPlanList] = useState([]);
  const [frontLocation, setFrontLocation] = useState("");
  const [location, setLocation] = useState("");
  const [availableCitys, setAvailableCitys] = useState([]);
  const [sortType, setSortType] = useState("recent");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const planListRef = useRef(null);
  const observer = useRef(null);
  const isInitialLoad = useRef(true);

  const loadPlans = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      if (!isInitialLoad.current) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      let response;
      if (!frontLocation) {
        response = await (sortType === "recent"
          ? getRecentPlans(page)
          : getPopularPlans(page));
      } else if (!location) {
        response = await (sortType === "recent"
          ? getRecentPlansByFrontLocation(page, frontLocation)
          : getPopularPlansByFrontLocation(page, frontLocation));
      } else {
        response = await (sortType === "recent"
          ? getRecentPlansByLocation(page, frontLocation, location)
          : getPopularPlansByLocation(page, frontLocation, location));
      }
      const responseData = response.data;
      const newPlans = responseData.content;

      setPlanList((prevPlans) => [...prevPlans, ...newPlans]);
      setHasMore(newPlans.length === 12 && responseData.last);
      setPage((prevPage) => prevPage + 1);
      
      console.log('Response data:', responseData);
      console.log('New plans:', newPlans);
      console.log('Has more:', !responseData.last);

      isInitialLoad.current = false;
    } catch (error) {
      console.error("Error fetching plans:", error);
      alert("플랜을 불러오는 데 실패했습니다.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [frontLocation, location, sortType, page, loading, hasMore]);

  const handleSearch = () => {
    setPlanList([]);
    setPage(0);
    setHasMore(true);
    isInitialLoad.current = true;
    loadPlans();
  };

  useEffect(() => {
    // 초기 로드 시에만 최신순으로 데이터를 가져옵니다.
    if (isInitialLoad.current) {
      loadPlans();
    }
  }, []);

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
          console.log('Loading more plans...');
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
      <div className={styles.filterContainer}>
        <select
          value={frontLocation}
          onChange={(e) => setFrontLocation(e.target.value)}
          className={styles.select}
        >
          <option value="">행정 구역 선택</option>
          {Provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={styles.select}
          disabled={!frontLocation}
        >
          <option value="">지역 선택</option>
          {availableCitys.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className={styles.select}
        >
          <option value="recent">최신순</option>
          <option value="popular">인기순</option>
        </select>
        <button onClick={handleSearch} className={styles.searchButton}>
          검색
        </button>
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

export default PlanList;