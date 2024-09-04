import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  cancelFollowing,
  doFollowing,
  getUserProfileByNickname,
  updateUserInfo,
  getAllMyPlans,
  getAllRecruitmentPlans,
  getAllBookmarkedPlans,
  getAllLikedPlans,
  getAllCommentedPlans,
  uploadProfileImage,
} from "../../service/MyPageService";
import FollowModal from "./FollowModal";

import { FaRegBookmark, FaRegHeart, FaCamera } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import { DiAptana } from "react-icons/di";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GoPerson } from "react-icons/go";

import styles from "./MyPage.module.css";
import gridStyles from "../plan/TripGrid.module.css";

import travelImage from "../../../image/travel.png";
import profileImage from "../../../image/user_profile_icon.png";
import defaultThumbnail from "../../../image/thumbnail.png";

// 파일 크기 및 형식 제한을 위한 유틸리티
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

const isFileSizeValid = (file) => {
  return file.size <= MAX_FILE_SIZE;
};

const isFileTypeValid = (file) => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

function MyPage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { nickname } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = searchParams.get("view") || "overview";
  const [currentView, setCurrentView] = useState(initialView);
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
  const plansPerPage = 12; // 한 번에 로드할 플랜 수

  // 팔로우, 팔로잉 모달 상태
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [isFollowingModal, setIsFollowingModal] = useState(true);

  // 여행 더보기 섹션
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

  // 프로필 이미지 입력을 위한 상태
  const fileInputRef = useRef(null);

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

        // 여기서 currentView에 따라 추가 데이터를 로드합니다
        if (currentView !== "overview") {
          await loadViewData(currentView, response.data.userId);
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [nickname, currentView]);

  useEffect(() => {
    const view = searchParams.get("view") || "overview";
    setCurrentView(view);
    if (view !== "overview") {
      loadViewData(view, profileData?.userId);
    }
  }, [searchParams, profileData]);

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

  // 더보기 view 상태에 따라 데이터 요청해서 불러오기
  const loadViewData = async (view, userId) => {
    setIsLoadingFullList(true);
    setAllFullTripList([]);
    setDisplayedFullTripList([]);
    setHasMoreFullList(true);

    try {
      let response;
      switch (view) {
        case "my-trips":
          response = await getAllMyPlans(userId);
          break;
        case "my-recruitment":
          response = await getAllRecruitmentPlans(userId);
          break;
        case "bookmarked":
          response = await getAllBookmarkedPlans(userId);
          break;
        case "liked":
          response = await getAllLikedPlans(userId);
          break;
        case "comments":
          response = await getAllCommentedPlans(userId);
          setAllComments(response.data);
          setDisplayedComments(response.data.slice(0, commentsPerPage));
          setHasMoreComments(response.data.length > commentsPerPage);
          return;
        default:
          throw new Error("Invalid view type");
      }
      setAllFullTripList(response.data);
      setDisplayedFullTripList(response.data.slice(0, plansPerPage));
      setHasMoreFullList(response.data.length > plansPerPage);
    } catch (error) {
      console.error(`Error fetching ${view} data:`, error);
    } finally {
      setIsLoadingFullList(false);
    }
  };

  // 여행, 좋아요, 북마크 더보기 제어
  const handleSeeMore = useCallback(
    (type) => {
      if (!profileData) return;
      setSearchParams({ view: type });
    },
    [profileData, setSearchParams]
  );

  // 댓글 더보기 제어
  const handleSeeMoreComments = useCallback(() => {
    if (!profileData) return;
    setSearchParams({ view: "comments" });
  }, [profileData, setSearchParams]);

  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isFileSizeValid(file)) {
        alert("이미지는 최대 5MB까지 업로드할 수 있습니다.");
        return;
      }
      if (!isFileTypeValid(file)) {
        alert(
          "지원하지 않는 파일 형식입니다. JPEG, JPG, PNG, GIF 형식의 이미지만 업로드 가능합니다."
        );
        return;
      }

      try {
        const response = await uploadProfileImage(profileData.userId, file);
        if (response.success) {
          setProfileData((prevData) => ({
            ...prevData,
            profileImageUrl: response.data.profileImageUrl,
          }));
          alert(response.message);
        } else {
          alert(response.message || "프로필 이미지 업로드에 실패했습니다.");
        }
      } catch (error) {
        console.error("프로필 이미지 업로드 중 오류 발생: ", error.message);
        alert("프로필 이미지 업로드 중 오류가 발생했습니다.");
      }
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
        <div className={gridStyles.tripGrid}>
          {trips.map((trip, index) => (
            <div
              key={`${trip.planId}-${index}`}
              ref={
                !isOwnProfile && index === trips.length - 1
                  ? lastPlanElementRef
                  : null
              }
              className={gridStyles.tripCard}
              onClick={() => handlePlanClick(trip.planId)}
            >
              <img
                src={trip.planThumbnailUrl || defaultThumbnail}
                alt={trip.title}
                className={gridStyles.tripImage}
              />
              <p className={gridStyles.location}>{trip.location}</p>
              <h2 className={gridStyles.planTitle}>{trip.title}</h2>
              <p className={gridStyles.description}>{trip.description}</p>
              <p className={gridStyles.dates}>
                {trip.startDate} ~ {trip.endDate}
              </p>
              <div className={gridStyles.tripFooter}>
                <div className={gridStyles.tripStats}>
                  <span className={gridStyles.bookmarks}>
                    <FaRegBookmark /> {trip.bookmarkNumber}
                  </span>
                  <span className={gridStyles.likes}>
                    <FaRegHeart /> {trip.likeNumber}
                  </span>
                  {!(trip.participantsCount === null) && (
                    <span className={gridStyles.participants}>
                      <GoPerson className={gridStyles.participant} />{" "}
                      {trip.planUserCount}/{trip.participantsCount}
                    </span>
                  )}
                </div>
                <span className={gridStyles.planUserNickname}>
                  {trip.planUserNickname}님의 여행 일정
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={gridStyles.emptyMessage}>{emptyMessage}</p>
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
          {currentView === "my-recruitment" ? (
            "모집 중인 여행"
          ) : (
            <>
              {profileData.nickname}님의{" "}
              {currentView === "my-trips"
                ? "모든 여행"
                : currentView === "bookmarked"
                ? "북마크한 여행"
                : "좋아요한 여행"}
            </>
          )}
        </h2>
        <span onClick={() => setSearchParams({})}>뒤로 가기</span>
      </div>
      {displayedFullTripList.length > 0 ? (
        <div className={gridStyles.tripGrid}>
          {displayedFullTripList.map((trip, index) => (
            <div
              key={`${trip.planId}-${index}`}
              ref={
                index === displayedFullTripList.length - 1
                  ? lastFullListElementRef
                  : null
              }
              className={gridStyles.tripCard}
              onClick={() => handlePlanClick(trip.planId)}
            >
              <img
                src={trip.planThumbnailUrl || defaultThumbnail}
                alt={trip.title}
                className={gridStyles.tripImage}
              />
              <p className={gridStyles.location}>{trip.location}</p>
              <h2 className={gridStyles.planTitle}>{trip.title}</h2>
              <p className={gridStyles.description}>{trip.description}</p>
              <p className={gridStyles.dates}>
                {trip.startDate} ~ {trip.endDate}
              </p>
              <div className={gridStyles.tripFooter}>
                <div className={gridStyles.tripStats}>
                  <span className={gridStyles.bookmarks}>
                    <FaRegBookmark /> {trip.bookmarkNumber}
                  </span>
                  <span className={gridStyles.likes}>
                    <FaRegHeart /> {trip.likeNumber}
                  </span>
                  {!(trip.participantsCount === null) && (
                    <span className={gridStyles.participants}>
                      <GoPerson className={gridStyles.participant} />{" "}
                      {trip.planUserCount}/{trip.participantsCount}
                    </span>
                  )}
                </div>
                <span className={gridStyles.planUserNickname}>
                  {trip.planUserNickname}님의 여행 일정
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={gridStyles.emptyMessage}>표시할 여행이 없습니다.</p>
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
                src={comment.planThumbnailUrl || defaultThumbnail}
                alt='Trip thumbnail'
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
        <span onClick={() => setSearchParams({})}>뒤로 가기</span>
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
                src={comment.planThumbnailUrl || defaultThumbnail}
                alt='Trip thumbnail'
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
        <div
          className={styles.profileImageContainer}
          onClick={handleProfileImageClick}
        >
          <img
            src={profileData.profileImageUrl || profileImage}
            alt='Profile'
            className={styles.profileImage}
          />
          {isOwnProfile && (
            <div className={styles.profileImageOverlay}>
              <FaCamera className={styles.cameraIcon} />
            </div>
          )}
        </div>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept='image/jpeg,image/jpg,image/png,image/gif'
        />
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
                "모집 중인 여행",
                profileData.recruitingPlans,
                "모집 중인 여행이 없습니다.",
                "my-recruitment"
              )}
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
