import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * ProtectedRoute component.
 * Ensures the user has an active authenticated session.
 * If not authenticated, redirects to /login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
