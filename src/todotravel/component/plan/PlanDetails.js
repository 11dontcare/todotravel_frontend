import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookmarkPlan, cancelBookmark, cancelLike, checkIsBookmarked, checkIsLiked, likePlan, getPlan } from "../../service/PlanService";

import styles from './PlanDetails.module.css';

import { FaBookmark } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

const PlanDetails = () => {
  const navigate = useNavigate();

  const { planId } = useParams();
  const userId = localStorage.getItem("userId");

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [bookmarkNumber, setBookmarkNumber] = useState(0);
  const [likeNumber, setLikeNumber] = useState(0);

  const [plan, setPlan] = useState();
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = () => {
    getPlan(planId)
      .then((response) => {
        console.log(response);
        setPlan(response.data);
        setBookmarkNumber(response.data.bookmarkNumber);
        setLikeNumber(response.data.likeNumber);
        setLoading(false);

        // 플랜 정보 가져온 후 북마크 상태도 확인
        if (userId) { // userId가 null이 아닐 때만 실행
          return checkIsBookmarked(planId, userId);
        } else {
          return Promise.resolve(null); // userId가 null이면 다음 then 블록으로 바로 넘어가도록 함
        }
      })
      .then((bookmarkResponse) => {
        if (bookmarkResponse) {
          setIsBookmarked(bookmarkResponse.data);
        }
  
        if (userId) { // userId가 null이 아닐 때만 실행
          return checkIsLiked(planId, userId);
        } else {
          return Promise.resolve(null); // userId가 null이면 다음 then 블록으로 바로 넘어가도록 함
        }
      })
      .then((likeResponse) => {
        if (likeResponse) {
          setIsLiked(likeResponse.data);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        alert("플랜 정보 조회에 실패했습니다");
      });
  };

  const handleBookmarkClick = () => {
    if (isBookmarked) {
      // 북마크가 이미 되어있다면 북마크를 취소합니다.
      cancelBookmark(planId, userId)
        .then(() => {
          setIsBookmarked(false);
          setBookmarkNumber(bookmarkNumber - 1);
          alert("북마크가 취소되었습니다.");
        })
        .catch((error) => {
          console.error("북마크 취소에 실패했습니다.", error);
        });
    } else {
      // 북마크가 안 되어있다면 북마크를 추가합니다.
      bookmarkPlan(planId, userId)
        .then(() => {
          setIsBookmarked(true);
          setBookmarkNumber(bookmarkNumber + 1);
          alert("북마크가 추가되었습니다.");
        })
        .catch((error) => {
          console.error("북마크 추가에 실패했습니다.", error);
        });
    }
  };

  const handleLikeClick = () => {
    if (isLiked) {
      // 좋아요가 이미 되어있다면 취소합니다.
      cancelLike(planId, userId)
        .then(() => {
          setIsLiked(false);
          setLikeNumber(likeNumber - 1);
          alert("좋아요가 취소되었습니다.");
        })
        .catch((error) => {
          console.error("좋아요 취소에 실패했습니다.", error);
        });
    } else {
      // 좋아요가 안 되어있다면 추가합니다.
      likePlan(planId, userId)
        .then(() => {
          setIsLiked(true);
          setLikeNumber(likeNumber + 1);
          alert("좋아요가 추가되었습니다.");
        })
        .catch((error) => {
          console.error("좋아요 추가에 실패했습니다.", error);
        });
    }
  };

  if (loading) {
    return <p>Loading...</p>; // 데이터 로딩 중일 때 표시
  }

  if (!plan) {
    return <p>No plan found.</p>; // 데이터가 없을 때 표시
  }

  return (
    <div className={styles.planContainer}>
      <div className={styles.planHeader}>
        <div className={styles.planDetail}>
          <h1 className={styles.planTitle}>{plan.title}</h1>
          <div className={styles.planInfo}>
            <p className={styles.planDates}>{plan.startDate} ~ {plan.endDate}</p>
            {/* <p className={styles.planPublic}>Public: {plan.isPublic ? "Yes" : "No"}</p> */}
            <p
              className={`${styles.planStatus} ${plan.status ? styles.activeStatus : styles.inactiveStatus}`}
            >
              {plan.status ? "여행 후" : "여행 전"}
            </p>
          </div>
          <p className={styles.planCreator}>{plan.planUserNickname}님의 여행</p>
        </div>
        <div className={styles.planActions}>
          <div className={styles.bookmarkLikeContainer}>
            <div className={styles.bookmarkSection}>
              <button className={styles.bookmarkButton} onClick={handleBookmarkClick}>
                {isBookmarked ? "북마크 취소" : "북마크"}
              </button> <p className={styles.bookmarkCount}> {bookmarkNumber}</p>
            </div>
            <div className={styles.likeSection}>
              <button className={styles.likeButton} onClick={handleLikeClick}>
                {isLiked ? "좋아요 취소" : "좋아요"}
              </button> <p className={styles.likeCount}> {likeNumber}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.planDetails}>
        <p className={styles.planDescription}>여행 이렇게 가보면 어때요??{plan.description}</p>
        {/* <p className={styles.planLocation}>지역: {plan.location}</p> */}
        {/* <p className={styles.planBudget}>총 예산: {plan.totalBudget}</p> */}
      </div>

      {/* {isLiked ? (<FaRegBookmark onClick={handleLikeClick}/>) : (<FaBookmark onClick={handleLikeClick}/>)} */}
      {/* <h2>Schedule</h2>
      {plan.scheduleList && plan.scheduleList.length > 0 ? (
        <ul>
          {plan.scheduleList.map((schedule, index) => (
            <li key={schedule.scheduleId}>
              <h3>Day {schedule.travelDayCount}</h3>
              <p>Description: {schedule.description}</p>
              <p>Status: {schedule.status ? "Completed" : "Pending"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No schedule available.</p>
      )}

      <h2>Comments</h2>
      {plan.commentList && plan.commentList.length > 0 ? (
        <ul>
          {plan.commentList.map((comment, index) => (
            <li key={index}>
              <strong>{comment.userNickname}:</strong> {comment.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments available.</p>
      )} */}
    </div>
  );
};

export default PlanDetails;