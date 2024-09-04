import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ProfileSearch.module.css";
import {
  sendEmailToFindUsername,
  sendEmailToFindPassword,
  findUsername,
} from "../../service/AuthService";

const ProfileSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("id");
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [savedCode, setSavedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [verificationButtonText, setVerificationButtonText] =
    useState("인증번호 발송");

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && savedCode) {
      setSavedCode("");
      setVerificationButtonText("인증 재요청");
      alert("인증 시간이 만료되었습니다. 다시 요청해주세요.");
    }
  }, [timeLeft, savedCode]);

  const formatDate = (dateString) => {
    if (dateString.length !== 8) return "";
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSendVerification = () => {
    setIsLoading(true);
    if (activeTab === "id") {
      const usernameRequest = { name, email };
      sendEmailToFindUsername(usernameRequest)
        .then((response) => {
          setSavedCode(response.data.code);
          setTimeLeft(300); // 5분 = 300초
          setVerificationButtonText("인증 재요청");
          alert(response.message);
        })
        .catch((error) => {
          console.error("인증번호 발송 실패:", error);
          alert(
            error.message || "인증번호 발송에 실패했습니다. 다시 시도해주세요."
          );
        })
        .finally(() => setIsLoading(false));
    } else {
      const formattedBirthDate = formatDate(birthdate);
      if (!formattedBirthDate) {
        alert("올바른 생년월일 형식이 아닙니다.");
        setIsLoading(false);
        return;
      }
      const passwordSearchRequest = {
        name,
        birthDate: formattedBirthDate,
        email,
      };
      sendEmailToFindPassword(passwordSearchRequest)
        .then((response) => {
          setSavedCode(response.data.code);
          setUserId(response.data.userId);
          setTimeLeft(300); // 5분 = 300초
          setVerificationButtonText("인증 재요청");
          alert(response.message);
        })
        .catch((error) => {
          console.error("인증번호 발송 실패:", error);
          alert(
            error.message || "인증번호 발송에 실패했습니다. 다시 시도해주세요."
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verificationCode !== savedCode) {
      alert("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }

    if (activeTab === "id") {
      try {
        const response = await findUsername({ name, email });
        if (response.success) {
          if (response.data.username) {
            // 일반 회원가입 사용자
            navigate("/find-id", {
              state: {
                userType: "regular",
                username: response.data.username,
                name: response.data.name,
                createdDate: response.data.createdDate,
              },
            });
          } else if (response.data.email) {
            // 소셜 로그인 사용자
            navigate("/find-id", {
              state: {
                userType: "social",
                email: response.data.email,
                name: response.data.name,
                createdDate: response.data.createdDate,
                socialType: response.data.socialType,
              },
            });
          }
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.error("아이디 찾기 실패:", error);
        alert(
          error.message || "아이디 찾기에 실패했습니다. 다시 시도해주세요."
        );
      }
    } else {
      navigate("/reset-password", { state: { userId: userId } });
    }
  };

  const renderVerificationButton = () => (
    <div className={styles.verificationButtonContainer}>
      <button
        type='button'
        onClick={handleSendVerification}
        className={styles.verificationButton}
        disabled={
          isLoading ||
          !email ||
          (activeTab === "password" && (!name || !birthdate))
        }
      >
        {isLoading ? "요청 중..." : verificationButtonText}
      </button>
      {isLoading && <span className={styles.spinner}></span>}
    </div>
  );

  const renderIdSearch = () => (
    <>
      <div className={styles.inputField}>
        <label className={styles.label}>이름</label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          placeholder='이름을 입력하세요'
        />
      </div>
      <div className={styles.inputField}>
        <label className={styles.label}>이메일</label>
        <div className={styles.emailVerificationContainer}>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder='이메일을 입력하세요'
          />
          {renderVerificationButton()}
        </div>
      </div>
      {savedCode && (
        <div className={styles.inputField}>
          <label className={styles.label}>인증번호</label>
          <div className={styles.emailVerificationContainer}>
            <input
              type='text'
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={styles.input}
              placeholder='인증번호를 입력하세요'
            />
            {timeLeft > 0 && (
              <span className={styles.timer}>{formatTime(timeLeft)}</span>
            )}
          </div>
        </div>
      )}
    </>
  );

  const renderPasswordSearch = () => (
    <>
      <div className={styles.inputField}>
        <label className={styles.label}>이름</label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          placeholder='이름을 입력하세요'
        />
      </div>
      <div className={styles.inputField}>
        <label className={styles.label}>생년월일</label>
        <input
          type='text'
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className={styles.input}
          placeholder='YYYYMMDD'
        />
      </div>
      <div className={styles.inputField}>
        <label className={styles.label}>이메일</label>
        <div className={styles.emailVerificationContainer}>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder='이메일을 입력하세요'
          />
          {renderVerificationButton()}
        </div>
      </div>
      {savedCode && (
        <div className={styles.inputField}>
          <label className={styles.label}>인증번호</label>
          <div className={styles.emailVerificationContainer}>
            <input
              type='text'
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={styles.input}
              placeholder='인증번호를 입력하세요'
            />
            {timeLeft > 0 && (
              <span className={styles.timer}>{formatTime(timeLeft)}</span>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        <div
          className={`${styles.tab} ${
            activeTab === "id" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("id")}
        >
          아이디 찾기
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "password" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("password")}
        >
          비밀번호 찾기
        </div>
      </div>
      <p className={styles.description}>
        {activeTab === "id"
          ? "회원정보에 등록된 이메일로 아이디를 찾을 수 있습니다."
          : "회원정보에 등록된 이메일로 비밀번호를 재설정할 수 있습니다."}
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {activeTab === "id" ? renderIdSearch() : renderPasswordSearch()}
        <button
          type='submit'
          className={styles.submitButton}
          disabled={!savedCode || !verificationCode}
        >
          인증 확인
        </button>
      </form>
    </div>
  );
};

export default ProfileSearch;
