import { Navigate } from "react-router-dom";
import { dashboardPathFor, getStoredAuth } from "../utils/api";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role: userRole } = getStoredAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={dashboardPathFor(userRole)} replace />;
  }

  return children;
};

export default ProtectedRoute;
