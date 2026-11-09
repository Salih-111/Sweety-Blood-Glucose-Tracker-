import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthCheckingScreen from "./components/AuthCheckingScreen";
import useAuth from "./context/useAuth";

function HomeRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AuthCheckingScreen />;
  }

  return (
    <Navigate
      to={user ? "/dashboard" : "/login"}
      replace
    />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;