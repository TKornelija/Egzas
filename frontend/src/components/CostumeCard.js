import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";

export default function Card({ costume, compact = false }) {
  const { t } = useI18n();

  return (
    <article
      className="card"
      style={{
        width: 270,
        background: "#131313",
        border: "1px solid #1f1f1f",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* Paveikslėlis */}
      <div
        className="card__media"
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d0d",
          overflow: "hidden",
        }}
      >
        {costume.imageUrls?.[0] ? (
          <img
            src={costume.imageUrls[0]}
            alt={costume.name}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              color: "#777",
              fontSize: 14,
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            Nėra nuotraukos
          </div>
        )}
      </div>

      {/* Kortelės turinys */}
      <div className="card__body" style={{ padding: 16 }}>
        <h3 className="card__title" style={{ marginBottom: 8 }}>
          {costume.name}
        </h3>
        <p style={{ opacity: 0.8, marginBottom: 6 }}>
          {costume.rentalPrice} € / {t("list.perDay")}
        </p>
        <p style={{ opacity: 0.8, marginBottom: 12 }}>
          {t("list.buy")}: {costume.price} €
        </p>
        <div className="card__actions" style={{ display: "flex", gap: 10 }}>
          <Link className="btn btn--ghost" to={`/costumes/${costume.id}`}>
            {t("list.view")}
          </Link>
  {/* 
<Link
  className="btn btn--primary"
  to={`/costumes/${costume.id}?mode=buy`}
>
  {t("list.buyNow")}
</Link>
*/}     
        </div>
      </div>
    </article>
  );
}
