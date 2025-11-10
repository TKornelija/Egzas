import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import { useI18n } from "../lib/i18n";
import { useCostumeFilters } from "../components/costumeFilter";
import { filterBySearch } from "../components/Search";
import Card from "../components/CostumeCard";
export default function CostumesList() {
  const { t } = useI18n();
  const COSTUME_FILTERS = useCostumeFilters();
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
          placeholder= {t("costumes.paieska")}
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
            <Card key={it.id} costume={it} />
          ))
        ) : (
          <p>Nerasta kostiumų pagal pasirinktą filtrą arba paiešką.</p>
        )}
      </div>

      {/* Puslapiavimo mygtukai */}
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
