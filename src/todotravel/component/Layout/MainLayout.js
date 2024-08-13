import React from "react";
import Header from "../Fragment/Header";
import Footer from "../Fragment/Footer";

import styles from "./Layout.module.css";

const MainLayout = ({ children }) => {
  return (
    <div className={styles.mainPage}>
      <Header />
      <div className={styles.mainContent}>{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
