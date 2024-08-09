import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../src/todotravel/component/auth/Login";
import SignUp from "../src/todotravel/component/auth/SignUp";
import PlanCreate from "./todotravel/component/plan/PlanCreate";
import PlanPage from "./todotravel/component/plan/PlanPage";
import PlanModify from "./todotravel/component/plan/PlanModify";

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />

          <Route path='/plan' element={<PlanCreate />} />
          <Route path='/plan/:planId' element={<PlanPage />} />
          <Route path='/plan/:planId/modify' element={<PlanModify />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;