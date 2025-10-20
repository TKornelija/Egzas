import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useI18n();
  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="logo">{t("brand")}</Link>
        <nav className="nav__menu">
          <NavLink to="/" end>{t("nav.home")}</NavLink>
          <NavLink to="/costumes">{t("nav.collection")}</NavLink>
          <NavLink to="/how-it-works">{t("nav.how")}</NavLink>
          <NavLink to="/faq">{t("nav.faq")}</NavLink>
          <NavLink to="/contact">{t("nav.contact")}</NavLink>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
