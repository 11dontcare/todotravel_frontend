import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkIfLoggedIn, logout } from "../../service/AuthService";

import Modal from "../plan/Modal";
import styles from "./Fragment.module.css";
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";
import { GoTriangleDown } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";
import ParticipantResponseList from "../plan/ParticipantResponseList";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("투두");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAlramModal, setShowAlramModal] = useState(false);

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
      setIsMobileView(window.innerWidth <= 1270);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [location]);

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
    setIsMenuOpen(false);
  };

  const handleAuthClick = async () => {
    if (isLoggedIn) {
      try {
        await logout();
        setIsLoggedIn(false);
        window.alert("로그아웃 되었습니다.");
        navigate("/login");
      } catch (error) {
        console.error("로그아웃 오류:", error);
      }
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
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
    { label: "여행 일정 함께하기", path: "/plan/recruitment" },
    { label: "공유된 플랜보기", path: "/plan-list" },
  ];

  // 플랜 검색 입력 변화 감지
  const handleInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 클릭
  const handleSearchClick = () => {
    console.log(searchKeyword);
    if (searchKeyword.trim()) {
      navigate("/plan/search/" + searchKeyword.trim());
      setSearchKeyword("");
    }
  };

  // 폼 제출
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearchClick();
  };

  // 엔터로도 검색 되도록
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleOpenAlramModal = () => {
    setShowAlramModal(true);
  };

  const handleCloseAlramModal = () => {
    setShowAlramModal(false);
  };

  return (
    <div
      className={`${styles.header} ${
        isTransparent ? styles.transparentHeader : ""
      }`}
    >
      <h1 onClick={() => handleNavigation("/")}>To Do Travel</h1>

      {!isMobileView && (
        <>
          {menuItems.map((item, index) => (
            <p key={index} onClick={() => handleNavigation(item.path)}>
              {item.label}
            </p>
          ))}
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type='text'
              placeholder='계획 검색하기'
              value={searchKeyword}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              type='submit'
              className={styles.searchButton}
              onClick={handleSearchClick}
            >
              <FiSearch />
            </button>
          </form>
        </>
      )}

      <div className={styles.option} ref={menuRef}>
        {isLoggedIn ? (
          <>
            <div className={styles.rightIcons}>
              <FiBell onClick={handleOpenAlramModal} className={styles.bell} />
              <Modal show={showAlramModal} onClose={handleCloseAlramModal}>
                <ParticipantResponseList
                  show={showAlramModal}
                  onClose={handleCloseAlramModal}
                />
              </Modal>
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
          </>
        ) : (
          <div className={styles.authContainer}>
            <button onClick={handleAuthClick} className={styles.loginButton}>
              로그인
            </button>
            {isMobileView && (
              <FiMenu
                className={`${styles.menuIcon} ${
                  isTransparent ? styles.whiteIcon : styles.blackIcon
                }`}
                onClick={toggleMenu}
              />
            )}
          </div>
        )}
        {isMenuOpen && (
          <div className={styles.dropdownMenu}>
            {isLoggedIn ? (
              <>
                <div className={styles.box1}>
                  <h3>{nickname}</h3>
                  <p
                    className={styles.logout}
                    onClick={() => handleMenuItemClick(handleAuthClick)}
                  >
                    로그아웃
                  </p>
                </div>
                <hr className={styles.hr} />
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
                  <p onClick={() => handleMyPageNavigation("my-recruitment")}>
                    모집 중인 여행
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
                {isMobileView && <hr className={styles.hr} />}
              </>
            ) : null}
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
                <form
                  onSubmit={handleSearchSubmit}
                  className={styles.searchForm}
                >
                  <input
                    type='text'
                    placeholder='계획 검색하기'
                    value={searchKeyword}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type='submit'
                    className={styles.searchButton}
                    onClick={handleSearchClick}
                  >
                    <FiSearch />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
