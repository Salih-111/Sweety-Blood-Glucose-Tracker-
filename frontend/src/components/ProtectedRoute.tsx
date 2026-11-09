import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../context/useAuth";
import AuthCheckingScreen from "./AuthCheckingScreen";

function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  // Wait until session verification completes
  if (isLoading) {
    return <AuthCheckingScreen />;
  }

  // Redirect unauthenticated users to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow authenticated users to access protected pages
  return <Outlet />;
}

export default ProtectedRoute;