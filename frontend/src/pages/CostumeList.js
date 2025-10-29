import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import { useI18n } from "../lib/i18n";
import { COSTUME_FILTERS } from "../components/costumeFilter";
import { filterBySearch } from "../components/Search";

export default function CostumesList() {
  const { t } = useI18n();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // kiek rodome puslapyje

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGet("/api/costumes");
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

  // Filtravimas pagal kategoriją
  const categoryFiltered = filter === "all"
    ? items
    : items.filter(it => it.category === filter);

  // Filtravimas pagal paiešką
  const filteredItems = filterBySearch(categoryFiltered, searchTerm, ["name"]);

  // Puslapiavimo logika
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (loading) return <p>Kraunama...</p>;
  if (error) return <p>{error}</p>;
  if (!items.length) return <p>Nėra kostiumų.</p>;

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 className="section-title" style={{ marginBottom: 24 }}>
        {t("list.title")}
      </h1>

      {/* Filtrų mygtukai */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {COSTUME_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setFilter(key); setCurrentPage(1); }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #444",
              background: filter === key ? "#444" : "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Paieškos laukelis */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Ieškoti kostiumų..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #444",
            width: "100%",
            maxWidth: 400,
            background: "#131313",
            color: "white",
          }}
        />
      </div>

      {/*Kortelių sąrašas */}
      <div
        className="cards"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: currentItems.length === 1 ? "center" : "flex-start",
        }}
      >
        {currentItems.length > 0 ? (
          currentItems.map((it) => (
            <article
              key={it.id}
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
                  height: 240,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#0d0d0d",
                  overflow: "hidden",
                }}
              >
                {it.imageUrls?.[0] ? (
                  <img
                    src={it.imageUrls[0]}
                    alt={it.name}
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
                  {it.name}
                </h3>
                <p style={{ opacity: 0.8, marginBottom: 6 }}>
                  {it.rentalPrice} € / {t("list.perDay")}
                </p>
                <p style={{ opacity: 0.8, marginBottom: 12 }}>
                  {t("list.buy")}: {it.price} €
                </p>
                <div className="card__actions" style={{ display: "flex", gap: 10 }}>
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
          ))
        ) : (
          <p>Nerasta kostiumų pagal pasirinktą filtrą arba paiešką.</p>
        )}
      </div>

      {/* gPuslapiavimo mygtukai */}
      {totalPages > 1 && (
        <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: "6px 12px",
                background: currentPage === i + 1 ? "#444" : "transparent",
                color: "white",
                border: "1px solid #444",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
