import { createContext, useContext, useState } from "react";
import { getAdmin, adminLogin, adminLogout } from "../lib/adminAuth";

const AdminAuthCtx = createContext(null);

export function AdminAuthProvider({ children }) {
  const admin = getAdmin();
  const [token, setToken] = useState(admin?.token || "");
  const [profile, setProfile] = useState(admin ? { email: admin.email, role: admin.role } : null);
  const isAuthed = !!token;

  const login = (t, info) => {
    setToken(t);
    setProfile(info || null);
    adminLogin({ token: t, email: info?.email, role: info?.role });
  };

  const logout = () => {
    setToken("");
    setProfile(null);
    adminLogout();
  };

  return (
    <AdminAuthCtx.Provider value={{ token, profile, isAuthed, login, logout }}>
      {children}
    </AdminAuthCtx.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthCtx);
