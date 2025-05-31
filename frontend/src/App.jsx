import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import LoginPage from "@/pages/login.jsx";
import RegisterPage from "@/pages/register.jsx";
import {ProtectedRoute} from "@/components/routes.jsx";
import {useDispatch, useSelector} from "react-redux";
import {checkAuthentication} from "@/store/user.js";
import {useEffect} from "react";
import StatisticsPage from "@/pages/statistics.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  const userIsAuthenticated = useSelector(state => state.user.isAuthenticated);

  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={userIsAuthenticated} redirectPath="/login"/>}>
        <Route index element={<IndexPage/>} path="/"/>
        <Route element={<StatisticsPage/>} path="/statistics"/>
      </Route>
      <Route element={<ProtectedRoute isAllowed={!userIsAuthenticated} redirectPath="/"/>}>
        <Route element={<LoginPage/>} path="/login"/>
        <Route element={<RegisterPage/>} path="/register"/>
      </Route>
    </Routes>
  );
}

export default App;
