import React, { createContext, useContext, useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constant/backendAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log("로컬 스토리지에서 가져온 토큰:", token);
    setIsLoggedIn(!!token);
  }, []); // 컴포넌트가 처음 마운트될 때만 실행

  useEffect(() => {
    console.log("isLoggedIn 상태 업데이트됨:", isLoggedIn); // 상태 업데이트 후 로그
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
