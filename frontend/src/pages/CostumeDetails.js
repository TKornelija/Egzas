import { useParams, Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { apiGet, apiPost } from "../lib/api";
import "../styles/costumeDetails.css";

export default function CostumeDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "buy" ? "buy" : "rent";

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: "" });
  const [reviewError, setReviewError] = useState("");

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

  // Load item and reviews
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGet(`/api/costumes/${id}`);
        setItem(data);

        const reviewData = await apiGet(`/api/costumes/${id}/reviews`);
        setReviews(reviewData);
      } catch (e) {
        console.error(e);
        setError("Nepavyko gauti kostiumo duomenų.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const rentTotal = days * (item?.rentalPrice || 0);
  const buyTotal = qty * (item?.price || 0);

  const isRentValid = mode === "rent" ? size && from && to && days > 0 : true;
  const isBuyValid = mode === "buy" ? size && qty >= 1 : true;
  const canSubmit = isRentValid && isBuyValid;

  async function handleReserve() {
    setError("");
    try {
      if (mode === "rent") {
        if (!canSubmit) return setError("Įveskite visus reikalingus duomenis.");
        const res = await apiPost("/api/reservations", {
          costumeId: id,
          from,
          to,
          size,
        });
        alert(`Rezervacija #${res.id}\n${res.from} → ${res.to}\nSuma: $${res.total}`);
      } else {
        const order = await apiPost("/api/purchase", {
          costumeId: id,
          qty,
          size,
        });
        alert(`Užsakymas #${order.id}\nKiekis: ${order.qty}\nSuma: $${order.total}`);
      }
    } catch (e) {
      setError(e.message || "Užklausa nepavyko");
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewError("");
    if (!newReview.text) return setReviewError("Komentaras privalomas.");
    try {
      const res = await apiPost(`/api/costumes/${id}/reviews`, {
        text: newReview.text,
        costumeId: id,
      });
      setReviews((prev) => [...prev, res]);
      setNewReview({ text: "" });
    } catch (e) {
      setReviewError(e.message || "Nepavyko pridėti atsiliepimo.");
    }
  }

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
          Atgal
        </Link>
      </div>
    );

  return (
    <div className="container">
      <Link to="/costumes" className="btn btn--ghost back-btn">
        ← Atgal
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
            {`${item.rentalPrice} €/diena · Pirkti: ${item.price} €`}
          </p>

          <div className="tabs">
            <button
              onClick={() => setMode("rent")}
              className={`btn ${mode === "rent" ? "btn--primary" : "btn--ghost"}`}
            >
              Nuoma
            </button>
            <button
              onClick={() => setMode("buy")}
              className={`btn ${mode === "buy" ? "btn--primary" : "btn--ghost"}`}
            >
              Pirkimas
            </button>
          </div>

          {item.size?.length > 0 && (
            <div className="sizes-section">
              <div className="sizes-title">Dydžiai:</div>
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
                Nuo:
                <input
                  type="date"
                  min={today}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="input-date"
                />
              </label>
              <label>
                Iki:
                <input
                  type="date"
                  min={from || today}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="input-date"
                />
              </label>
              <div className="total-line">
                Suma: <strong>${rentTotal || 0}</strong> {days ? `(${days} d.)` : ""}
              </div>
            </div>
          ) : (
            <div className="rent-section">
              <label>
                Kiekis:
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
                Suma: <strong>${buyTotal}</strong>
              </div>
            </div>
          )}

          {error && <div className="error-text">{error}</div>}

          <button
            className={`btn reserve-btn ${canSubmit ? "active" : "disabled"}`}
            onClick={handleReserve}
            disabled={!canSubmit}
          >
            {mode === "rent" ? "Rezervuoti" : "Į krepšelį"}
          </button>
        </div>

        {/* Description */}
        <div className="product-description">
          <h2>Aprašymas</h2>
          <p>{item.description}</p>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Atsiliepimai</h2>
          {reviews.length === 0 ? (
            <p>Šiuo metu nėra atsiliepimų.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="review-card">
                <p>{r.text}</p>
                <small>{new Date(r.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          )}

          <form onSubmit={submitReview} className="review-form">
            <h3>Palikite atsiliepimą</h3>
            <textarea
              placeholder="Komentaras"
              value={newReview.text}
              onChange={(e) =>
                setNewReview({ ...newReview, text: e.target.value })
              }
            />
            {reviewError && <div className="error-text">{reviewError}</div>}
            <button type="submit" className="btn btn--primary">
              Siųsti
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
