import React from "react";
import styles from "./InviteResponseModal.module.css";

const InviteResponseModal = ({ invite, onAccept, onReject, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>초대 수락</h2>
        <p>{invite.senderName}님이 당신을 초대했습니다.</p>
        <div className={styles.buttonGroup}>
          <button className={styles.acceptButton} onClick={() => onAccept(invite.id)}>
            수락
          </button>
          <button className={styles.rejectButton} onClick={() => onReject(invite.id)}>
            거절
          </button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default InviteResponseModal;

// import React, { useState } from "react";
// import InviteResponseModal from "./InviteResponseModal";

// const SomeComponent = () => {
//   const [showModal, setShowModal] = useState(false);

//   const invite = {
//     id: 1,
//     senderName: "홍길동",
//   };

//   const handleAccept = (inviteId) => {
//     console.log(`Invite ${inviteId} accepted`);
//     // API 호출 등을 통해 초대를 수락하는 로직 추가
//     setShowModal(false);
//   };

//   const handleReject = (inviteId) => {
//     console.log(`Invite ${inviteId} rejected`);
//     // API 호출 등을 통해 초대를 거절하는 로직 추가
//     setShowModal(false);
//   };

//   return (
//     <div>
//       <button onClick={() => setShowModal(true)}>초대 응답 모달 열기</button>
//       {showModal && (
//         <InviteResponseModal
//           invite={invite}
//           onAccept={handleAccept}
//           onReject={handleReject}
//           onClose={() => setShowModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default SomeComponent;