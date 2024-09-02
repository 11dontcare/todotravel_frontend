import React from "react";
import Header from "../Fragment/Header";
import Footer from "../Fragment/Footer";
// import PlanList from "../plan/PlanList";
import MainPlanList from "../plan/MainPlanList";

import styles from "./Layout.module.css";

import main from "../../../image/main.png";
import test1 from "../../../image/test3.png";
import { useNavigate } from "react-router-dom";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const isPlanList =
    React.isValidElement(children) && children.type === MainPlanList;

  const handleSharedPlanClick = () => {
    navigate('/plan-list');
  }

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
              <button className={styles.mainButton}>일정 공유하기</button>
              <button onClick={handleSharedPlanClick} className={styles.mainButton}>공유된 플랜보기</button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.mainContent}>{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
