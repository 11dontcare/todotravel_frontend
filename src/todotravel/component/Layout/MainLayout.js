import React, { useRef } from "react";
import Header from "../Fragment/Header";
import Footer from "../Fragment/Footer";
import MainPlanList from "../plan/MainPlanList";
import styles from "./Layout.module.css";
import { useNavigate } from "react-router-dom";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const isPlanList =
    React.isValidElement(children) && children.type === MainPlanList;

  const mainContentRef = useRef(null);

  const handleScrollDown = () => {
    mainContentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.mainPage}>
      <Header />
      {isPlanList && (
        <div className={styles.homeImgWrapper}>
          <div className={styles.overlayTextWrapper}>
            <h1 className={styles.overlayText}>TODO TRAVEL</h1>
            <p className={styles.overlayDescription}>
              본인의 여행 일정을 공유하고 <br /> 함께 여행해보세요.
            </p>
            <div className={styles.buttonWrapper}>
              <button
                onClick={() => navigate("/plan")}
                className={styles.mainButton}
              >
                일정 공유하기
              </button>
              <button
                onClick={() => navigate("/plan-list")}
                className={styles.mainButton}
              >
                공유된 플랜보기
              </button>
            </div>
            <div className={styles.arrowWrapper} onClick={handleScrollDown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width="50"
                height="50"
                className={styles.arrow}
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  className={styles.arrowPath1}
                  d="M30 40 L50 60 L70 40"
                  stroke="#FFF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className={styles.mainContent} ref={mainContentRef}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
