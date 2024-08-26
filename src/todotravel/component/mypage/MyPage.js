import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelFollowing,
  doFollowing,
  getUserProfileByNickname,
  updateUserInfo,
  getAllMyPlans,
  getAllBookmarkedPlans,
  getAllLikedPlans,
  getAllCommentedPlans,
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

  // 메인 - 무한 스크롤 관련 상태 (타 사용자)
  const [displayedPlans, setDisplayedPlans] = useState([]); // 현재 화면에 표시된 플랜
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 추가 플랜 로딩 중 여부
  const [hasMore, setHasMore] = useState(true); // 더 불러올 플랜이 있는지 여부
  const [allPlans, setAllPlans] = useState([]); // 전체 플랜 목록
  const observer = useRef(); // InterSection Observer 참조
  const page = 1; // 현재 페이지 번호 (무한스크롤이므로 useState 없이 1로 설정)
  const plansPerPage = 9; // 한 번에 로드할 플랜 수

  // 팔로우, 팔로잉 모달 상태
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [isFollowingModal, setIsFollowingModal] = useState(true);

  // 여행 더보기 섹션
  const [currentView, setCurrentView] = useState("overview");
  const [displayedFullTripList, setDisplayedFullTripList] = useState([]);
  const [isLoadingFullList, setIsLoadingFullList] = useState(false);
  const [hasMoreFullList, setHasMoreFullList] = useState(true);
  const [allFullTripList, setAllFullTripList] = useState([]);
  const fullListObserver = useRef();

  // 댓글 더보기 섹션
  const [displayedComments, setDisplayedComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [allComments, setAllComments] = useState([]);
  const commentsObserver = useRef();
  const commentsPerPage = 14;

  const handleFollowClick = useCallback((isFollowing) => {
    setIsFollowingModal(isFollowing);
    setShowFollowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowFollowModal(false);
  }, []);

  // 메인
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setCurrentView("overview"); // 새로운 사용자 페이지로 이동할 때 overview로 리셋
        const response = await getUserProfileByNickname(nickname);
        setProfileData(response.data);
        setNewInfo(response.data.info || "");
        setError(null);
        setIsFollowing(response.data.following);

        const loggedInUserId = localStorage.getItem("userId");
        const isOwn = loggedInUserId === response.data.userId.toString();
        setIsOwnProfile(isOwn);

        setAllPlans(response.data.planList || []);
        const initialPlans = response.data.planList.slice(0, plansPerPage);
        setDisplayedPlans(initialPlans);
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

  // 메인 - 추가 플랜을 로드하는 함수 (타 사용자)
  const loadMorePlans = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 1100)); // 1.1초 지연

    const startIndex = displayedPlans.length;
    const endIndex = startIndex + plansPerPage;
    const newPlans = allPlans.slice(startIndex, endIndex);

    if (newPlans.length > 0) {
      setDisplayedPlans((prevPlans) => [...prevPlans, ...newPlans]);
      setHasMore(endIndex < allPlans.length);
    } else {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [displayedPlans, hasMore, isLoadingMore, allPlans]);

  // 메인 - Intersection Observer 콜백 함수
  const lastPlanElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePlans();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, isLoadingMore, hasMore, loadMorePlans]
  );

  // 여행 더보기 - 추가 플랜을 로드하는 함수
  const loadMoreFullList = useCallback(async () => {
    if (isLoadingFullList || !hasMoreFullList) return;

    setIsLoadingFullList(true);
    await new Promise((resolve) => setTimeout(resolve, 1100)); // 1.1초 지연

    const startIndex = displayedFullTripList.length;
    const endIndex = startIndex + plansPerPage;
    const newPlans = allFullTripList.slice(startIndex, endIndex);

    if (newPlans.length > 0) {
      setDisplayedFullTripList((prevTrips) => [...prevTrips, ...newPlans]);
      setHasMoreFullList(endIndex < allFullTripList.length);
    } else {
      setHasMoreFullList(false);
    }

    setIsLoadingFullList(false);
  }, [
    displayedFullTripList,
    allFullTripList,
    isLoadingFullList,
    hasMoreFullList,
  ]);

  // 여행 더보기 - 옵저버
  const lastFullListElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingFullList) return;
      if (fullListObserver.current) fullListObserver.current.disconnect();

      fullListObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFullList) {
          loadMoreFullList();
        }
      });
      if (node) fullListObserver.current.observe(node);
    },
    [isLoading, isLoadingFullList, hasMoreFullList, loadMoreFullList]
  );

  // 댓글 더보기 - 추가 댓글을 로드하는 함수
  const loadMoreComments = useCallback(async () => {
    if (isLoadingComments || !hasMoreComments) return;

    setIsLoadingComments(true);
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const startIndex = displayedComments.length;
    const endIndex = startIndex + commentsPerPage;
    const newComments = allComments.slice(startIndex, endIndex);

    if (newComments.length > 0) {
      setDisplayedComments((prevComments) => [...prevComments, ...newComments]);
      setHasMoreComments(endIndex < allComments.length);
    } else {
      setHasMoreComments(false);
    }

    setIsLoadingComments(false);
  }, [displayedComments, allComments, isLoadingComments, hasMoreComments]);

  // 댓글 더보기 - 옵저버
  const lastCommentElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingComments) return;
      if (commentsObserver.current) commentsObserver.current.disconnect();

      commentsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreComments) {
          loadMoreComments();
        }
      });
      if (node) commentsObserver.current.observe(node);
    },
    [isLoading, isLoadingComments, hasMoreComments, loadMoreComments]
  );

  // 개인 정보 수정
  const handleEditClick = () =>
    navigate(`/mypage/${profileData.nickname}/profile`);
  // 소개글 수정
  const handleInfoEdit = () => setIsEditingInfo(true);
  // 소개글 변화
  const handleInfoChange = (e) => {
    const text = e.target.value;
    if (text.length <= 160) setNewInfo(text);
  };

  // 소개글 변화 저장
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

  // 팔로우, 팔로잉 토글
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

  // 각 플랜 클릭 시
  const handlePlanClick = (planId) => navigate(`/plan/${planId}/details`);

  // 여행, 좋아요, 북마크 더보기 제어
  const handleSeeMore = async (type) => {
    if (!profileData) return;

    setCurrentView(type);
    setIsLoadingFullList(true);
    setAllFullTripList([]);
    setDisplayedFullTripList([]);
    setHasMoreFullList(true);

    try {
      let response;
      switch (type) {
        case "my-trips":
          response = await getAllMyPlans(profileData.userId);
          break;
        case "bookmarked":
          response = await getAllBookmarkedPlans(profileData.userId);
          break;
        case "liked":
          response = await getAllLikedPlans(profileData.userId);
          break;
        default:
          throw new Error("Invalid list type");
      }
      setAllFullTripList(response.data);
      setDisplayedFullTripList(response.data.slice(0, plansPerPage));
      setHasMoreFullList(response.data.length > plansPerPage);
    } catch (error) {
      console.error("Error fetching full trip list: ", error);
    } finally {
      setIsLoadingFullList(false);
    }
  };

  // 댓글 더보기 제어
  const handleSeeMoreComments = async () => {
    if (!profileData) return;

    setCurrentView("comments");
    setIsLoadingComments(true);
    setAllComments([]);
    setDisplayedComments([]);
    setHasMoreComments(true);

    try {
      const response = await getAllCommentedPlans(profileData.userId);
      setAllComments(response.data);
      setDisplayedComments(response.data.slice(0, commentsPerPage));
      setHasMoreComments(response.data.length > commentsPerPage);
    } catch (error) {
      console.error("Error fetching all comments: ", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error)
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );
  if (!profileData)
    return <div>사용자 정보를 불러오는 중 오류가 발생했습니다.</div>;

  // 메인 렌더링
  const renderTripSection = (title, trips, emptyMessage, type) => (
    <div className={styles.tripSection}>
      <div className={styles.sectionTitle}>
        <h2>{title}</h2>
        {isOwnProfile && trips && trips.length > 0 && (
          <span onClick={() => handleSeeMore(type)}>
            <SlArrowRight />
          </span>
        )}
      </div>
      {trips && trips.length > 0 ? (
        <div className={styles.tripGrid}>
          {trips.map((trip, index) => (
            <div
              key={`${trip.planId}-${index}`}
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
      {isLoadingMore && (
        <div className={styles.loadingSpinner}>
          <AiOutlineLoading3Quarters className={styles.spinnerIcon} />
        </div>
      )}
    </div>
  );

  // 여행 더보기 렌더링
  const renderFullTripList = () => (
    <div className={styles.tripSection}>
      <div className={styles.sectionTitle}>
        <h2>
          {profileData.nickname}님의{" "}
          {currentView === "my-trips"
            ? "모든 여행"
            : currentView === "bookmarked"
            ? "북마크한 여행"
            : "좋아요한 여행"}
        </h2>
        <span onClick={() => setCurrentView("overview")}>뒤로 가기</span>
      </div>
      {displayedFullTripList.length > 0 ? (
        <div className={styles.tripGrid}>
          {displayedFullTripList.map((trip, index) => (
            <div
              key={`${trip.planId}-${index}`}
              ref={
                index === displayedFullTripList.length - 1
                  ? lastFullListElementRef
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
        <p className={styles.emptyMessage}>표시할 여행이 없습니다.</p>
      )}
      {isLoadingFullList && (
        <div className={styles.loadingSpinner}>
          <AiOutlineLoading3Quarters className={styles.spinnerIcon} />
        </div>
      )}
    </div>
  );

  // 댓글 부분 렌더링 (메인 화면)
  const renderCommentSection = (comments) => (
    <div className={styles.commentSection}>
      <div className={styles.sectionTitle}>
        <h2>{profileData.nickname}님의 댓글</h2>
        {comments && comments.length > 0 && (
          <span onClick={handleSeeMoreComments}>
            <SlArrowRight />
          </span>
        )}
      </div>
      {comments && comments.length > 0 ? (
        <div className={styles.commentGrid}>
          {comments.slice(0, 4).map((comment, index) => (
            <div
              key={index}
              className={styles.commentItem}
              onClick={() => handlePlanClick(comment.planId)}
            >
              <img
                src={travelImage}
                alt="Trip thumbnail"
                className={styles.commentImage}
              />
              <div className={styles.commentContent}>
                <h3 className={styles.commentTitle}>{comment.title}</h3>
                <p className={styles.commentLocation}>{comment.location}</p>
                <p className={styles.commentText}>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>작성한 댓글이 없습니다.</p>
      )}
    </div>
  );

  // 댓글 더보기 렌더링
  const renderFullCommentList = () => (
    <div className={styles.tripSection}>
      <div className={styles.sectionTitle}>
        <h2>{profileData.nickname}님의 모든 댓글</h2>
        <span onClick={() => setCurrentView("overview")}>뒤로 가기</span>
      </div>
      {displayedComments.length > 0 ? (
        <div className={styles.commentGrid}>
          {displayedComments.map((comment, index) => (
            <div
              key={`${comment.planId}-${index}`}
              ref={
                index === displayedComments.length - 1
                  ? lastCommentElementRef
                  : null
              }
              className={styles.commentItem}
              onClick={() => handlePlanClick(comment.planId)}
            >
              <img
                src={travelImage}
                alt="Trip thumbnail"
                className={styles.commentImage}
              />
              <div className={styles.commentContent}>
                <h3 className={styles.commentTitle}>{comment.title}</h3>
                <p className={styles.commentLocation}>{comment.location}</p>
                <p className={styles.commentText}>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>작성한 댓글이 없습니다.</p>
      )}
      {isLoadingComments && (
        <div className={styles.loadingSpinner}>
          <AiOutlineLoading3Quarters className={styles.spinnerIcon} />
        </div>
      )}
    </div>
  );

  // 메인 JSX
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

      {currentView === "overview" ? (
        <>
          {renderTripSection(
            `${profileData.nickname}님의 여행`,
            displayedPlans,
            "계획한 여행이 없습니다.",
            "my-trips"
          )}

          {isOwnProfile && (
            <>
              {renderTripSection(
                `${profileData.nickname}님이 북마크한 여행`,
                profileData.recentBookmarks,
                "북마크한 여행이 없습니다.",
                "bookmarked"
              )}
              {renderTripSection(
                `${profileData.nickname}님이 좋아요한 여행`,
                profileData.recentLikes,
                "좋아요한 여행이 없습니다.",
                "liked"
              )}
              {renderCommentSection(profileData.recentComments)}
            </>
          )}
        </>
      ) : currentView === "comments" ? (
        renderFullCommentList()
      ) : (
        renderFullTripList()
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
