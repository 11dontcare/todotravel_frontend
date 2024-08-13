import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./todotravel/context/AuthContext";
import styles from "./App.module.css";
//ProtectedRoute.js
import ProtectedRoute from "./todotravel/ProtectedRoute";
//Layout
import AuthLayout from "./todotravel/component/Layout/AuthLayout";
import MainLayout from "./todotravel/component/Layout/MainLayout";

import SignUp from "./todotravel/component/auth/SignUp";
import Login from "./todotravel/component/auth/Login";
import ProfileSearch from "./todotravel/component/auth/ProfileSearch";
import UsernameResult from "./todotravel/component/auth/UsernameResult";
import ResetPassword from "./todotravel/component/auth/ResetPassword";
import OAuth2RedirectHandler from "./todotravel/component/auth/OAuth2RedirectHandler";
import AdditionalInfo from "./todotravel/component/auth/AdditionalInfo";
import PlanCreate from "./todotravel/component/plan/PlanCreate";
import PlanPage from "./todotravel/component/plan/PlanPage";
import PlanModify from "./todotravel/component/plan/PlanModify";

import PlanList from "./todotravel/component/plan/PlanList";

//!!!!!!!!!!!!!!!! url은 노출되는 만큼 간결하고 직관적으로 지정하기!!!!!!!!!!!!!!!!

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 로그인 여부 판별 X - Auth 및 메인 페이지 */}
          <Route
            path='/login'
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path='/signup'
            element={
              <AuthLayout>
                <SignUp />
              </AuthLayout>
            }
          />
          <Route
            path='/find-account'
            element={
              <AuthLayout>
                <ProfileSearch />
              </AuthLayout>
            }
          />
          <Route
            path='/find-id'
            element={
              <AuthLayout>
                <UsernameResult />
              </AuthLayout>
            }
          />
          <Route
            path='/reset-password'
            element={
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            }
          />
          <Route
            path='/oauth2/redirect'
            element={
              <AuthLayout>
                <OAuth2RedirectHandler />
              </AuthLayout>
            }
          />
          <Route
            path='/additional-info'
            element={
              <AuthLayout>
                <AdditionalInfo />
              </AuthLayout>
            }
          />
          <Route
            path='/'
            element={
              <MainLayout>
                <PlanList />
              </MainLayout>
            }
          />
          {/* 로그인 여부 판별 O - 기타 사용자 인증이 필요한 페이지 */}
          <Route
            path='/plan'
            element={
              <MainLayout>
                <ProtectedRoute element={<PlanCreate />} />
              </MainLayout>
            }
          />
          <Route
            path='/plan/:planId'
            element={
              <MainLayout>
                <ProtectedRoute element={<PlanPage />} />
              </MainLayout>
            }
          />
          <Route
            path='/plan/:planId/modify'
            element={
              <MainLayout>
                <ProtectedRoute element={<PlanModify />} />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
