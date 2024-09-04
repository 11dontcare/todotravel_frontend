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

import MyPage from "./todotravel/component/mypage/MyPage";
import UserProfile from "./todotravel/component/mypage/UserProfile";

import PlanCreate from "./todotravel/component/plan/PlanCreate";
import PlanPage from "./todotravel/component/plan/PlanPage";
import PlanModify from "./todotravel/component/plan/PlanModify";

import PlanList from "./todotravel/component/plan/PlanList";
import MainPlanList from "./todotravel/component/plan/MainPlanList";
import PlanDetails from "./todotravel/component/plan/PlanDetails";
import ChatContainer from "./todotravel/component/chat/ChatContainer";

import FloatingButton from "./todotravel/component/chat/FloatingButton";

import PlanSearch from "./todotravel/component/plan/PlanSearch";
import RecruitmentList from "./todotravel/component/plan/RecruitmentList";

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
            path='/plan-list'
            element={
              <MainLayout>
                <PlanList />
              </MainLayout>
            }
          />
          <Route
            path='/'
            element={
              <MainLayout>
                <MainPlanList />
              </MainLayout>
            }
          />
          <Route
            path='/plan/:planId/details'
            element={
              <MainLayout>
                <PlanDetails />
              </MainLayout>
            }
          />
          <Route
            path='/plan/search/:keyword'
            element={
              <MainLayout>
                <PlanSearch />
              </MainLayout>
            }
          />
          <Route
            path='/plan/recruitment'
            element={
              <MainLayout>
                <RecruitmentList />
              </MainLayout>
            }
          />
          {/* 로그인 여부 판별 O - 기타 사용자 인증이 필요한 페이지 */}
          <Route
            path='/mypage/:nickname'
            element={
              <MainLayout>
                <ProtectedRoute element={<MyPage />} />
              </MainLayout>
            }
          />
          <Route
            path='/mypage/:nickname/profile'
            element={
              <MainLayout>
                <ProtectedRoute element={<UserProfile />} />
              </MainLayout>
            }
          />
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
          <Route
            path='/chat'
            element={
              <MainLayout>
                <ProtectedRoute element={<ChatContainer />} />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
      {/* 플로팅 버튼을 모든 페이지에서 보이도록 설정 */}
      <FloatingButton />
    </AuthProvider>
  );
}

export default App;
