import {Navigate, Route, Routes} from "react-router-dom";
import TasksPage from "@/pages/tasks/tasks.jsx";
import LoginPage from "@/pages/auth/login.jsx";
import RegisterPage from "@/pages/auth/register.jsx";
import {ProtectedRoute} from "@/components/routes.jsx";
import ProfilePage from "@/pages/profile";
import {useUserStore} from "@/store/user.js";
import {useShallow} from "zustand/react/shallow";
import TaskDetailsPage from "@/pages/tasks/task-details.jsx";
import TaskEditPage from "@/pages/tasks/task-edit.jsx";
import SnippetsListPage from "@/pages/snippets/snippets-list.jsx";


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
        <Route element={<Navigate to="/tasks" replace />} path="/"/>

        <Route element={<TasksPage/>} path="/tasks"/>
        <Route element={<TaskDetailsPage/>} path="/tasks/:taskId"/>
        <Route element={<TaskEditPage/>} path="/tasks/:taskId/edit"/>

        <Route element={<ProfilePage/>} path="/profile"/>

        <Route element={<SnippetsListPage/>} path="/snippets"/>
      </Route>
      <Route element={<ProtectedRoute isAllowed={!isAuthenticated} redirectPath="/"/>}>
        <Route element={<LoginPage/>} path="/login"/>
        <Route element={<RegisterPage/>} path="/register"/>
      </Route>
    </Routes>
  );
}

export default App;
