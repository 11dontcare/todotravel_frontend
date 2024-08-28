import React from "react";
import styles from "./Fragment.module.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>To Do Travel</div>
        <div className={styles.footerLinks}>
          <a href="/#">서비스 소개</a>
          <a href="/#">이용약관</a>
          <a href="/#">개인정보처리방침</a>
          <a href="/#">고객센터</a>
        </div>
        <div className={styles.footerSocial}>
          <a href="/#"><FaFacebook /></a>
          <a href="/#"><FaTwitter /></a>
          <a href="/#"><FaInstagram /></a>
          <a href="/#"><FaLinkedin /></a>
        </div>
        <div className={styles.footerCopyright}>
          <p>© {new Date().getFullYear()} todotravel. All rights reserved.</p>
          <p>Created by Team 11dontcare</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
