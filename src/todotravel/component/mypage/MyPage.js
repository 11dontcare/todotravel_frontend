import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelFollowing,
  doFollowing,
  getUserProfileByNickname,
  updateUserInfo,
} from "../../service/MyPageService";
import FollowModal from "./FollowModal";

import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import { DiAptana } from "react-icons/di";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import styles from "./MyPage.module.css";

import travelImage from "../../../image/travel.png";
import profileImage from "../../../image/user_profile_icon.png";

function MyPage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { nickname } = useParams();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [newInfo, setNewInfo] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // 무한 스크롤 관련 상태
  const [displayedPlans, setDisplayedPlans] = useState([]); // 현재 화면에 표시된 플랜
  const page = 1; // 현재 페이지 번호 (무한스크롤이므로 useState 없이 1로 설정)
  const [hasMore, setHasMore] = useState(true); // 더 불러올 플랜이 있는지 여부
  const observer = useRef(); // InterSection Observer 참조
  const plansPerPage = 6; // 한 번에 로드할 플랜 수
  const [allPlans, setAllPlans] = useState([]); // 전체 플랜 목록
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 추가 플랜 로딩 중 여부

  // 팔로우, 팔로잉 모달 상태
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [isFollowingModal, setIsFollowingModal] = useState(true);

  const handleFollowClick = useCallback((isFollowing) => {
    setIsFollowingModal(isFollowing);
    setShowFollowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowFollowModal(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getUserProfileByNickname(nickname);
        setProfileData(response.data);
        setNewInfo(response.data.info || "");
        setError(null);
        setIsFollowing(response.data.following);

        const loggedInUserId = localStorage.getItem("userId");
        const isOwn = loggedInUserId === response.data.userId.toString();
        setIsOwnProfile(isOwn);

        // 초기 플랜 데이터 설정
        setAllPlans(response.data.planList || []);

        // 처음 보여줄 플랜 설정
        const initialPlans = response.data.planList.slice(0, plansPerPage);
        setDisplayedPlans(initialPlans);

        // 더 보여줄 플랜이 있는지 확인
        setHasMore(response.data.planList.length > plansPerPage);
      } catch (error) {
        console.error("Error fetching profile data: ", error);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [nickname]);

  // 추가 플랜을 로드하는 함수
  const loadMorePlans = useCallback(async () => {
    if (isLoadingMore || !hasMore) return; // 이미 로딩 중이거나 더 불러올 플랜이 없으면 종료

    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 1100)); // 1.1초 지연

    const startIndex = displayedPlans.length;
    const endIndex = startIndex + plansPerPage;
    const newPlans = allPlans.slice(startIndex, endIndex);

    if (newPlans.length > 0) {
      // 새 플랜을 기존 플랜 목록에 추가
      setDisplayedPlans((prevPlans) => [...prevPlans, ...newPlans]);
      // 더 불러올 플랜이 있는지 확인
      setHasMore(endIndex < allPlans.length);
    } else {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [displayedPlans, hasMore, isLoadingMore, allPlans]);

  // Intersection Observer 콜백 함수
  const lastPlanElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // 마지막 요소가 화면에 보이고, 더 불러올 플랜이 있으면 추가 로드
        if (entries[0].isIntersecting && hasMore) {
          loadMorePlans();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, isLoadingMore, hasMore, loadMorePlans]
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error)
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );
  if (!profileData)
    return (
      <div>
        <p>존재하지 않는 사용자입니다.</p>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );

  const handleEditClick = () =>
    navigate(`/mypage/${profileData.nickname}/profile`);
  const handleInfoEdit = () => setIsEditingInfo(true);
  const handleInfoChange = (e) => {
    const text = e.target.value;
    if (text.length <= 160) setNewInfo(text);
  };

  const handleInfoSave = async () => {
    try {
      await updateUserInfo({ userId: profileData.userId, newInfo });
      setProfileData({ ...profileData, info: newInfo });
      setIsEditingInfo(false);
    } catch (error) {
      alert(error.message);
      console.error("Error updating user info: ", error);
    }
  };

  const handleFollowToggle = async () => {
    const loggedInUserId = localStorage.getItem("userId");
    if (!loggedInUserId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }

    try {
      if (isFollowing) {
        await cancelFollowing({
          followerId: Number(loggedInUserId),
          followingId: profileData.userId,
        });
        setIsFollowing(false);
      } else {
        await doFollowing({
          followerId: Number(loggedInUserId),
          followingId: profileData.userId,
        });
        setIsFollowing(true);
      }
      // 팔로워 수 업데이트
      setProfileData((prevData) => ({
        ...prevData,
        followerCount: isFollowing
          ? prevData.followerCount - 1
          : prevData.followerCount + 1,
      }));
    } catch (error) {
      console.error("팔로우 상태 변경 중 오류 발생: ", error.message);
      alert("팔로우 상태 변경에 실패했습니다.");
    }
  };

  const handlePlanClick = (planId) => navigate(`/plan/${planId}/details`);

  const renderTripSection = (title, trips, emptyMessage) => (
    <div className={styles.tripSection}>
      <div className={styles.sectionTitle}>
        <h2>{title}</h2>
        {isOwnProfile && trips && trips.length > 0 && (
          <span>
            <SlArrowRight />
          </span>
        )}
      </div>
      {trips && trips.length > 0 ? (
        <div className={styles.tripGrid}>
          {trips.map((trip, index) => (
            <div
              key={`${trip.planId}-${index}`}
              // 마지막 요소에 ref 추가 (무한 스크롤을 위한 관찰 대상)
              ref={
                !isOwnProfile && index === trips.length - 1
                  ? lastPlanElementRef
                  : null
              }
              className={styles.tripCard}
              onClick={() => handlePlanClick(trip.planId)}
            >
              <img
                src={travelImage}
                alt={trip.title}
                className={styles.tripImage}
              />
              <p className={styles.location}>{trip.location}</p>
              <h2 className={styles.planTitle}>{trip.title}</h2>
              <p className={styles.description}>{trip.description}</p>
              <p className={styles.dates}>
                {trip.startDate} ~ {trip.endDate}
              </p>
              <div className={styles.tripFooter}>
                <div className={styles.tripStats}>
                  <span className={styles.bookmarks}>
                    <FaRegBookmark /> {trip.bookmarkNumber}
                  </span>
                  <span className={styles.likes}>
                    <FaRegHeart /> {trip.likeNumber}
                  </span>
                </div>
                <span className={styles.planUserNickname}>
                  {trip.planUserNickname}님의 여행 일정
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      )}
      {/* 추가 플랜 로딩 중일 때 표시할 스피너 */}
      {isLoadingMore && (
        <div className={styles.loadingSpinner}>
          <AiOutlineLoading3Quarters className={styles.spinnerIcon} />
        </div>
      )}
    </div>
  );

  const renderCommentSection = (comments) => (
    <div className={styles.commentSection}>
      <div className={styles.sectionTitle}>
        <h2>{profileData.nickname}님의 댓글</h2>
        {comments && comments.length > 0 && (
          <span>
            <SlArrowRight />
          </span>
        )}
      </div>
      {comments && comments.length > 0 ? (
        <div className={styles.commentGrid}>
          {comments.slice(0, 4).map((comment, index) => (
            <div key={index} className={styles.commentItem}>
              <img
                src={travelImage}
                alt="Trip thumbnail"
                className={styles.commentImage}
              />
              <div className={styles.commentContent}>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>작성한 댓글이 없습니다.</p>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <img src={profileImage} alt="Profile" className={styles.profileImage} />
        <div className={styles.profileContent}>
          <div className={styles.profileSection}>
            <div className={styles.profileInfo}>
              <div className={styles.profileHeader}>
                <h1>{profileData.nickname}님의 MY PAGE</h1>
                {!isOwnProfile && (
                  <button
                    onClick={handleFollowToggle}
                    className={`${styles.followButton} ${
                      isFollowing ? styles.following : ""
                    }`}
                  >
                    {isFollowing ? "팔로잉" : "팔로우"}
                  </button>
                )}
              </div>
              <p>
                만 {profileData.age}세,{" "}
                {profileData.gender === "MAN" ? "남성" : "여성"}
              </p>
              {isOwnProfile ? (
                <div className={styles.infoWrapper}>
                  {isEditingInfo ? (
                    <div className={styles.infoEditContainer}>
                      <textarea
                        value={newInfo}
                        onChange={handleInfoChange}
                        maxLength={160}
                        className={styles.infoTextarea}
                      />
                      <div className={styles.infoFooter}>
                        <span className={styles.charCount}>
                          {newInfo.length}/160
                        </span>
                        <button
                          onClick={handleInfoSave}
                          className={styles.infoSaveButton}
                        >
                          완료
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.infoContainer}>
                      <HiOutlinePencilSquare
                        className={styles.infoEditIcon}
                        onClick={handleInfoEdit}
                      />
                      <p>
                        {profileData.info || "현재 작성된 소개글이 없습니다."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p>{profileData.info || "현재 작성된 소개글이 없습니다."}</p>
              )}
            </div>
          </div>
          <div
            className={`${styles.statsSection} ${
              !isOwnProfile ? styles.statsSectionOther : ""
            }`}
          >
            <div className={styles.statItem}>
              <p>{profileData.planCount}</p>
              <p>여행 수</p>
            </div>
            <div
              className={`${styles.statItem} ${styles.clickableStatItem}`}
              onClick={() => handleFollowClick(false)}
            >
              <p>{profileData.followerCount}</p>
              <p>팔로워</p>
            </div>
            <div
              className={`${styles.statItem} ${styles.clickableStatItem}`}
              onClick={() => handleFollowClick(true)}
            >
              <p>{profileData.followingCount}</p>
              <p>팔로잉</p>
            </div>
          </div>
        </div>
        {isOwnProfile && (
          <div className={styles.editButton} onClick={handleEditClick}>
            <DiAptana />
          </div>
        )}
      </div>

      {renderTripSection(
        `${profileData.nickname}님의 여행`,
        displayedPlans,
        "계획한 여행이 없습니다."
      )}

      {isOwnProfile && (
        <>
          {renderTripSection(
            `${profileData.nickname}님이 북마크한 여행`,
            profileData.recentBookmarks,
            "북마크한 여행이 없습니다."
          )}
          {renderTripSection(
            `${profileData.nickname}님이 좋아요한 여행`,
            profileData.recentLikes,
            "좋아요한 여행이 없습니다."
          )}
          {renderCommentSection(profileData.recentComments)}
        </>
      )}

      {showFollowModal && (
        <FollowModal
          userId={profileData.userId}
          isFollowing={isFollowingModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default MyPage;
