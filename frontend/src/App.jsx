import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import LoginPage from "@/pages/login.jsx";
import RegisterPage from "@/pages/register.jsx";
import {ProtectedRoute} from "@/components/routes.jsx";
import StatisticsPage from "@/pages/statistics.jsx";
import ProfilePage from "@/pages/profile";
import {useUserStore} from "@/store/user.js";
import {useShallow} from "zustand/react/shallow";


function App() {
  const { checkAuthentication, isAuthenticated } = useUserStore(
    useShallow(state => ({
      isAuthenticated: state.isAuthenticated,
      checkAuthentication: state.checkAuthentication
    }))
  )

  checkAuthentication();

  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login"/>}>
        <Route element={<IndexPage/>} path="/"/>
        <Route element={<StatisticsPage/>} path="/statistics"/>
        <Route element={<ProfilePage/>} path="/profile"/>
      </Route>
      <Route element={<ProtectedRoute isAllowed={!isAuthenticated} redirectPath="/"/>}>
        <Route element={<LoginPage/>} path="/login"/>
        <Route element={<RegisterPage/>} path="/register"/>
      </Route>
    </Routes>
  );
}

export default App;
