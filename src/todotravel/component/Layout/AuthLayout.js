import React, { useEffect, useState } from "react";
import Footer from "../Fragment/Footer";

import styles from "./Layout.module.css";

import background1 from "../../../image/background1.png";
import background2 from "../../../image/background2.png";
import background3 from "../../../image/background3.png";
import background4 from "../../../image/background4.png";

// 배경 이미지 URL 배열
const backgroundImages = [background1, background2, background3, background4];

const AuthLayout = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    // 랜덤하게 배경 이미지 선택
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImage(backgroundImages[randomIndex]);
  }, []);

  return (
    <div className={styles.authPage}>
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className={styles.contentOverlay}>{children}</div>
      <div className={styles.copyright}>
        <p>© {new Date().getFullYear()} todotravel. All rights reserved.</p>
        <p>Created by Team 11dontcare</p>
      </div>
    </div>
  );
};

export default AuthLayout;
