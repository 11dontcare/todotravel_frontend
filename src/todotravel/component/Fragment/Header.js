import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkIfLoggedIn, logout } from "../../service/AuthService";
import { ACCESS_TOKEN } from "../../constant/backendAPI";

import styles from "./Fragment.module.css";
import { FiBell, FiMessageSquare, FiMenu } from "react-icons/fi";
import { GoTriangleDown } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("투두");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 열림/닫힘 상태
  const [isTransparent, setIsTransparent] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 컴포넌트가 렌더링될 때 로그인 상태를 확인
  useEffect(() => {
    const loggedIn = checkIfLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const getNickname = localStorage.getItem("nickname");
      setNickname(getNickname);
    }

    setIsTransparent(location.pathname === "/" && window.scrollY === 0);

    const handleScroll = () => {
      if (location.pathname === "/") {
        setIsTransparent(window.scrollY === 0);
      }
    };

    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1090);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [location]);

  // 토글 메뉴가 열린 상태에서 다른 곳을 클릭하면 닫히도록
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // 메뉴 항목 클릭 시 메뉴 닫기
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
    setIsMenuOpen(false); // 로그아웃 버튼 클릭 시 메뉴 닫기
  };

  //메뉴 열림/닫힘 토글
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  // 메뉴 항목 클릭 시 메뉴를 닫는 함수
  const handleMenuItemClick = (action) => {
    action();
    setIsMenuOpen(false);
  };

  // 토글 메뉴의 각 소항목 클릭 시 마이페이지의 해당 섹션으로 이동
  const handleMyPageNavigation = (view) => {
    navigate(`/mypage/${nickname}?view=${view}`);
    setIsMenuOpen(false);
  };

  // 화면이 줄어들었을 때 추가될 메뉴 아이템
  const menuItems = [
    { label: "여행 일정 만들기", path: "/plan" },
    { label: "여행 일정 함께하기", path: "/plan" },
    { label: "장소 검색하기", path: "/plan" },
  ];

  return (
    <div
      className={`${styles.header} ${
        isTransparent ? styles.transparentHeader : ""
      }`}
    >
      <h1 onClick={() => handleNavigation("/")}>To Do Travel</h1>

      {!isMobileView ? (
        <>
          {menuItems.map((item, index) => (
            <p key={index} onClick={() => handleNavigation(item.path)}>
              {item.label}
            </p>
          ))}
          <input placeholder="계획 검색하기" />
        </>
      ) : null}

      {isLoggedIn ? (
        <div className={styles.option} ref={menuRef}>
          <div className={styles.rightIcons}>
            <FiBell className={styles.bell} />
            {isMobileView && (
              <FiMenu
                className={`${styles.menuIcon} ${
                  isTransparent ? styles.whiteIcon : styles.blackIcon
                }`}
                onClick={toggleMenu}
              />
            )}
          </div>
          {!isMobileView && (
            <>
              <p onClick={toggleMenu}>{nickname}</p>
              <GoTriangleDown className={styles.down} onClick={toggleMenu} />
            </>
          )}
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              {isMobileView && (
                <>
                  {menuItems.map((item, index) => (
                    <p
                      key={index}
                      onClick={() =>
                        handleMenuItemClick(() => handleNavigation(item.path))
                      }
                    >
                      {item.label}
                    </p>
                  ))}
                  <input placeholder="계획 검색하기" />
                  <hr />
                </>
              )}
              <div className={styles.box1}>
                <h3>{nickname}</h3>
                <p
                  className={styles.logout}
                  onClick={() => handleMenuItemClick(handleAuthClick)}
                >
                  로그아웃
                </p>
              </div>
              <hr />
              <div className={styles.box2}>
                <FaRegStar className={styles.star} />
                <p
                  onClick={() =>
                    handleMenuItemClick(() => navigate(`/mypage/${nickname}`))
                  }
                >
                  마이페이지
                </p>
              </div>
              <div className={styles.boxContent}>
                <p onClick={() => handleMyPageNavigation("my-trips")}>
                  여행 일정 관리
                </p>
                <p onClick={() => handleMyPageNavigation("bookmarked")}>
                  북마크 관리
                </p>
                <p onClick={() => handleMyPageNavigation("liked")}>
                  좋아요 관리
                </p>
                <p onClick={() => handleMyPageNavigation("comments")}>
                  댓글 관리
                </p>
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
