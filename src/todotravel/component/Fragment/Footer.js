import React from "react";
import styles from "./Fragment.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} todotravel. All rights reserved.</p>
      <p>Created by Team 11dontcare</p>
    </footer>
  );
};

export default Footer;
