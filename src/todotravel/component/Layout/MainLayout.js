import React from "react";
import Header from "../Fragment/Header";
import Footer from "../Fragment/Footer";
import PlanList from "../plan/PlanList";

import styles from "./Layout.module.css";

import main from "../../../image/main.png";

const MainLayout = ({ children }) => {
  const isPlanList = React.isValidElement(children) && children.type === PlanList;

  return (
    <div className={styles.mainPage}>
      <Header />
      {isPlanList && (
        <div className={styles.homeImgWrapper}>
          <img src={main} alt="홈화면" className={styles.homeImg} />
        </div>
      )}
      <div className={styles.mainContent}>{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
