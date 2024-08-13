import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookmarkPlan, cancelBookmark, cancelLike, checkIsBookmarked, CheckIsLiked, likePlan, getPlan } from "../../service/PlanService";

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
        return checkIsBookmarked(planId, userId);
      })
      .then((bookmarkResponse) => {
        setIsBookmarked(bookmarkResponse.data);

        return CheckIsLiked(planId, userId);
      })
      .then((likeResponse) => {
        setIsLiked(likeResponse.data);
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
    <div>
      <h1>{plan.title}</h1>
      <p>Location: {plan.location}</p>
      <p>Description: {plan.description}</p>
      <p>Dates: {plan.startDate} to {plan.endDate}</p>
      <p>Total Budget: {plan.totalBudget}</p>
      <p>Public: {plan.isPublic ? "Yes" : "No"}</p>
      <p>Status: {plan.status ? "Active" : "Inactive"}</p>
      <p>Created by: {plan.planUserNickname}</p>
      <p>Bookmarks: {bookmarkNumber}</p>
      <button onClick={handleBookmarkClick}>
        {isBookmarked ? "북마크 취소" : "북마크"}
      </button>
      <p>Likes: {likeNumber}</p>
      <button onClick={handleLikeClick}>
        {isLiked ? "좋아요 취소" : "좋아요"}
      </button>
      {/* {isLiked ? (<FaRegBookmark onClick={handleLikeClick}/>) : (<FaBookmark onClick={handleLikeClick}/>)} */}
      <h2>Schedule</h2>
      {plan.scheduleList && plan.scheduleList.length > 0 ? (
        <ul>
          {/* {plan.scheduleList.map((schedule, index) => (
            <li key={schedule.scheduleId}>
              <h3>Day {schedule.travelDayCount}</h3>
              <p>Description: {schedule.description}</p>
              <p>Status: {schedule.status ? "Completed" : "Pending"}</p>
            </li>
          ))} */}
        </ul>
      ) : (
        <p>No schedule available.</p>
      )}

      {/* <h2>Comments</h2>
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