import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import styles from "./App.module.css";

import Login from "../src/todotravel/component/auth/Login";
import SignUp from "../src/todotravel/component/auth/SignUp";
import PlanCreate from "./todotravel/component/plan/PlanCreate";
import PlanPage from "./todotravel/component/plan/PlanPage";
import PlanModify from "./todotravel/component/plan/PlanModify";
import Header from "./todotravel/component/side/Header";
import PlanList from "./todotravel/component/plan/PlanList";

function App() {
  const location = useLocation();

  // 로그인과 회원가입 페이지에서는 헤더를 렌더링하지 않음
  const hideHeaderPaths = ["/login", "/signup"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader ? (
        <div className={styles.page}>
          <Header />
          <div className={styles.content}>
            <Routes>
              <Route path='/' element={<PlanList />} />
              <Route path='/plan' element={<PlanCreate />} />
              <Route path='/plan/:planId' element={<PlanPage />} />
              <Route path='/plan/:planId/modify' element={<PlanModify />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className={styles.authPage}>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
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
