import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../lib/auth";

export default function AdminRoute() {
  const user = getUser?.() ?? null;

  if (!user) return <Navigate to="/login" replace />;
  if (user.admin !== true) return <Navigate to="/" replace />;

  return <Outlet />;
}
