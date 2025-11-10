import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const loc = useLocation();

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 style={{ margin: "0 0 16px" }}>Admin panel</h1>

      {/* Навигация по вкладкам */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Tab to="/admin/pages" active={loc.pathname.startsWith("/admin/pages")}>Pages</Tab>
        <Tab to="/admin/faq"   active={loc.pathname.startsWith("/admin/faq")}>FAQ</Tab>
        <Tab to="/admin/users" active={loc.pathname.startsWith("/admin/users")}>Users</Tab>
      </div>

      {/* Контент вкладок */}
      <div style={{ border: "1px solid #333", borderRadius: 8, padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}

function Tab({ to, active, children }) {
  return (
    <NavLink
      to={to}
      style={{
        padding: "8px 12px",
        border: "1px solid #555",
        borderRadius: 6,
        textDecoration: "none",
        color: active ? "#fff" : "#ddd",
        background: active ? "#111" : "transparent"
      }}
    >
      {children}
    </NavLink>
  );
}
