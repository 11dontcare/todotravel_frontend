import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  changeNickname,
  changePassword,
  getPersonalProfile,
} from "../../service/MyPageService"; // 이 함수를 만들어야 합니다

import { Modal, Button, Form } from "react-bootstrap";
// 부트스트랩 CSS를 import 하되, :global() 선택자를 사용하여 모달 관련 스타일만 전역으로 적용
import bootstrapStyles from "./BootstrapModal.module.css";
import styles from "./UserProfile.module.css";

function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [socialType, setSocialType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { nickname } = useParams();
  const userId = localStorage.getItem("userId");

  // 모달 상태
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // 모달 입력 상태
  const [newNickname, setNewNickname] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 비밀번호 변경 - 비밀번호 확인 오류
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getPersonalProfile(userId);
        setProfileData(response.data);
        setSocialType(response.data.socialType);
        setError(null);
      } catch (error) {
        console.error("Error fetching user profile data: ", error);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmPassword]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  const isSocialUser = ["KAKAO", "NAVER", "GOOGLE"].includes(socialType);

  const handleNicknameSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeNickname({ userId, newNickname });
      setProfileData({ ...profileData, nickname: newNickname });
      localStorage.setItem("nickname", newNickname);
      alert("닉네임 변경 성공");
      setShowNicknameModal(false);
      window.location.reload();
    } catch (error) {
      alert(error.message);
      console.error("닉네임 변경 실패: ", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordError) return;
    try {
      await changePassword({ userId, existingPassword, newPassword });
      alert("비밀번호 변경 성공");
      setShowPasswordModal(false);
    } catch (error) {
      alert(error.message);
      console.error("비밀번호 변경 실패: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>회원 정보</h1>
      <div className={styles.profileSection}>
        <h2>로그인 정보</h2>
        <div className={styles.infoItem}>
          <span>아이디</span>
          <span>
            {isSocialUser
              ? "소셜 유저는 아이디가 존재하지 않습니다."
              : profileData.username}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span>닉네임</span>
          <span>{profileData.nickname}</span>
          <button
            onClick={() => setShowNicknameModal(true)}
            className={styles.changeButton}
          >
            변경
          </button>
        </div>
        <div className={styles.infoItem}>
          <span>가입 유형</span>
          <span>{isSocialUser ? "소셜 가입" : "일반 회원"}</span>
        </div>
        {!isSocialUser && (
          <div className={styles.infoItem}>
            <span>비밀번호</span>
            <span>********</span>
            <button
              onClick={() => setShowPasswordModal(true)}
              className={styles.changeButton}
            >
              변경
            </button>
          </div>
        )}
      </div>
      <div className={styles.profileSection}>
        <h2>개인 정보</h2>
        <div className={styles.infoItem}>
          <span>이름</span>
          <span>{profileData.name}</span>
        </div>
        <div className={styles.infoItem}>
          <span>이메일</span>
          <span>{profileData.email}</span>
        </div>
        <div className={styles.infoItem}>
          <span>성별</span>
          <span>{profileData.gender === "MAN" ? "남성" : "여성"}</span>
        </div>
        <div className={styles.infoItem}>
          <span>생년월일</span>
          <span>{profileData.birthDate}</span>
        </div>
      </div>

      <Modal
        show={showNicknameModal}
        onHide={() => setShowNicknameModal(false)}
        className={bootstrapStyles.modal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>닉네임 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNicknameSubmit}>
            <Form.Group>
              <Form.Label>새 닉네임</Form.Label>
              <Form.Control
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              변경
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {!isSocialUser && (
        <Modal
          show={showPasswordModal}
          onHide={() => setShowPasswordModal(false)}
          className={bootstrapStyles.modal}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>비밀번호 변경</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handlePasswordSubmit}>
              <Form.Group>
                <Form.Label>현재 비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  value={existingPassword}
                  onChange={(e) => setExistingPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>새 비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>새 비밀번호 확인</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <Form.Text className="text-danger">{passwordError}</Form.Text>
                )}
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={!!passwordError}
              >
                변경
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default UserProfile;
