import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ❌ Role mismatch (if role is required)
  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}