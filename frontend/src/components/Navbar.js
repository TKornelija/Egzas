import { Link, NavLink, useNavigate } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
    const navigate = useNavigate();
    const { user, logout: contextLogout } = useAuthContext();

  // wrapper to navigate after logout
  const logout = () => {
    contextLogout();
    navigate("/");
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
      aria-pressed={lang === code}
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
            {navItems.map((item) => (
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
          <div className="lang">
            <LangBtn code="lt" />
            <LangBtn code="en" />
            <LangBtn code="ru" />
          </div>

          <div className="nav__actions">
            <Link
              to="/cart"
              className="btn btn--ghost"
              style={{ fontSize: 14, padding: "8px 12px" }}
            >
              🛒 {t("nav.cart")}
            </Link>

            {!user ? (
              <Link
                to="/login"
                className="btn btn--primary"
                style={{ fontSize: 14, padding: "8px 12px" }}
              >
                👤 {t("nav.login")}
              </Link>
            ) : (
              <div className="flex gap-2 items-center">
                <Link
                  to="/account"
                  className="btn btn--ghost"
                  style={{ fontSize: 14, padding: "8px 12px" }}
                >
                  ✅ Sveikas, {user.email}
                </Link>

                <button
                  className="btn btn--primary"
                  style={{ fontSize: 14, padding: "8px 12px" }}
                  onClick={logout}
                >
                  Atsijungti
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
