import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ element: Component }) => {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 상태가 업데이트된 후 로딩을 종료합니다.
    setLoading(false);
  }, [isLoggedIn]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중임을 나타내는 컴포넌트
  }

  if (!isLoggedIn) {
    // 로컬 스토리지에 메시지 저장
    localStorage.setItem("loginMessage", "로그인 후 이용해주시길 바랍니다.");
    return <Navigate to='/login' />;
  }

  return Component;
};

export default ProtectedRoute;
