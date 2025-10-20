import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n"; // 👈 pridėjom

export default function Home() {
  const { t } = useI18n(); // 👈 naudojam vertimų hook'ą

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__title">{t("home.title")}</h1>
          <Link to="/costumes" className="btn btn--primary">
            {t("home.rentNow")}
          </Link>
        </div>
      </section>

      {/* SLIDER DOTS */}
      <div className="dots">
        <span className="dot dot--active" />
        <span className="dot" />
        <span className="dot" />
      </div>

      {/* FEATURED */}
      <section className="featured">
        <div className="container">
          <h2 className="section-title">{t("list.title")}</h2>
        </div>

        <div className="container cards">
          {Array.from({ length: 3 }).map((_, i) => (
            <article className="card" key={i}>
              <div className="card__media" />
              <div className="card__body">
                <h3 className="card__title">Item Title</h3>
                <div className="card__actions">
                  {i === 2 ? (
                    <Link to="/costumes" className="btn btn--primary">
                      {t("home.rentNow")}
                    </Link>
                  ) : (
                    <Link to="/costumes/c1" className="btn btn--ghost">
                      {t("list.view")}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
