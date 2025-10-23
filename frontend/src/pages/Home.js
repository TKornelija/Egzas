import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useI18n } from "../lib/i18n";

export default function Home() {
  const { t } = useI18n();
  const slides = [
    { id: 0, bg: "hero--one" },
    { id: 1, bg: "hero--two" },
    { id: 2, bg: "hero--three" },
  ];
  const [index, setIndex] = useState(0);

  // Automatinis keitimas kas 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* HERO SLIDER */}
      <section className="hero">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`hero__slide ${s.bg} ${i === index ? "is-active" : ""}`}
          >
            <div className="hero__overlay" />
            <div className="hero__content">
              <h1 className="hero__title">{t("home.title")}</h1>
              <Link to="/costumes" className="btn btn--primary">
                {t("home.rentNow")}
              </Link>
            </div>
          </div>
        ))}

        {/* SLIDER DOTS */}
        <div className="dots">
          {slides.map((s, i) => (
            <span
              key={s.id}
              className={`dot ${i === index ? "dot--active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </section>

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
