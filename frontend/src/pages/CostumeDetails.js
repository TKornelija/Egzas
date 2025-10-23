import { useParams, Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { apiGet, apiPost } from "../lib/api";
import { useI18n } from "../lib/i18n";
import "../styles/costumeDetails.css";

export default function CostumeDetails() {
  const { t } = useI18n();
  const { id } = useParams();
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "buy" ? "buy" : "rent";

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGet(`/api/costumes/${id}`);
        setItem(data);
      } catch (e) {
        console.error(e);
        setError("Nepavyko gauti kostiumo duomenų.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const [mode, setMode] = useState(initialMode);
  const [size, setSize] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [qty, setQty] = useState(1);

  const today = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  const days = useMemo(() => {
    if (!from || !to) return 0;
    const d1 = new Date(from),
      d2 = new Date(to);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [from, to]);

  if (loading)
    return (
      <div className="container">
        <p>Kraunama...</p>
      </div>
    );

  if (error || !item)
    return (
      <div className="container">
        <p>{error || "Not found."}</p>
        <Link className="btn btn--ghost" to="/costumes">
          {t("details.back")}
        </Link>
      </div>
    );

  const rentTotal = days * item.rentalPrice;
  const buyTotal = qty * item.price;

  const isRentValid = mode === "rent" ? size && from && to && days > 0 : true;
  const isBuyValid = mode === "buy" ? size && qty >= 1 : true;
  const canSubmit = isRentValid && isBuyValid;

  async function handleReserve() {
    setError("");
    try {
      if (mode === "rent") {
        if (!canSubmit)
          return setError(
            t("details.reservedMsg", item.name, from, to, days)
          );
        const res = await apiPost("/api/reservations", {
          costumeId: item.id,
          from,
          to,
          size,
        });
        alert(
          `🎉 Reservation #${res.id}\n${res.from} → ${res.to}\n${t(
            "details.total"
          )}: $${res.total}`
        );
      } else {
        const order = await apiPost("/api/purchase", {
          costumeId: item.id,
          qty,
          size,
        });
        alert(
          `🧾 Order #${order.id}\nQty: ${order.qty}\n${t(
            "details.total"
          )}: $${order.total}`
        );
      }
    } catch (e) {
      setError(e.message || "Request failed");
    }
  }

  // Carousel navigation
  function prevImage() {
    setCurrentImage((prev) =>
      prev === 0 ? item.imageUrls.length - 1 : prev - 1
    );
  }
  function nextImage() {
    setCurrentImage((prev) =>
      prev === item.imageUrls.length - 1 ? 0 : prev + 1
    );
  }

  return (
    <div className="container">
      <Link to="/costumes" className="btn btn--ghost back-btn">
        ← {t("details.back")}
      </Link>

      <div className="costume-grid">
        {/* Carousel */}
        <div className="carousel-wrapper">
          <div
            className="carousel-image"
            style={{ backgroundImage: `url(${item.imageUrls[currentImage]})` }}
          />
          <button className="carousel-arrow left" onClick={prevImage}>
            ◀
          </button>
          <button className="carousel-arrow right" onClick={nextImage}>
            ▶
          </button>
        </div>

        {/* Details */}
        <div className="details">
          <h1>{item.name}</h1>
          <p className="price-line">
            {t("details.priceLine", item.rentalPrice, item.price)}
          </p>

          <div className="tabs">
            <button
              onClick={() => setMode("rent")}
              className={`btn ${mode === "rent" ? "btn--primary" : "btn--ghost"}`}
            >
              {t("details.rent")}
            </button>
            <button
              onClick={() => setMode("buy")}
              className={`btn ${mode === "buy" ? "btn--primary" : "btn--ghost"}`}
            >
              {t("details.buy")}
            </button>
          </div>

          {item.size?.length > 0 && (
            <div className="sizes-section">
              <div className="sizes-title">{t("details.sizes")}:</div>
              <div className="sizes-list">
                {item.size.map((s) => (
                  <button
                    key={s}
                    className={`btn btn--ghost size-btn ${s === size ? "active" : ""}`}
                    onClick={() => setSize(s)}
                    aria-pressed={s === size}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "rent" ? (
            <div className="rent-section">
              <label>
                {t("details.from")}:
                <input
                  type="date"
                  min={today}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="input-date"
                />
              </label>
              <label>
                {t("details.to")}:
                <input
                  type="date"
                  min={from || today}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="input-date"
                />
              </label>
              <div className="total-line">
                {t("details.total")}: <strong>${rentTotal || 0}</strong>{" "}
                {days ? `(${days} ${t("details.days")})` : ""}
              </div>
            </div>
          ) : (
            <div className="rent-section">
              <label>
                {t("details.qty")}:
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="input-date"
                />
              </label>
              <div className="total-line">
                {t("details.total")}: <strong>${buyTotal}</strong>
              </div>
            </div>
          )}

          {error && <div className="error-text">{error}</div>}

          <button
            className={`btn reserve-btn ${canSubmit ? "active" : "disabled"}`}
            onClick={handleReserve}
            disabled={!canSubmit}
          >
            {mode === "rent" ? t("details.reserve") : t("details.addToCart")}
          </button>
        </div>

        {/* Description */}
        <div className="product-description">
          <h2>{t("Aprašymas")}</h2>
          <p>{item.description}</p>
        </div>
      </div>
    </div>
  );
}
