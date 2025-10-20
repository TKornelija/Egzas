import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";

export default function CostumesList() {
  const { t } = useI18n();

  // (gali būti ir iš API — čia tiesiog demo)
  const items = [
    { id: "c1", title: "Vampire Queen",  pricePerDay: 40, priceBuy: 120 },
    { id: "c2", title: "Dark Nun",       pricePerDay: 35, priceBuy: 100 },
    { id: "c3", title: "Devil Mistress", pricePerDay: 45, priceBuy: 140 },
  ];

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 className="section-title" style={{ marginBottom: 24 }}>
        {t("list.title")}
      </h1>

      <div
        className="cards"
        style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:24 }}
      >
        {items.map(it => (
          <article key={it.id} className="card" style={{ background:"#131313", border:"1px solid #1f1f1f", borderRadius:14, overflow:"hidden" }}>
            <div className="card__media" style={{ height:240, background:"linear-gradient(180deg,#1f1f1f,#0e0e0e)" }} />
            <div className="card__body" style={{ padding:16 }}>
              <h3 className="card__title" style={{ marginBottom:8 }}>{it.title}</h3>
              <p style={{ opacity:.8, marginBottom:6 }}>
                ${it.pricePerDay}{t("list.perDay")}
              </p>
              <p style={{ opacity:.8, marginBottom:12 }}>
                {t("list.buy")}: ${it.priceBuy}
              </p>
              <div className="card__actions" style={{ display:"flex", gap:10 }}>
                <Link className="btn btn--ghost" to={`/costumes/${it.id}`}>
                  {t("list.view")}
                </Link>
                <Link className="btn btn--primary" to={`/costumes/${it.id}?mode=buy`}>
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
