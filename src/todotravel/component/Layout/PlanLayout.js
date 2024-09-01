import React from "react";
import Header from "../Fragment/Header";
import Footer from "../Fragment/Footer";
import PlanList from "../plan/PlanList";

import styles from "./Layout.module.css";

const PlanLayout = ({ children }) => {
  const isPlanList =
    React.isValidElement(children) && children.type === PlanList;

  return (
    <div className={styles.planPage}>
      <Header />
      <div className={styles.planContent}>{children}</div>
      <Footer />
    </div>
  );
};

export default PlanLayout;
