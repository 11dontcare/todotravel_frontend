import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import styles from "./App.module.css";

import SignUp from "./todotravel/component/auth/SignUp";
import Login from "./todotravel/component/auth/Login";
import OAuth2RedirectHandler from "./todotravel/component/auth/OAuth2RedirectHandler";
import AdditionalInfo from "./todotravel/component/auth/AdditionalInfo";
import PlanCreate from "./todotravel/component/plan/PlanCreate";
import PlanPage from "./todotravel/component/plan/PlanPage";
import PlanModify from "./todotravel/component/plan/PlanModify";
import Header from "./todotravel/component/side/Header";
import PlanList from "./todotravel/component/plan/PlanList";

function App() {
  const location = useLocation();

  // 로그인, 회원가입, OAuth2 관련 페이지에서는 헤더를 렌더링하지 않음
  const hideHeaderPaths = ["/login", "/signup", "/oauth2/redirect", "/additional-info"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader ? (
        <div className={styles.page}>
          <Header />
          <div className={styles.content}>
            <Routes>
              <Route path="/" element={<PlanList />} />
              <Route path="/plan" element={<PlanCreate />} />
              <Route path="/plan/:planId" element={<PlanPage />} />
              <Route path="/plan/:planId/modify" element={<PlanModify />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className={styles.authPage}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/oauth2/redirect"
              element={<OAuth2RedirectHandler />}
            />
            <Route path="/additional-info" element={<AdditionalInfo />} />
          </Routes>
        </div>
      )}
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
