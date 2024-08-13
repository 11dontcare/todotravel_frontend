import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLoggedIn, logout } from "../../service/AuthService";
import { ACCESS_TOKEN } from "../../constant/backendAPI";

import styles from "./Fragment.module.css";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { GoTriangleDown } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("투두");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 열림/닫힘 상태
  const navigate = useNavigate();

  // 컴포넌트가 렌더링될 때 로그인 상태를 확인
  useEffect(() => {
    const loggedIn = checkIfLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const getNickname = localStorage.getItem("nickname");
      setNickname(getNickname);
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleAuthClick = async () => {
    if (isLoggedIn) {
      try {
        await logout(); // 서버에 로그아웃 요청
        setIsLoggedIn(false); // 상태 업데이트
        window.alert("로그아웃 되었습니다.");
        navigate("/login"); // 로그인 페이지로 리다이렉트
      } catch (error) {
        console.error("로그아웃 오류:", error);
      }
    } else {
      navigate("/login"); // 로그인 페이지로 이동
    }
  };

  //메뉴 열림/닫힘 토글
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.header}>
      <h1 onClick={() => handleNavigation("/")}>To Do Travel</h1>
      <p onClick={() => handleNavigation("/plan")}>여행 일정 만들기</p>
      <p onClick={() => handleNavigation("/plan")}>여행 일정 함께하기</p>
      <p onClick={() => handleNavigation("/plan")}>장소 검색하기</p>
      <input placeholder='계획 검색하기' />

      {isLoggedIn ? (
        <div className={styles.option}>
          <FiBell className={styles.bell} />
          <FiMessageSquare className={styles.message} />
          <p>{nickname}</p>
          <GoTriangleDown className={styles.down} onClick={toggleMenu} />
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.box1}>
                <h3>{nickname}</h3>
                <p className={styles.logout} onClick={handleAuthClick}>
                  로그아웃
                </p>
              </div>
              <hr />
              <div className={styles.box2}>
                <FaRegStar className={styles.star} />
                <p onClick={() => navigate("/mypage")}>마이페이지</p>
              </div>
              <div className={styles.boxContent}>
                <p>여행 일정 관리</p>
                <p>북마크 관리</p>
                <p>댓글 관리</p>
                <p>좋아요 관리</p>
              </div>
              <div className={styles.box2}>
                <FaRegStar className={styles.star} />
                <p>채팅</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button onClick={handleAuthClick}>로그인</button>
      )}
    </div>
  );
};

export default Header;
