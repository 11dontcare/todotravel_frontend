import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deletePlan, isUserInPlan } from "../../service/PlanService";
import PlanModify from "./PlanModify";
import Modal from "./Modal";
import PlanFriend from "./PlanFriend";
import InvitePlanUser from "./InvitePlanUser";

const PlanPage = () => {
  const navigate = useNavigate();

  const { planId } = useParams();
  console.log(planId);

  const userId = localStorage.getItem("userId");

  const [existsPlanUser, setExistsPlanUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  //모달창
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    isUserInPlan(planId, userId)
      .then((response) => {
        if(response.data){
          setExistsPlanUser(true);
        }else{
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
    if(existsPlanUser === false){
      alert("접근 권한이 없습니다.");
      navigate("/");
    }
  }, [existsPlanUser, navigate]);

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

  return (
    <div>
      {/* <div>
        <p>여행 제목</p>
        <p>여행 시작 일자</p>
        <p>여행 종료 일자</p>
        <p>행정 구역</p>
        <p>지역 선택</p>
        <p>총 예산안</p>
        <p>여행 일정 공유</p>
      </div> */}
      <PlanModify />
      <div>
        <button onClick={handleDelete}>플랜 삭제하기</button>
      </div>
      <div>
        <button>투표 리스트</button>
        <div>
          <button onClick={handleOpenPaticipantsModal}>참여 목록 보기</button>

          <Modal
            show={showParticipantsModal}
            onClose={handleClosePaticipantsModal}
          >
            <PlanFriend onInviteClick={handleOpenInviteModal} />
          </Modal>

          <Modal show={showInviteModal} onClose={handleCloseInviteModal}>
            <InvitePlanUser onBackClick={handleCloseInviteModal} />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
