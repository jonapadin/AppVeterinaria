import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return user.role === "client" ? (
      <Navigate to="/" replace />
    ) : (
      <Navigate to="/unauthorized" replace />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
