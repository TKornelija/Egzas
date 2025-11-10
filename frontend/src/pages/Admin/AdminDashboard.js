import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const loc = useLocation();
  const is = (p) => loc.pathname.startsWith(p);

  return (
    <div className="container admin">
      <header className="admin__header">
        <h1 className="admin__title">Admin panel</h1>
        <nav className="admin__tabs">
          <NavLink to="/admin/pages" className={`adm-tab ${is("/admin/pages") ? "is-active" : ""}`}>Pages</NavLink>
          <NavLink to="/admin/faq" className={`adm-tab ${is("/admin/faq") ? "is-active" : ""}`}>FAQ</NavLink>
          <NavLink to="/admin/users" className={`adm-tab ${is("/admin/users") ? "is-active" : ""}`}>Users</NavLink>
          <NavLink to="/admin/reservations" className={`adm-tab ${is("/admin/reservations") ? "is-active" : ""}`}>Reservations</NavLink>
        </nav>
      </header>

      <section className="admin__card">
        <Outlet />
      </section>
    </div>
  );
}
