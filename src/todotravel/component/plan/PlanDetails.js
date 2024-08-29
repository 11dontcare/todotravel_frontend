import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookmarkPlan, cancelBookmark, cancelLike, checkIsBookmarked, checkIsLiked, likePlan, getPlan, deletePlan, loadPlan, createComment, updateComment, deleteComment, isUserInPlan } from "../../service/PlanService";

import styles from './PlanDetails.module.css';

import { FaBookmark } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { BiComment } from "react-icons/bi";


const PlanDetails = () => {
  const navigate = useNavigate();

  const { planId } = useParams();
  const userId = localStorage.getItem("userId");

  const [existsUserInPlan, setExistsUserInPlan] = useState(null);
  const [isPublic, setIsPublic] = useState(null);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [bookmarkNumber, setBookmarkNumber] = useState(0);
  const [likeNumber, setLikeNumber] = useState(0);

  const [plan, setPlan] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 상태
  const [newComment, setNewComment] = useState(''); // 새로운 댓글 입력 상태
  
  const [loading, setLoading] = useState(true); // 로딩 상태

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = () => {
    getPlan(planId)
      .then((response) => {
        console.log(response);
        setPlan(response.data);
        setIsPublic(response.data.isPublic);
        setComments(response.data.commentList || []); // 댓글 상태 초기화
        setBookmarkNumber(response.data.bookmarkNumber);
        setLikeNumber(response.data.likeNumber);

        if (userId) { // userId가 null이 아닐 때만 실행
          return isUserInPlan(planId, userId);
        } else {
          return Promise.resolve(null); // userId가 null이면 다음 then 블록으로 바로 넘어가도록 함
        }
      })
      .then((existResponse) => {
        if(existResponse){
          setExistsUserInPlan(existResponse.data);
          console.log(existResponse);
        }
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

  useEffect(() => {
    if(isPublic !== null && existsUserInPlan !== null){
      if(!isPublic && !existsUserInPlan){
        alert("접근 권한이 없습니다.");
        navigate("/");
      }
    }
  }, [isPublic, existsUserInPlan, navigate]);

  if (loading) {
    return <p>Loading...</p>; // 데이터 로딩 중일 때 표시
  }

  if (!plan) {
    return <p>플랜을 찾을 수 없습니다.</p>; // 데이터가 없을 때 표시
  }

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

  // 버튼 클릭 시 상태 변경
  const toggleMoreOptions = () => {
    setIsMoreOpen(!isMoreOpen);
  };

  const handleOptionClick = (option) => {
    console.log(`${option} clicked!`);
    // 원하는 로직 추가
    if (option === 'copyPlan'){
      loadPlan(planId)
          .then((response) => {
            console.log(response);
            alert("플랜 불러오기 성공");
            navigate("/plan/" + response.data);
          })
          .catch((e) => {
            console.log(e);
            alert("플랜 불러오기를 실패했습니다. 다시 시도해주세요.");
          })
    }
    else if (option === 'modifyPlan'){
      navigate("/plan/" + planId);
    }
    else {
      if(window.confirm("플랜을 삭제하시겠습니까?")){
        deletePlan(planId)
          .then(() => {
            alert("플랜이 삭제되었습니다.");
            navigate("/");
          })
          .catch((e) => {
            console.log(e);
            alert("플랜 삭제에 실패했습니다. 다시 시도해주세요.");
          })
      }
    }
    setIsMoreOpen(false); // 옵션 클릭 후 메뉴 닫기
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
  
    if (newComment.trim() === '') return;
  
    const newCommentObject = {
      nickname: localStorage.getItem("nickname"),
      content: newComment,
      beforeTravel: true,
    };
  
    // 서버에 새로운 댓글 추가 요청
    createComment(planId, userId, newCommentObject)
      .then((response) => {
        const addedComment = response.data; // 서버에서 반환된 추가된 댓글

        alert("댓글이 등록되었습니다.");

        // 기존 댓글 리스트에 새로운 댓글 추가
        setComments([...comments, addedComment]);
        setNewComment(''); // 입력 필드 초기화
      })
      .catch((e) => {
        console.log(e);
        alert("댓글 등록에 실패했습니다");
      });
  };

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
              <button className={styles.button} onClick={handleBookmarkClick}>
                {isBookmarked ? <FaBookmark/> : <FaRegBookmark/>}
              </button> <p className={styles.count}> {bookmarkNumber}</p>
            </div>
            <div className={styles.likeSection}>
              <button className={styles.likeButton} onClick={handleLikeClick}>
                {isLiked ? <FaHeart style={{color: 'red', fontSize: '17px'}}/> : <FaRegHeart style={{fontSize: '17px'}}/>}
              </button> <p className={styles.count}> {likeNumber}</p>
            </div>
            <div className={styles.button}>
              <BiComment style={{fontSize: '18px'}}/>
              <p className={styles.count}> {comments.length}</p>
            </div>
            <div className={styles.button} onClick={toggleMoreOptions}><FiMoreVertical style={{fontSize: '18px'}}/></div>
            {/* 더보기 창 */}
              {isMoreOpen && (
                <div className={styles.moreOptions}>
                  <ul>
                    <li onClick={() => handleOptionClick('copyPlan')}>불러오기</li>
                    {existsUserInPlan && (
                    <li onClick={() => handleOptionClick('modifyPlan')}>수정하기</li>
                    )}
                    {existsUserInPlan && (
                    <li onClick={() => handleOptionClick('deletePlan')}>삭제하기</li>
                    )}
                    {/* {(plan.planUserId === userId) && (
                    <li onClick={() => handleOptionClick('deletePlan')}>모집하기</li>
                    )} */}
                  </ul>
                </div>
              )}
          </div>
        </div>
      </div>
      <div className={styles.planDetails}>
        <p className={styles.planDescription}>여행 이렇게 가보면 어때요??{plan.description}</p>
        {/* <p className={styles.planLocation}>지역: {plan.location}</p> */}
        {/* <p className={styles.planBudget}>총 예산: {plan.totalBudget}</p> */}
      </div>

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
      )} */}
      <div className={styles.commentsSection}>
        <h3>댓글 {comments.length}</h3>
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <textarea
            className={styles.commentInput}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력해주세요..."
          ></textarea>
          <button type="submit" className={styles.commentButton}>등록</button>
        </form>
        {plan.commentList && plan.commentList.length > 0 ? (
          <ul className={styles.commentList}>
            {comments.map((comment, index) => (
              <li key={index} className={styles.commentItem}>
                <strong>{comment.nickname} 님</strong>
                <p>{comment.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noComments}>등록된 댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PlanDetails;