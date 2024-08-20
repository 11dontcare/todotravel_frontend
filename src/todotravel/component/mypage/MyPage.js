import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constant/backendAPI";
import { getUserProfileByNickname } from "../../service/MyPageService";

import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import { DiAptana } from "react-icons/di";

import styles from "./MyPage.module.css";

import travelImage from "../../../image/travel.png";
import profileImage from "../../../image/user_profile_icon.png";

function MyPage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { nickname } = useParams(); // URL에서 nickname 추출

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getUserProfileByNickname(nickname);
        setProfileData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching profile data: ", error);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [nickname]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div>
        <p>존재하지 않는 사용자입니다.</p>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );
  }

  const handleEditClick = () => {
    navigate(`/mypage/${profileData.nickname}/profile`);
  };

  const handlePlanClick = (planId) => {
    navigate(`/plan/${planId}/details`);
  };

  const renderTripSection = (title, trips) => (
    <div className={styles.tripSection}>
      <div className={styles.sectionTitle}>
        <h2>{title}</h2>
        <span>
          <SlArrowRight />
        </span>
      </div>
      <div className={styles.tripGrid}>
        {trips.slice(0, 3).map((trip, index) => (
          <div
            key={index}
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
    </div>
  );

  const renderCommentSection = (comments) => (
    <div className={styles.commentSection}>
      <div className={styles.sectionTitle}>
        <h2>{profileData.nickname}님의 댓글</h2>
        <span>
          <SlArrowRight />
        </span>
      </div>
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
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <img src={profileImage} alt="Profile" className={styles.profileImage} />
        <div className={styles.profileContent}>
          <div className={styles.profileSection}>
            <div className={styles.profileInfo}>
              <h1>{profileData.nickname}님의 MY PAGE</h1>
              <p>
                만 {profileData.age}세,{" "}
                {profileData.gender === "MAN" ? "남성" : "여성"}
              </p>
              <p>현재 작성된 소개글이 없습니다.</p>
            </div>
          </div>
          <div className={styles.statsSection}>
            <div className={styles.statItem}>
              <p>{profileData.planCount}</p>
              <p>여행 수</p>
            </div>
            <div className={styles.statItem}>
              <p>{profileData.followerCount}</p>
              <p>팔로워</p>
            </div>
            <div className={styles.statItem}>
              <p>{profileData.followingCount}</p>
              <p>팔로잉</p>
            </div>
          </div>
        </div>
        <div className={styles.editButton} onClick={handleEditClick}>
          <DiAptana />
        </div>
      </div>

      {renderTripSection(
        `${profileData.nickname}님의 여행`,
        profileData.planList
      )}

      {profileData.recentBookmarks &&
        renderTripSection(
          `${profileData.nickname}님이 북마크한 여행`,
          profileData.recentBookmarks
        )}

      {profileData.recentLikes &&
        renderTripSection(
          `${profileData.nickname}님이 좋아요한 여행`,
          profileData.recentLikes
        )}

      {profileData.recentComments &&
        renderCommentSection(profileData.recentComments)}
    </div>
  );
}

export default MyPage;
