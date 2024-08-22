import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getFollowing, getFollower } from "../../service/MyPageService";
import { useNavigate } from "react-router-dom";

import styles from "./FollowModal.module.css";

function FollowModal({ userId, isFollowing, onClose }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const userListRef = useRef(null);
  const initialLoadDone = useRef(false);
  const navigate = useNavigate();

  const loadUsers = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = isFollowing
        ? await getFollowing(userId, page)
        : await getFollower(userId, page);

      const responseData = response.data;
      const newUsers = responseData.content;

      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers, ...newUsers];
        return updatedUsers;
      });

      const isLastPage = responseData.last;
      setHasMore(!isLastPage);

      if (!isLastPage) {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      initialLoadDone.current = true;
    }
  }, [userId, isFollowing, page]);

  useEffect(() => {
    setUsers([]);
    setPage(0);
    setHasMore(true);
    initialLoadDone.current = false;
  }, [userId, isFollowing]);

  useEffect(() => {
    if (!initialLoadDone.current) {
      loadUsers();
    }
  }, [loadUsers, initialLoadDone]);

  const handleScroll = useCallback(() => {
    if (!userListRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = userListRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 3) {
      loadUsers();
    }
  }, [loadUsers, isLoading, hasMore]);

  useEffect(() => {
    const currentUserList = userListRef.current;
    if (currentUserList) {
      currentUserList.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentUserList) {
        currentUserList.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const handleUserClick = useCallback((nickname) => {
    navigate(`/mypage/${nickname}`);
    onClose();
  }, [navigate, onClose]);

  const memoizedContent = useMemo(
    () => (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>{isFollowing ? "팔로잉" : "팔로워"}</h2>
          <div className={styles.userList} ref={userListRef}>
            {users.map((user, index) => (
              <div 
                key={`${user.userId}-${index}`} 
                className={styles.userItem}
                onClick={() => handleUserClick(user.nickname)}
              >
                {user.nickname}
              </div>
            ))}
            {isLoading && <div className={styles.loading}>Loading more...</div>}
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    ),
    [users, isFollowing, isLoading, onClose, handleUserClick]
  );

  return memoizedContent;
}

export default React.memo(FollowModal);