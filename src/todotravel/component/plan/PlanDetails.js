import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  bookmarkPlan,
  cancelBookmark,
  cancelLike,
  checkIsBookmarked,
  checkIsLiked,
  likePlan,
  getPlan,
  deletePlan,
  loadPlan,
  createComment,
  updateComment,
  deleteComment,
  isUserInPlan,
  recruitmentPlan,
  cancelRecruitment,
  requestRecruit,
} from "../../service/PlanService";

import styles from "./PlanDetails.module.css";

import { FaBookmark } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { BiComment } from "react-icons/bi";

import RecruitModal from "./RecruitModal";


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
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [beforeTravel, setBeforeTravel] = useState(false);

  const [loading, setLoading] = useState(true); // 로딩 상태

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreOptionsRef = useRef(null);

  const [isRecruitModalOpen, setRecruitModalOpen] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(e.target)
      ) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

        if (userId) {
          // userId가 null이 아닐 때만 실행
          return isUserInPlan(planId, userId);
        } else {
          return Promise.resolve(null); // userId가 null이면 다음 then 블록으로 바로 넘어가도록 함
        }
      })
      .then((existResponse) => {
        if (existResponse) {
          setExistsUserInPlan(existResponse.data);
          console.log(existResponse);
        }
        setLoading(false);

        // 플랜 정보 가져온 후 북마크 상태도 확인
        if (userId) {
          // userId가 null이 아닐 때만 실행
          return checkIsBookmarked(planId, userId);
        } else {
          return Promise.resolve(null); // userId가 null이면 다음 then 블록으로 바로 넘어가도록 함
        }
      })
      .then((bookmarkResponse) => {
        if (bookmarkResponse) {
          setIsBookmarked(bookmarkResponse.data);
        }

        if (userId) {
          // userId가 null이 아닐 때만 실행
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
    if (isPublic !== null && existsUserInPlan !== null) {
      if (!isPublic && !existsUserInPlan) {
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
    if (option === "copyPlan") {
      loadPlan(planId)
        .then((response) => {
          console.log(response);
          alert("플랜 불러오기 성공");
          navigate("/plan/" + response.data);
        })
        .catch((e) => {
          console.log(e);
          alert("플랜 불러오기를 실패했습니다. 다시 시도해주세요.");
        });
    } else if (option === "modifyPlan") {
      navigate("/plan/" + planId);
    }
    else if (option === 'deletePlan'){
      if(window.confirm("플랜을 삭제하시겠습니까?")){
        deletePlan(planId)
          .then(() => {
            alert("플랜이 삭제되었습니다.");
            navigate("/");
          })
          .catch((e) => {
            console.log(e);
            alert("플랜 삭제에 실패했습니다. 다시 시도해주세요.");
          });
      }
    }
    else if (option === 'recruitPlan'){
      //participantsCount 입력 받음
      setRecruitModalOpen(true);
    }
    else if (option === 'cancelRecruit'){
      cancelRecruitment(planId)
          .then((response) => {
            console.log(response);
            alert("플랜 모집이 취소되었습니다.");
            navigate("/plan/" + planId);
          })
          .catch((e) => {
            console.log(e);
            alert("플랜 모집 취소를 실패했습니다. 다시 시도해주세요.");
          })
    }
    setIsMoreOpen(false); // 옵션 클릭 후 메뉴 닫기
  };

  const handleRecruit = (participantsCount) => {
    recruitmentPlan(planId, participantsCount)
        .then((response) => {
          console.log(response);
          alert("플랜이 모집글로 변경되었습니다.");
          navigate("/plan/" + planId);
        }).catch((e) => {
          console.log(e);
          alert("플랜 모집글 변경에 실패했습니다.")
        })
  };

  const handleRecruitClick = () => {
    requestRecruit(planId, userId)
        .then((response) => {
          console.log(response);
          alert("플랜 참가 요청을 보냈습니다.");
          // navigate("/plan/" + planId);
        }).catch((e) => {
          console.log(e);
          alert("플랜 참가 요청에 실패했습니다.");
        })
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (newComment.trim() === "") return;

    const newCommentObject = {
      nickname: localStorage.getItem("nickname"),
      content: newComment,
      beforeTravel: beforeTravel,
    };

    // 서버에 새로운 댓글 추가 요청
    createComment(planId, userId, newCommentObject)
      .then((response) => {
        const addedComment = response.data; // 서버에서 반환된 추가된 댓글

        alert("댓글이 등록되었습니다.");

        // 기존 댓글 리스트에 새로운 댓글 추가
        setComments([...comments, addedComment]);
        setNewComment(""); // 입력 필드 초기화
        setBeforeTravel(false);
      })
      .catch((e) => {
        console.log(e);
        alert("댓글 등록에 실패했습니다");
      });
  };

  // 댓글 수정 핸들러
  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
  };

  // 댓글 수정 업데이트 핸들러
  const handleUpdateComment = (commentId) => {
    const updatedCommentObject = {
      content: editedCommentContent,
      beforeTravel: true,
    };

    updateComment(commentId, updatedCommentObject)
      .then(() => {
        const updatedComments = comments.map((comment) =>
          comment.commentId === commentId
            ? { ...comment, content: editedCommentContent }
            : comment
        );
        setComments(updatedComments);
        setEditingCommentId(null);
        alert("댓글이 수정되었습니다.");
      })
      .catch((e) => {
        console.log(e.message);
        alert("댓글 수정에 실패했습니다.");
      });
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment(commentId)
        .then(() => {
          const filteredComments = comments.filter(
            (comment) => comment.commentId !== commentId
          );
          setComments(filteredComments);
          alert("댓글이 삭제되었습니다.");
        })
        .catch((e) => {
          console.log(e.message);
          alert("댓글 삭제에 실패했습니다.");
        });
    }
  };

  return (
    <div className={styles.planContainer}>
      <div className={styles.planHeader}>
        <div className={styles.planDetail}>
          <h1 className={styles.planTitle}>{plan.title}</h1>
          <div className={styles.planInfo}>
            <p className={styles.planDates}>
              {plan.startDate} ~ {plan.endDate}
            </p>
            {/* <p className={styles.planPublic}>Public: {plan.isPublic ? "Yes" : "No"}</p> */}
            <>
              {plan.recruitment ? (
                <p
                className={`${styles.planStatus} ${(plan.participantsCount > plan.planUserCount) ? styles.activeStatus : styles.inactiveStatus}`}
                >
                  {(plan.participantsCount > plan.planUserCount) ? "모집중" : "모집마감"}
                </p>
              ) : (
                <p
                  className={`${styles.planStatus} ${plan.status ? styles.activeStatus : styles.inactiveStatus}`}
                >
                  {plan.status ? "여행 후" : "여행 전"}
                </p>
              )}
            </>
          </div>
          <p className={styles.planCreator}>{plan.planUserNickname}님의 여행</p>
        </div>
        <div className={styles.planActions}>
          <div className={styles.bookmarkLikeContainer}>
            <div className={styles.bookmarkSection}>
              <button className={styles.button} onClick={handleBookmarkClick}>
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>{" "}
              <p className={styles.count}> {bookmarkNumber}</p>
            </div>
            <div className={styles.likeSection}>
              <button className={styles.likeButton} onClick={handleLikeClick}>
                {isLiked ? (
                  <FaHeart style={{ color: "red", fontSize: "17px" }} />
                ) : (
                  <FaRegHeart style={{ fontSize: "17px" }} />
                )}
              </button>{" "}
              <p className={styles.count}> {likeNumber}</p>
            </div>
            <div className={styles.button}>
              <BiComment style={{ fontSize: "18px" }} />
              <p className={styles.count}> {comments.length}</p>
            </div>
            {/* 더보기 창 */}
            <div
              className={styles.button}
              onClick={toggleMoreOptions}
              ref={moreOptionsRef}
            >
              <FiMoreVertical style={{ fontSize: "18px" }} />
              {isMoreOpen && (
                <div className={styles.moreOptions}>
                  <ul>
                    <li onClick={() => handleOptionClick("copyPlan")}>
                      불러오기
                    </li>
                    {existsUserInPlan && (
                      <li onClick={() => handleOptionClick("modifyPlan")}>
                        수정하기
                      </li>
                    )}
                    {existsUserInPlan && (
                      <li onClick={() => handleOptionClick("deletePlan")}>
                        삭제하기
                      </li>
                    )}
                    {(Number(userId) === plan.planUserId) && (
                      <>
                        {plan.recruitment ? (
                          <li onClick={() => handleOptionClick('cancelRecruit')}>모집 중지</li>
                        ) : (
                          <li onClick={() => handleOptionClick('recruitPlan')}>모집하기</li>
                        )}
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
              <RecruitModal
                isOpen={isRecruitModalOpen}
                onClose={() => setRecruitModalOpen(false)}
                onRecruit={handleRecruit}
              />
          </div>
        </div>
      </div>
      <div className={styles.planDetails}>
        <p className={styles.planDescription}>
          여행 이렇게 가보면 어때요??{plan.description}
        </p>
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
      {(plan.recruitment && !existsUserInPlan && (plan.participantsCount > plan.planUserCount)) && (
        <button onClick={handleRecruitClick}>플랜 참가</button>
      )}
      <div className={styles.commentsSection}>
        <h3>댓글 {comments.length}</h3>
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <textarea
            className={styles.commentInput}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력해주세요..."
          ></textarea>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="beforeTravel"
              checked={beforeTravel}
              onChange={() => setBeforeTravel(!beforeTravel)}
            />
            <label htmlFor="beforeTravel">
              이 루트로 여행을 다녀오신 적이 있나요?
            </label>
          </div>
          <button type="submit" className={styles.commentButton}>
            등록
          </button>
        </form>
        {comments.length > 0 ? (
          <ul className={styles.commentList}>
            {comments.map((comment) => (
              <li key={comment.commentId} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <div className={styles.commentNicknameWrapper}>
                    <strong>{comment.nickname} 님</strong>
                    <span
                      className={
                        comment.beforeTravel
                          ? styles.afterTravelTag
                          : styles.beforeTravelTag
                      }
                    >
                      {comment.beforeTravel
                        ? "여행 경험자"
                        : "여행 미경험자"}
                    </span>
                  </div>
                  {comment.userId ===
                    parseInt(localStorage.getItem("userId")) && (
                    <div className={styles.commentActions}>
                      <span
                        onClick={() =>
                          handleEditComment(comment.commentId, comment.content)
                        }
                      >
                        수정
                      </span>
                      <span
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        삭제
                      </span>
                    </div>
                  )}
                </div>
                {editingCommentId === comment.commentId ? (
                  <div className={styles.editCommentForm}>
                    <textarea
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      className={styles.commentInput}
                    />
                    <button
                      onClick={() => handleUpdateComment(comment.commentId)}
                      className={styles.editCommentButton}
                    >
                      수정 완료
                    </button>
                  </div>
                ) : (
                  <p className={styles.commentContent}>{comment.content}</p>
                )}
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
