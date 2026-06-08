import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthRedirect() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/" />;
  }

  return <Navigate to="/home" />;
}