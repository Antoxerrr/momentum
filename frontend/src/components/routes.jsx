import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ isAllowed, redirectPath, children }) => {
  if (!isAllowed) {
    return <Navigate replace to={redirectPath} />;
  }

  return children ? children : <Outlet />;
};
