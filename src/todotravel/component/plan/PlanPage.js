import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deletePlan,
  isUserInPlanAccepted,
  getPlan,
} from "../../service/PlanService";
import Modal from "./Modal";

import PlanModify from "./PlanModify";
import PlanFriend from "./PlanFriend";
import InvitePlanUser from "./InvitePlanUser";
import ScheduleList from "./Schedule/ScheduleList";
import ScheduleCreate from "./Schedule/ScheduleCreate";
import VotePage from "./Vote/VotePage";

import styles from "./Form.module.css";
import { CiCirclePlus } from "react-icons/ci";

const PlanPage = () => {
  const navigate = useNavigate();

  const { planId } = useParams();

  const userId = localStorage.getItem("userId");

  const [existsPlanUser, setExistsPlanUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [scheduleList, setScheduleList] = useState([]);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);

  //모달창
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showVoteListModal, setShowVoteListModal] = useState(false);

  useEffect(() => {
    isUserInPlanAccepted(planId, userId)
      .then((response) => {
        if (response.data) {
          setExistsPlanUser(true);
        } else {
          setExistsPlanUser(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setExistsPlanUser(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (existsPlanUser === false) {
      alert("접근 권한이 없습니다.");
      navigate("/");
    } else {
      fetchScheduleList();
    }
  }, [existsPlanUser, navigate]);

  const fetchScheduleList = () => {
    getPlan(planId)
      .then((response) => {
        setScheduleList(response.data.scheduleList);
      })
      .catch((error) => {
        console.error("일정을 불러오는데 실패했습니다.", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 컴포넌트
  }

  const handleDelete = () => {
    if (window.confirm("플랜을 삭제하시겠습니까?")) {
      deletePlan(planId)
        .then(() => {
          alert("플랜이 삭제되었습니다.");
          navigate("/");
        })
        .catch((e) => {
          console.log(e);
          alert("플랜 삭제에 실패했습니다. 다시 시도해주세요.");
        });
    }
  };

  const handleOpenPaticipantsModal = () => {
    setShowParticipantsModal(true);
  };

  const handleClosePaticipantsModal = () => {
    setShowParticipantsModal(false);
  };

  const handleOpenInviteModal = () => {
    setShowInviteModal(true);
    setShowParticipantsModal(false); // 친구 목록 모달을 닫고 사용자 추가 모달을 엽니다.
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setShowParticipantsModal(true); // 사용자 추가 모달을 닫고 친구 목록 모달을 다시 엽니다.
  };

  const handleOpenVoteListModal = () => {
    setShowVoteListModal(true);
  };

  const handleCloseVoteListModal = () => {
    setShowVoteListModal(false);
  };

  const handleAddSchedule = () => {
    setIsAddingSchedule(true);
  };

  const handleScheduleAdded = (status) => {
    if (status) {
      fetchScheduleList();
      setIsAddingSchedule(false);
    }
  };

  return (
    <div>
      <PlanModify />

      <div className={styles.btnContainer}>
        <button
          className={styles.planButton}
          onClick={handleOpenPaticipantsModal}
        >
          참여 목록 보기
        </button>
        <Modal
          show={showParticipantsModal}
          onClose={handleClosePaticipantsModal}
        >
          <PlanFriend onInviteClick={handleOpenInviteModal} />
        </Modal>

        <Modal show={showInviteModal} onClose={handleCloseInviteModal}>
          <InvitePlanUser onBackClick={handleCloseInviteModal} />
        </Modal>

        <button className={styles.planButton} onClick={handleOpenVoteListModal}>
          투표 리스트
        </button>
        <Modal show={showVoteListModal} onClose={handleCloseVoteListModal}>
          <VotePage onBackClick={handleCloseVoteListModal} />
        </Modal>

        <button className={styles.deleteButton} onClick={handleDelete}>
          플랜 삭제하기
        </button>
      </div>
      {isAddingSchedule ? (
        <ScheduleCreate onScheduleAdded={handleScheduleAdded} />
      ) : (
        <div onClick={handleAddSchedule} className={styles.scheduleCreateBtn}>
          <CiCirclePlus className={styles.plus} />
          <span className={styles.plusLabel}>일정 추가하기</span>
        </div>
      )}
      <ScheduleList scheduleList={scheduleList} />
    </div>
  );
};

export default PlanPage;
