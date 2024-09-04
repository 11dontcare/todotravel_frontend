import React, { createContext, useContext, useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constant/backendAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    setIsLoggedIn(!!token);
  }, []); // 컴포넌트가 처음 마운트될 때만 실행

  useEffect(() => {}, [isLoggedIn]);

  const logout = () => {
    setIsLoggedIn(false);
  };

  // 여기서 setLogoutFunction을 호출
  useEffect(() => {
    setLogoutFunction(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// logout 함수를 별도로 export
let logoutFunction = () => {};

export const setLogoutFunction = (fn) => {
  logoutFunction = fn;
};

export const logout = () => {
  logoutFunction();
};
