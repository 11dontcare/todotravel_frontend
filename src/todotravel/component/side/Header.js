import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLoggedIn, logout } from "../../service/AuthService";
import { ACCESS_TOKEN } from "../../constant/backendAPI";

import styles from "./Side.module.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 컴포넌트가 렌더링될 때 로그인 상태를 확인
  useEffect(() => {
    const loggedIn = checkIfLoggedIn();
    setIsLoggedIn(loggedIn);
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
        window.alert("로그아웃에 실패했습니다.");
      }
    } else {
      navigate("/login"); // 로그인 페이지로 이동
    }
  };

  return (
    <div className={styles.header}>
      <h1>To Do Travel</h1>
      <p onClick={() => handleNavigation("/plan")}>여행 일정 만들기</p>
      <p onClick={() => handleNavigation("/plan")}>여행 일정 함께하기</p>
      <p onClick={() => handleNavigation("/plan")}>장소 검색하기</p>
      <input placeholder='계획 검색하기' />
      <button onClick={handleAuthClick}>
        {isLoggedIn ? "로그아웃" : "로그인"}
      </button>
    </div>
  );
};

export default Header;
