import { NavLink, Outlet, useLocation } from "react-router-dom";
import adminImg from "../../assets/admins/Admins.png";
import { useI18n } from "../../lib/i18n";


export default function AdminDashboard() {
  const loc = useLocation();
  const is = (p) => loc.pathname.startsWith(p);
  const { t } = useI18n();

  return (
    <div className="container admin">
      <header className="admin__header">
        <h1 className="admin__title">Admin panel</h1>
        <nav className="admin__tabs">
          <NavLink to="/admin/costumes" className={`adm-tab ${is("/admin/costumes") ? "is-active" : ""}`}>{t("dashboardAdmin.costumes")}</NavLink>
          <NavLink to="/admin/faq" className={`adm-tab ${is("/admin/faq") ? "is-active" : ""}`}>{t("dashboardAdmin.faq")}</NavLink>
          <NavLink to="/admin/reservations" className={`adm-tab ${is("/admin/reservations") ? "is-active" : ""}`}>{t("dashboardAdmin.reservations")}</NavLink>
          <NavLink to="/admin/orders" className={`adm-tab ${is("/admin/orders") ? "is-active" : ""}`}>{t("dashboardAdmin.orders")}</NavLink>
        </nav>
      </header>

<section className="admin__card">
  {loc.pathname === "/admin" && (
    <img src={adminImg} alt="admin" className="admin__img" />
  )}

  <Outlet />
</section>
    </div>
  );
}
