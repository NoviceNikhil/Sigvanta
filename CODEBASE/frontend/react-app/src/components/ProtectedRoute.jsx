import { Navigate } from "react-router-dom";

// ─── ProtectedRoute ────────────────────────────────────────────────────────────
// Wraps routes that require a specific role.
// If user is not logged in → redirect to /login
// If user doesn't have the required role → redirect to /
// If all good → render the page normally

const ProtectedRoute = ({ user, requiredRole, children }) => {
    // Not logged in at all
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role (e.g. regular user trying to access /admin/*)
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    // Authorized — render the page
    return children;
};

export default ProtectedRoute;