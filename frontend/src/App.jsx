import { Navigate, Route, Routes } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import TasksPage from '@/pages/tasks/tasks.jsx';
import LoginPage from '@/pages/auth/login.jsx';
import RegisterPage from '@/pages/auth/register.jsx';
import { ProtectedRoute } from '@/components/routes.jsx';
import ProfilePage from '@/pages/profile';
import { useUserStore } from '@/store/user.js';
import TaskDetailsPage from '@/pages/tasks/task-details.jsx';
import TaskEditPage from '@/pages/tasks/task-edit.jsx';
import SnippetsListPage from '@/pages/snippets/snippets-list.jsx';
import TrackerProjectsListPage from '@/pages/tracker/projects-list.jsx';
import FinancePage from '@/pages/finance.jsx';
import NotesPage from '@/pages/notes.jsx';

function App() {
  const { checkAuthentication, isAuthenticated } = useUserStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      checkAuthentication: state.checkAuthentication,
    })),
  );

  checkAuthentication();

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login" />
        }
      >
        <Route element={<Navigate replace to="/tasks" />} path="/" />

        <Route element={<TasksPage />} path="/tasks" />
        <Route element={<TaskDetailsPage />} path="/tasks/:taskId" />
        <Route element={<TaskEditPage />} path="/tasks/:taskId/edit" />

        <Route element={<ProfilePage />} path="/profile" />

        <Route element={<SnippetsListPage />} path="/snippets" />

        <Route element={<TrackerProjectsListPage />} path="/tracker/projects" />
        <Route element={<FinancePage />} path="/finance" />
        <Route element={<NotesPage />} path="/notes" />
      </Route>
      <Route
        element={
          <ProtectedRoute isAllowed={!isAuthenticated} redirectPath="/" />
        }
      >
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
      </Route>
    </Routes>
  );
}

export default App;
