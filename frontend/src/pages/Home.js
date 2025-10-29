import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useI18n } from "../lib/i18n";
import FeaturedCostumes from "../components/FeaturedCostumes";
import HalloweenCountdown from "../components/CountdownTillHeloween";

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
{/*HALLOWEEN COUNTDOWN*/}
      <section>
        <div className="container">
          <HalloweenCountdown />
        </div>
      </section>

          {/* FEATURED COSTUMES*/}
      <section className="featured">
        <div className="container">
          
          <FeaturedCostumes />
        </div>
      </section>
    </div>
  );
}