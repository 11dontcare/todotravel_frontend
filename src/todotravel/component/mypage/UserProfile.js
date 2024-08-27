import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constant/backendAPI";
import {
  changeNickname,
  changePassword,
  doWithdraw,
  getPersonalProfile,
} from "../../service/MyPageService"; // 이 함수를 만들어야 합니다

import { Modal, Button, Form, Spinner } from "react-bootstrap";
// 부트스트랩 CSS를 import 하되, :global() 선택자를 사용하여 모달 관련 스타일만 전역으로 적용
import bootstrapStyles from "./BootstrapModal.module.css";
import styles from "./UserProfile.module.css";

function UserProfile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
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

  // 회원 탈퇴 관련 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 확인 모달 상태
  const [showWithdrawModal, setShowWithdrawModal] = useState(false); // 처리중 모달 상태
  const [isProcessing, setIsProcessing] = useState(false);

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
      if (error.message === "기존 비밀번호가 일치하지 않습니다.") {
        alert(error.message);
      } else {
        alert("비밀번호 변경 중 오류가 발생했습니다.");
        console.error("비밀번호 변경 실패: ", error);
      }
    }
  };

  // 회원 탈퇴 버튼 클릭 시 확인 모달을 띄우는 함수
  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  // 회원 탈퇴 요청 처리 함수
  const handleWithdraw = async () => {
    setIsProcessing(true);
    setShowWithdrawModal(true);

    try {
      const userId = localStorage.getItem("userId");
      const message = await doWithdraw(userId);

      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem("userId");
      localStorage.removeItem("nickname");
      localStorage.removeItem("role");

      alert(message);
      window.location.href = "/";
    } catch (error) {
      alert(
        "회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요. 오류가 계속 발생하면 고객센터에 문의해주세요."
      );
    } finally {
      setIsProcessing(false);
      setShowWithdrawModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        <div
          className={`${styles.tab} ${
            activeTab === "profile" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          회원 정보
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "deleteAccount" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("deleteAccount")}
        >
          회원 탈퇴
        </div>
      </div>

      {activeTab === "profile" && (
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>로그인 정보</h2>
          <div className={styles.infoContainer}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>아이디</span>
              <span className={styles.infoValue}>
                {isSocialUser
                  ? "소셜 유저는 아이디가 존재하지 않습니다."
                  : profileData.username}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>닉네임</span>
              <span className={styles.infoValue}>{profileData.nickname}</span>
              <button
                onClick={() => setShowNicknameModal(true)}
                className={styles.changeButton}
              >
                변경
              </button>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>가입 유형</span>
              <span className={styles.infoValue}>
                {isSocialUser ? "소셜 가입" : "일반 회원"}
              </span>
            </div>
            {!isSocialUser && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>비밀번호</span>
                <span className={styles.infoValue}>********</span>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className={styles.changeButton}
                >
                  변경
                </button>
              </div>
            )}
          </div>

          <h2 className={styles.sectionTitle}>개인 정보</h2>
          <div className={styles.infoContainer}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>이름</span>
              <span className={styles.infoValue}>{profileData.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>이메일</span>
              <span className={styles.infoValue}>{profileData.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>성별</span>
              <span className={styles.infoValue}>
                {profileData.gender === "MAN" ? "남성" : "여성"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>생년월일</span>
              <span className={styles.infoValue}>{profileData.birthDate}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deleteAccount" && (
        <div className={styles.deleteAccountSection}>
          <h2 className={styles.sectionTitle}>회원 탈퇴</h2>
          <p>
            회원탈퇴 시 개인정보는 즉시 삭제됩니다. 또한 회원님이 생성한 모든
            여행도 삭제되며, 탈퇴처리 이후에는 어떠한 방법으로도 회원님의
            개인정보를 복원할 수 없으니 신중하게 결정하시기 바랍니다.
          </p>
          <div className={styles.deleteButtonContainer}>
            <button
              className={styles.deleteButton}
              onClick={handleShowConfirmModal}
            >
              회원탈퇴
            </button>
          </div>
        </div>
      )}

      {/* 기존 모달 코드 */}
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

      {/* 회원 탈퇴 확인 모달 */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
        dialogClassName={styles.withdrawalModal}
      >
        <Modal.Header closeButton>
          <Modal.Title className={styles.withdrawalTitle}>
            회원 탈퇴 확인
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className={styles.withdrawalWarning}>
            정말로 To Do Travel을 떠나시겠습니까?
          </p>
          <ul className={styles.withdrawalList}>
            <li>모든 개인 정보가 삭제되며 복구할 수 없습니다.</li>
            <li>작성한 모든 여행 계획과 리뷰가 삭제됩니다.</li>
            <li>저장한 북마크와 좋아요 정보가 모두 사라집니다.</li>
            <li>탈퇴 후 동일한 이메일로 재가입이 불가능할 수 있습니다.</li>
          </ul>
          <p className={styles.withdrawalReconsider}>
            To Do Travel과 함께한 소중한 추억들을 정말 모두 지우시겠습니까?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
            className={styles.stayButton}
          >
            To Do Travel 계속 사용하기
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowConfirmModal(false);
              handleWithdraw();
            }}
            className={styles.withdrawButton}
          >
            회원 탈퇴
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 회원 탈퇴 처리 모달 */}
      <Modal
        show={showWithdrawModal}
        onHide={() => setShowWithdrawModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>회원 탈퇴 처리중입니다...</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserProfile;
