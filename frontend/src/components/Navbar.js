import { Link, NavLink, useNavigate } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();  // один logout и точка

  // админ определяется только через user.admin
  const adminOn = user?.admin === true;

  const logoutHandler = () => {
    logout();           // чистит токены и user
    navigate("/", { replace: true });
  };

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/costumes", label: t("nav.collection") },
    { to: "/how-it-works", label: t("nav.how") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const LangBtn = ({ code }) => (
    <button
      onClick={() => setLang(code)}
      className={`lang__btn ${lang === code ? "is-active" : ""}`}
    >
      {code.toUpperCase()}
    </button>
  );

  return (
    <header className="navbar">
      <div className="container nav__inner">

        {/* Brand */}
        <Link to="/" className="brand" aria-label="Freak Or Treat home">
          Freak <span>Or</span> Treat
        </Link>

        {/* Main nav */}
        <nav className="nav">
          <ul className="nav__list">
            {navItems.map(item => (
              <li key={item.to} className="nav__item">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `nav__link ${isActive ? "is-active" : ""}`
                  }
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side */}
        <div className="nav__right">

          {/* Language selector */}
          <div className="lang">
            <LangBtn code="lt" />
            <LangBtn code="en" />
            <LangBtn code="ru" />
          </div>

          <div className="nav__actions">
            {/* Cart */}
            <Link
              to="/cart"
              className="btn btn--ghost"
              style={{ fontSize: 14, padding: "8px 12px" }}
            >
              🛒 {t("nav.cart")}
            </Link>

            {/* ADMIN MODE */}
            {adminOn && (
              <>
                <Link
                  to="/admin"
                  className="btn btn--ghost"
                  style={{ fontSize: 14, padding: "8px 12px" }}
                >
                  🛡️ Admin panel
                </Link>
                <button
                  onClick={logoutHandler}
                  className="btn btn--primary"
                  style={{ fontSize: 14, padding: "8px 12px" }}
                >
                  Logout (admin)
                </button>
              </>
            )}

            {/* NORMAL USER */}
            {!adminOn && !user && (
              <Link
                to="/login"
                className="btn btn--primary"
                style={{ fontSize: 14, padding: "8px 12px" }}
              >
                👤 {t("nav.login")}
              </Link>
            )}

            {!adminOn && user && (
              <>
                <Link
                  to="/account"
                  className="btn btn--ghost"
                  style={{ fontSize: 14, padding: "8px 12px" }}
                >
                  ✅ Sveikas, {user.email}
                </Link>
                <button
                  onClick={logoutHandler}
                  className="btn btn--primary"
                  style={{ fontSize: 14, padding: "8px 12px" }}
                >
                  Atsijungti
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
