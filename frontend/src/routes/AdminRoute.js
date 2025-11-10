import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdminAuthed } from "../lib/adminAuth";

export default function AdminRoute() {
  const ok = isAdminAuthed();
  const loc = useLocation();
  return ok ? <Outlet /> : <Navigate to="/admin/login" replace state={{ from: loc }} />;
}
