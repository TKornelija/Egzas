import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  const links = [
    { to: "/returns", label: "Returns" },
    { to: "/shipping", label: "Shipping" },
    { to: "/faq", label: t("nav.faq") },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms" },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="brand brand--sm">Freak <span>Or</span> Treat</div>
          <p className="footer__copy">
            © {new Date().getFullYear()} Freak Or Treat. All rights reserved.
          </p>
        </div>

        <nav className="footer__nav">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="footer__link">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
