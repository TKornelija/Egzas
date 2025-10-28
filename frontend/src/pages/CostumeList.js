import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import { useI18n } from "../lib/i18n";
//import "../styles/costumeList.css"; // pridėk savo stilius

export default function CostumesList() {
  const { t } = useI18n();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGet("/api/costumes"); // traukia visus kostiumus iš MongoDB
        setItems(data);
      } catch (e) {
        console.error(e);
        setError("Nepavyko gauti kostiumų.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Kraunama...</p>;
  if (error) return <p>{error}</p>;
  if (!items.length) return <p>Nėra kostiumų.</p>;

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 className="section-title" style={{ marginBottom: 24 }}>
        {t("list.title")}
      </h1>

      <div
        className="cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        {items.map((it) => (
          <article
            key={it.id}
            className="card"
            style={{
              background: "#131313",
              border: "1px solid #1f1f1f",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              className="card__media"
              style={{
                height: 240,
                backgroundImage: `url(${it.imageUrls?.[0] || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="card__body" style={{ padding: 16 }}>
              <h3 className="card__title" style={{ marginBottom: 8 }}>
                {it.name}
              </h3>
              <p style={{ opacity: 0.8, marginBottom: 6 }}>
                {it.rentalPrice} € / {t("list.perDay")}
              </p>
              <p style={{ opacity: 0.8, marginBottom: 12 }}>
                {t("list.buy")}: {it.price} €
              </p>
              <div
                className="card__actions"
                style={{ display: "flex", gap: 10 }}
              >
                <Link className="btn btn--ghost" to={`/costumes/${it.id}`}>
                  {t("list.view")}
                </Link>
                <Link
                  className="btn btn--primary"
                  to={`/costumes/${it.id}?mode=buy`}
                >
                  {t("list.buyNow")}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
