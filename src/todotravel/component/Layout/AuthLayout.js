import React from "react";
import Footer from "../Fragment/Footer";

import styles from "./Layout.module.css";

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authPage}>
      <div className={`${styles.mainContent} ${styles.authContent}`}>{children}</div>
      <Footer />
    </div>
  );
};

export default AuthLayout;
