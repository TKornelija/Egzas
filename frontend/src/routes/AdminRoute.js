import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../lib/auth"; // или твой useAuthContext

export default function AdminRoute() {
  const user = getUser?.() ?? null; // либо возьми из useAuthContext()

  if (!user) return <Navigate to="/login" replace />;
  if (user.admin !== true) return <Navigate to="/" replace />;

  return <Outlet />;
}
